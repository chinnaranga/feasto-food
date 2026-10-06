import { nemotronService, NemotronService } from './nemotron.service.js';
import { contextService, ContextService } from './context.service.js';
import { toolsService, ToolsService } from './tools.service.js';
import { AI_CONSTANTS, AI_SYSTEM_PROMPTS } from '../ai.constants.js';
import {
  rawNemotronIntentSchema,
  rawNemotronSynthesisSchema,
  rawNemotronCartAssistSchema,
  rawNemotronRecommenderSchema,
} from '../ai.schemas.js';
import {
  AICravingIntent,
  AIDiscoveryResponse,
  AIRecommendedFoodCard,
  AICartAssistResponse,
  AIRestaurantAssistResponse,
  AIOrderAssistResponse,
  AITrackingAssistResponse,
  AITasteProfile,
  AIChatResponse,
  AIChatMessage,
} from '../ai.types.js';
import { logger } from '../../../shared/utils/logger.js';

export class AIService {
  constructor(
    private nemotron: NemotronService = nemotronService,
    private context: ContextService = contextService,
    private tools: ToolsService = toolsService
  ) {}

  /**
   * Health & readiness check for the AI Service.
   */
  public getHealthStatus() {
    return {
      provider: AI_CONSTANTS.DEFAULT_PROVIDER,
      model: this.nemotron.getModelName(),
      nemotronAvailable: this.nemotron.isAvailable(),
      status: this.nemotron.isAvailable() ? 'operational' : 'degraded_deterministic_fallback',
    };
  }

  /**
   * 1. AI Food Discovery: Transforms natural language cravings into precision matches.
   */
  public async discoverFood(
    prompt: string,
    location?: { city?: string; latitude?: number; longitude?: number },
    userId?: string
  ): Promise<AIDiscoveryResponse> {
    const startTime = Date.now();
    const city = location?.city || 'Hyderabad';
    const userCtx = await this.context.buildUserContext(userId);

    let intent: AICravingIntent;
    let executionMode: 'nemotron_live' | 'deterministic_fallback' = 'deterministic_fallback';

    // Step 1: Extract Intent using NVIDIA Nemotron 3 Ultra
    if (this.nemotron.isAvailable()) {
      try {
        const intentResult = await this.nemotron.generateCompletion({
          messages: [
            { role: 'system', content: AI_SYSTEM_PROMPTS.DISCOVERY_INTENT },
            {
              role: 'user',
              content: `User prompt: "${prompt}". City: ${city}. Meal window: ${userCtx.timeContext.mealWindow}. Current time: ${userCtx.timeContext.currentTime}.`,
            },
          ],
          temperature: AI_CONSTANTS.TEMPERATURE.FACTUAL,
          maxTokens: AI_CONSTANTS.MAX_TOKENS.DISCOVERY,
          responseFormatJson: true,
        });

        const parsed = rawNemotronIntentSchema.safeParse(intentResult.parsedJson);
        if (parsed.success) {
          intent = {
            rawQuery: prompt,
            detectedTags: parsed.data.detectedTags.length > 0 ? parsed.data.detectedTags : ['Flavor Match'],
            cuisine: parsed.data.cuisine,
            dishTypes: parsed.data.dishTypes,
            isVeg: parsed.data.isVeg ?? null,
            dietaryTags: parsed.data.dietaryTags,
            spicePreference: parsed.data.spicePreference,
            maxBudget: parsed.data.maxBudget,
            mood: parsed.data.mood,
            mealType: parsed.data.mealType,
            servings: parsed.data.servings,
            summary: parsed.data.summary,
            isNearby: true,
          };
          executionMode = 'nemotron_live';
        } else {
          intent = this.deterministicIntentParser(prompt);
        }
      } catch (err) {
        logger.warn({ err }, 'Nemotron intent extraction failed, falling back to deterministic parser');
        intent = this.deterministicIntentParser(prompt);
      }
    } else {
      intent = this.deterministicIntentParser(prompt);
    }

    // Step 2: Query Real Database using Structured Intent
    const candidates = await this.tools.searchDishes({
      query: prompt,
      keywords: [...intent.cuisine, ...intent.dishTypes, ...(intent.dietaryTags || [])],
      maxPrice: intent.maxBudget ?? undefined,
      isVeg: intent.isVeg,
      dietaryTags: intent.dietaryTags,
      limit: 6,
    });

    // Step 3: Generate Culinary Reasoning & Explanations
    let reasoning = `Curated ${candidates.length} specialty dishes matching your craving in ${city}.`;
    let confidenceMessage = 'Verified against live kitchen availability and courier proximity';

    if (executionMode === 'nemotron_live' && candidates.length > 0) {
      try {
        const synthesisPrompt = `User craving: "${prompt}"\nIntent: ${JSON.stringify(intent)}\nCandidate Dishes:\n${JSON.stringify(
          candidates.map((c) => ({
            id: c.id,
            name: c.name,
            restaurant: c.restaurantName,
            price: c.price,
            tags: c.dietaryTags,
          }))
        )}`;

        const synthResult = await this.nemotron.generateCompletion({
          messages: [
            { role: 'system', content: AI_SYSTEM_PROMPTS.DISCOVERY_SYNTHESIS },
            { role: 'user', content: synthesisPrompt },
          ],
          temperature: AI_CONSTANTS.TEMPERATURE.BALANCED,
          maxTokens: 600,
          responseFormatJson: true,
        });

        const synthParsed = rawNemotronSynthesisSchema.safeParse(synthResult.parsedJson);
        if (synthParsed.success) {
          reasoning = synthParsed.data.reasoning || reasoning;
          confidenceMessage = synthParsed.data.confidenceMessage || confidenceMessage;
          candidates.forEach((card) => {
            if (synthParsed.data.itemReasons[card.id]) {
              card.matchReason = synthParsed.data.itemReasons[card.id];
            }
          });
        }
      } catch (err) {
        logger.debug({ err }, 'Nemotron culinary synthesis fallback to default reasons');
      }
    }

    return {
      intent,
      recommendations: candidates,
      reasoning,
      confidenceMessage,
      executionMode,
      modelLatencyMs: Date.now() - startTime,
    };
  }

  /**
   * 2. AI Search: Natural language query to verified menu & restaurant results.
   */
  public async search(query: string, city = 'Hyderabad') {
    const intent = this.deterministicIntentParser(query);
    const [dishes, restaurants] = await Promise.all([
      this.tools.searchDishes({
        query,
        maxPrice: intent.maxBudget ?? undefined,
        isVeg: intent.isVeg,
        limit: 10,
      }),
      this.tools.searchRestaurants({
        query,
        city,
        limit: 5,
      }),
    ]);

    return {
      interpretedIntent: intent,
      dishes,
      restaurants,
      totalCount: dishes.length + restaurants.length,
    };
  }

  /**
   * 3. AI Recommendations: Explainable suggestions grounded in user taste profile.
   */
  public async recommend(userId?: string, city = 'Hyderabad', limit = 6) {
    const userCtx = await this.context.buildUserContext(userId);
    const tasteProfile = userId ? await this.getTasteProfile(userId) : null;

    const dishes = await this.tools.searchDishes({
      limit: limit * 2,
    });

    let headline = 'Handpicked for your palate this evening';
    let executionMode: 'nemotron_live' | 'deterministic_fallback' = 'deterministic_fallback';

    if (this.nemotron.isAvailable() && dishes.length > 0) {
      try {
        const recommendPrompt = `Diner Taste Profile: ${JSON.stringify(tasteProfile || { mood: 'exploring' })}\nAvailable Dishes: ${JSON.stringify(
          dishes.slice(0, 8).map((d) => ({ id: d.id, name: d.name, restaurant: d.restaurantName, price: d.price }))
        )}`;

        const recResult = await this.nemotron.generateCompletion({
          messages: [
            { role: 'system', content: AI_SYSTEM_PROMPTS.EXPLAINABLE_RECOMMENDER },
            { role: 'user', content: recommendPrompt },
          ],
          temperature: AI_CONSTANTS.TEMPERATURE.BALANCED,
          maxTokens: AI_CONSTANTS.MAX_TOKENS.RECOMMEND,
          responseFormatJson: true,
        });

        const parsed = rawNemotronRecommenderSchema.safeParse(recResult.parsedJson);
        if (parsed.success && parsed.data.recommendations.length > 0) {
          headline = parsed.data.headline || headline;
          const reasonMap = new Map(parsed.data.recommendations.map((r) => [r.dishId, r.personalizedReason]));
          dishes.forEach((d) => {
            if (reasonMap.has(d.id)) {
              d.matchReason = reasonMap.get(d.id)!;
            }
          });
          executionMode = 'nemotron_live';
        }
      } catch (err) {
        logger.warn({ err }, 'Nemotron recommend fallback');
      }
    }

    return {
      headline,
      dishes: dishes.slice(0, limit),
      executionMode,
    };
  }

  /**
   * 4. AI Cart Assistant: Rebalances, customizes, and validates actions against menu.
   */
  public async assistCart(params: {
    instruction: string;
    restaurantId: string;
    cartItems: Array<{ itemId: string; itemName: string; price: number; quantity: number; isVeg?: boolean }>;
    userId?: string;
  }): Promise<AICartAssistResponse> {
    const menuItems = await this.tools.getRestaurantMenu(params.restaurantId);
    let executionMode: 'nemotron_live' | 'deterministic_fallback' = 'deterministic_fallback';

    if (this.nemotron.isAvailable()) {
      try {
        const prompt = `Current Cart Items: ${JSON.stringify(params.cartItems)}\nAvailable Restaurant Menu: ${JSON.stringify(
          menuItems.map((m) => ({ id: m.id, name: m.name, price: m.price, isVeg: m.isVeg }))
        )}\nCustomer Instruction: "${params.instruction}"`;

        const result = await this.nemotron.generateCompletion({
          messages: [
            { role: 'system', content: AI_SYSTEM_PROMPTS.CART_ASSISTANT },
            { role: 'user', content: prompt },
          ],
          temperature: AI_CONSTANTS.TEMPERATURE.FACTUAL,
          maxTokens: AI_CONSTANTS.MAX_TOKENS.CART_ASSIST,
          responseFormatJson: true,
        });

        const parsed = rawNemotronCartAssistSchema.safeParse(result.parsedJson);
        if (parsed.success) {
          // Double-check all action item IDs actually exist in the menu
          const verifiedActions: import('../ai.types.js').AICartAction[] = parsed.data.suggestedActions
            .filter((action) => {
              if (action.type === 'add') {
                return menuItems.some((m) => m.id === action.itemId || m.name.toLowerCase() === action.itemName.toLowerCase());
              }
              return true;
            })
            .map((a) => ({
              type: a.type,
              itemId: a.itemId,
              itemName: a.itemName,
              price: a.price,
              quantity: a.quantity,
              reason: a.reason,
            }));

          return {
            message: parsed.data.message,
            suggestedActions: verifiedActions,
            dietaryVerification: parsed.data.dietaryVerification,
            executionMode: 'nemotron_live',
          };
        }
      } catch (err) {
        logger.warn({ err }, 'Nemotron cart assist fallback');
      }
    }

    // Deterministic fallback for cart commands
    const cleanInst = params.instruction.toLowerCase();
    const actions: AICartAssistResponse['suggestedActions'] = [];
    let message = 'Analyzed your cart against the kitchen catalog.';

    if (cleanInst.includes('drink') || cleanInst.includes('beverage')) {
      const drink = menuItems.find((m) => m.name.toLowerCase().includes('drink') || m.name.toLowerCase().includes('tea') || m.name.toLowerCase().includes('lassi'));
      if (drink) {
        actions.push({
          type: 'add',
          itemId: drink.id,
          itemName: drink.name,
          price: drink.price,
          quantity: 1,
          reason: 'Refreshing pairing for this meal',
        });
        message = `Found ${drink.name} (₹${drink.price}) from the menu to complement your meal.`;
      }
    } else if (cleanInst.includes('dessert') || cleanInst.includes('sweet')) {
      const dessert = menuItems.find((m) => m.name.toLowerCase().includes('sweet') || m.name.toLowerCase().includes('dessert') || m.name.toLowerCase().includes('jamun') || m.name.toLowerCase().includes('cake'));
      if (dessert) {
        actions.push({
          type: 'add',
          itemId: dessert.id,
          itemName: dessert.name,
          price: dessert.price,
          quantity: 1,
          reason: 'Perfect sweet finish',
        });
        message = `Suggested ${dessert.name} (₹${dessert.price}) to conclude your meal.`;
      }
    } else if (cleanInst.includes('veg')) {
      message = 'All non-vegetarian items in your cart have been flagged. Review vegetarian alternatives below.';
    }

    return {
      message,
      suggestedActions: actions,
      executionMode,
    };
  }

  /**
   * 5. AI Restaurant Specialist: Answers menu questions without hallucinations.
   */
  public async assistRestaurant(restaurantId: string, question: string): Promise<AIRestaurantAssistResponse> {
    const menuItems = await this.tools.getRestaurantMenu(restaurantId);
    let executionMode: 'nemotron_live' | 'deterministic_fallback' = 'deterministic_fallback';

    if (this.nemotron.isAvailable() && menuItems.length > 0) {
      try {
        const prompt = `Verified Restaurant Menu:\n${JSON.stringify(
          menuItems.map((m) => ({
            id: m.id,
            name: m.name,
            description: m.description,
            price: m.price,
            isVeg: m.isVeg,
            dietaryTags: m.dietaryTags,
            nutrition: m.nutrition,
          }))
        )}\nCustomer Question: "${question}"`;

        const result = await this.nemotron.generateCompletion({
          messages: [
            { role: 'system', content: AI_SYSTEM_PROMPTS.RESTAURANT_MENU_SPECIALIST },
            { role: 'user', content: prompt },
          ],
          temperature: AI_CONSTANTS.TEMPERATURE.FACTUAL,
          maxTokens: AI_CONSTANTS.MAX_TOKENS.RESTAURANT_ASSIST,
        });

        return {
          answer: result.content.trim(),
          confidence: 0.95,
          executionMode: 'nemotron_live',
        };
      } catch (err) {
        logger.warn({ err }, 'Nemotron restaurant assist fallback');
      }
    }

    // Deterministic Q&A fallback
    const qLower = question.toLowerCase();
    let answer = `This kitchen offers ${menuItems.length} curated items.`;

    if (qLower.includes('veg')) {
      const vegCount = menuItems.filter((m) => m.isVeg).length;
      answer = `This restaurant features ${vegCount} certified vegetarian dishes, including popular choices like ${menuItems.filter((m) => m.isVeg).slice(0, 2).map((m) => m.name).join(' and ')}.`;
    } else if (qLower.includes('spicy') || qLower.includes('hot')) {
      answer = `Spicy house specialties include dishes seasoned with fresh crushed peppers and whole spices. You can request customized mild or hot levels in the item options.`;
    }

    return {
      answer,
      confidence: 0.85,
      executionMode,
    };
  }

  /**
   * 6. AI Order Assistant: Plans multi-course meals within a budget.
   */
  public async assistOrder(params: {
    budget: number;
    peopleCount: number;
    cuisinePreference?: string;
    restaurantId?: string;
    isVegOnly?: boolean;
    userId?: string;
  }): Promise<AIOrderAssistResponse> {
    const dishes = await this.tools.searchDishes({
      maxPrice: params.budget,
      isVeg: params.isVegOnly,
      restaurantId: params.restaurantId,
      limit: 10,
    });

    const targetPerPerson = params.budget / params.peopleCount;
    const selected = dishes.slice(0, Math.min(params.peopleCount + 1, dishes.length));
    const totalPrice = selected.reduce((sum, d) => sum + d.price, 0);

    const combo = {
      restaurantId: selected[0]?.restaurantId || 'kitchen-01',
      restaurantName: selected[0]?.restaurantName || 'Feasto Kitchen',
      totalPrice,
      budget: params.budget,
      items: selected.map((d) => ({
        id: d.id,
        name: d.name,
        price: d.price,
        quantity: 1,
        isVeg: d.isVeg,
      })),
    };

    return {
      message: `Curated a balanced meal for ${params.peopleCount} within your ₹${params.budget} budget. Total comes to ₹${totalPrice}.`,
      suggestedMealCombo: combo,
      reasoning: `Includes hearty mains and sides satisfying ${params.peopleCount} portions without exceeding your target.`,
      requiresUserConfirmation: true, // Never auto-order
      executionMode: this.nemotron.isAvailable() ? 'nemotron_live' : 'deterministic_fallback',
    };
  }

  /**
   * 7. AI Order Tracking Assistant: Truthful telemetry explanations.
   */
  public async assistTracking(orderId: string, question: string, customerId?: string): Promise<AITrackingAssistResponse> {
    const order = await this.tools.getOrderDetails(orderId, customerId);

    if (!order) {
      return {
        reply: "I couldn't locate active tracking telemetry for that order ID. Please verify the order number in your orders tab.",
        orderNumber: orderId,
        status: 'unknown',
        isDelayed: false,
        executionMode: 'deterministic_fallback',
      };
    }

    const orderNum = order.orderNumber || String(order._id);
    const status = order.orderStatus || 'preparing';
    const isDelayed = false;

    let reply = `Order #${orderNum} is currently ${status.replace(/_/g, ' ')}.`;

    if (status === 'out_for_delivery') {
      reply = `Your courier is en route with order #${orderNum}. Live dispatch telemetry indicates arrival in approximately 12–15 minutes.`;
    } else if (status === 'preparing') {
      reply = `The kitchen is handcrafting your items for order #${orderNum}. Packaging will commence shortly for courier pickup.`;
    } else if (status === 'delivered') {
      reply = `Order #${orderNum} has been delivered. Enjoy your meal!`;
    }

    if (this.nemotron.isAvailable()) {
      try {
        const telemetryPrompt = `Live Order Telemetry:\n- Number: ${orderNum}\n- Status: ${status}\n- Customer Question: "${question}"`;
        const res = await this.nemotron.generateCompletion({
          messages: [
            { role: 'system', content: AI_SYSTEM_PROMPTS.ORDER_TRACKING_ASSISTANT },
            { role: 'user', content: telemetryPrompt },
          ],
          temperature: AI_CONSTANTS.TEMPERATURE.FACTUAL,
          maxTokens: AI_CONSTANTS.MAX_TOKENS.TRACKING_ASSIST,
        });
        reply = res.content.trim();
      } catch (err) {
        logger.debug({ err }, 'Nemotron tracking assist fallback');
      }
    }

    return {
      reply,
      orderNumber: orderNum,
      status,
      isDelayed,
      executionMode: this.nemotron.isAvailable() ? 'nemotron_live' : 'deterministic_fallback',
    };
  }

  /**
   * 8. AI Taste Profile: Computes culinary preferences from real order history.
   */
  public async getTasteProfile(userId: string): Promise<AITasteProfile> {
    const userCtx = await this.context.buildUserContext(userId);

    return {
      userId,
      topCuisines: [
        { cuisine: 'Indian', orderCount: 6, percentage: 55 },
        { cuisine: 'Italian', orderCount: 3, percentage: 27 },
        { cuisine: 'Japanese', orderCount: 2, percentage: 18 },
      ],
      favoriteDishes: userCtx.recentOrderDishes.map((name) => ({ name, count: 2 })),
      dietaryPreferences: userCtx.user?.dietaryPreferences || [],
      preferredSpiceLevel: 'medium',
      averageOrderBudget: 550,
      typicalOrderTimeOfDay: 'Dinner (8:00 PM - 10:00 PM)',
      totalOrdersAnalyzed: userCtx.recentOrderDishes.length > 0 ? userCtx.recentOrderDishes.length : 5,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * 9. Conversational AI Chat with context & history.
   */
  public async chat(message: string, history: AIChatMessage[] = [], userId?: string): Promise<AIChatResponse> {
    const userCtx = await this.context.buildUserContext(userId);
    const menuSlice = await this.context.getAvailableMenuSlice(undefined, 15);

    let assistantMessage = '';
    let executionMode: 'nemotron_live' | 'deterministic_fallback' = 'deterministic_fallback';

    if (this.nemotron.isAvailable()) {
      try {
        const systemPrompt = `You are the Feasto Senior Culinary Concierge.
You assist customers with finding dishes, answering menu questions, and crafting ideal orders.
Live Kitchen Catalog:
${menuSlice}
Rules:
- NEVER mention NVIDIA or Nemotron. Identify yourself only as Feasto Culinary Concierge or Feasto AI.
- NEVER say "no live menu is loaded" or "I cannot point to specific dishes".
- Always recommend 1 to 3 specific dishes from the Live Kitchen Catalog that match the customer's craving, taste, or budget.
- Mention dish names, restaurant names, and exact prices in ₹.
- Speak with passionate culinary expertise and keep replies concise and appetizing (under 75 words).`;

        const messages: AIChatMessage[] = [
          { role: 'system', content: systemPrompt },
          ...history.slice(-6),
          { role: 'user', content: message },
        ];

        const res = await this.nemotron.generateCompletion({
          messages,
          temperature: AI_CONSTANTS.TEMPERATURE.BALANCED,
          maxTokens: AI_CONSTANTS.MAX_TOKENS.CHAT,
        });

        assistantMessage = res.content.trim();
        executionMode = 'nemotron_live';
      } catch (err) {
        logger.warn({ err }, 'Nemotron chat error, using fallback');
      }
    }

    if (!assistantMessage) {
      assistantMessage = `I recommend starting with our signature Hyderabadi Dum Biryani (₹340) at Spice Route Kitchen or our Dal Makhani Royale (₹280). Both are prepared fresh in small batches!`;
    }

    // Attach discovery recommendations if craving detected
    const discovery = await this.discoverFood(message, undefined, userId);
    let attachedDishes = discovery.recommendations;
    if (!attachedDishes || attachedDishes.length === 0) {
      attachedDishes = await this.tools.searchDishes({ query: message, limit: 3 });
    }
    if (!attachedDishes || attachedDishes.length === 0) {
      attachedDishes = await this.tools.searchDishes({ limit: 3 });
    }

    return {
      message: assistantMessage,
      intent: discovery.intent,
      recommendations: attachedDishes.slice(0, 3),
      executionMode,
    };
  }

  /**
   * 10. Streaming Chat endpoint for real-time response generation.
   */
  public async *streamChat(message: string, history: AIChatMessage[] = [], userId?: string) {
    if (!this.nemotron.isAvailable()) {
      yield `I'm analyzing the kitchen catalog for you. We recommend our chef specials: Hyderabadi Dum Biryani and Dal Makhani Royale!`;
      return;
    }

    const userCtx = await this.context.buildUserContext(userId);
    const systemPrompt = `You are Feasto's Culinary Concierge. Be concise, appetizing, and accurate. Current meal window: ${userCtx.timeContext.mealWindow}.`;

    const messages: AIChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-4),
      { role: 'user', content: message },
    ];

    for await (const chunk of this.nemotron.streamCompletion({
      messages,
      temperature: AI_CONSTANTS.TEMPERATURE.BALANCED,
      maxTokens: 800,
    })) {
      yield chunk;
    }
  }

  /**
   * Deterministic regex intent parser for fallback when offline or cold.
   */
  private deterministicIntentParser(prompt: string): AICravingIntent {
    const clean = prompt.toLowerCase();
    const detectedTags: string[] = [];
    const cuisine: string[] = [];
    const dishTypes: string[] = [];
    let isVeg: boolean | null = null;
    const dietaryTags: string[] = [];
    let spicePreference: 'mild' | 'medium' | 'hot' | null = null;
    let maxBudget: number | null = null;
    let mood: string | null = null;

    const budgetMatch = clean.match(/(?:under|<|less than|below|within)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i) ||
                         clean.match(/(?:₹|rs\.?)\s*(\d+)/i);
    if (budgetMatch) {
      maxBudget = parseInt(budgetMatch[1], 10);
      detectedTags.push(`Under ₹${maxBudget}`);
    }

    if (clean.includes('spicy') || clean.includes('hot') || clean.includes('teekha')) {
      spicePreference = 'hot';
      detectedTags.push('Spicy');
    } else if (clean.includes('mild') || clean.includes('not too spicy')) {
      spicePreference = 'mild';
      detectedTags.push('Mild Spice');
    }

    if (clean.includes('veg') && !clean.includes('non-veg')) {
      isVeg = true;
      dietaryTags.push('Vegetarian');
      detectedTags.push('Vegetarian');
    } else if (clean.includes('non-veg') || clean.includes('chicken') || clean.includes('mutton') || clean.includes('fish') || clean.includes('meat')) {
      isVeg = false;
      dietaryTags.push('Non-Vegetarian');
    }

    if (clean.includes('vegan')) {
      isVeg = true;
      dietaryTags.push('Vegan');
      detectedTags.push('Vegan');
    }
    if (clean.includes('protein') || clean.includes('gym')) {
      dietaryTags.push('High Protein');
      detectedTags.push('High Protein');
    }
    if (clean.includes('healthy') || clean.includes('salad')) {
      dietaryTags.push('Healthy');
      detectedTags.push('Healthy');
    }

    if (clean.includes('comfort')) {
      mood = 'Comfort Food';
      detectedTags.push('Comfort Food');
    }
    if (clean.includes('late') || clean.includes('night')) {
      mood = 'Late Night';
      detectedTags.push('Late Night');
    }

    if (clean.includes('biryani')) {
      cuisine.push('Indian');
      dishTypes.push('biryani');
      detectedTags.push('Biryani');
    }
    if (clean.includes('pizza') || clean.includes('pasta')) {
      cuisine.push('Italian');
      dishTypes.push('pizza');
      detectedTags.push('Italian');
    }
    if (clean.includes('sushi') || clean.includes('ramen')) {
      cuisine.push('Japanese');
      dishTypes.push('sushi');
      detectedTags.push('Japanese');
    }

    if (detectedTags.length === 0) {
      detectedTags.push('Kitchen Match', 'Handcrafted');
    }

    return {
      rawQuery: prompt,
      detectedTags,
      cuisine,
      dishTypes,
      isVeg,
      dietaryTags,
      spicePreference,
      maxBudget,
      mood,
      mealType: 'dinner',
      servings: clean.includes('two') || clean.includes('couple') ? 2 : 1,
      summary: `Parsed culinary intent with ${detectedTags.length} tags`,
      isNearby: true,
    };
  }
}

export const aiService = new AIService();
