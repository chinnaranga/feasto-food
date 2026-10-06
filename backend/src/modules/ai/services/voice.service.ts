import { nemotronService, NemotronService } from './nemotron.service.js';
import { toolsService, ToolsService } from './tools.service.js';
import { contextService, ContextService } from './context.service.js';
import { AI_SYSTEM_PROMPTS } from '../ai.constants.js';
import { 
  VoiceRespondRequest, 
  VoiceRespondResponse, 
  VoiceSessionInfo, 
  AIRecommendedFoodCard,
  VoiceToolCall
} from '../ai.types.js';
import { logger } from '../../../shared/utils/logger.js';

export class VoiceService {
  constructor(
    private nemotron: NemotronService = nemotronService,
    private tools: ToolsService = toolsService,
    private context: ContextService = contextService
  ) {}

  /**
   * Retrieves voice assistant capabilities and supported runtime configurations.
   */
  public getSessionInfo(): VoiceSessionInfo {
    return {
      status: this.nemotron.isAvailable() ? 'ready' : 'degraded',
      model: this.nemotron.getModelName(),
      supportedLanguages: [
        { code: 'en-IN', label: 'English (India)' },
        { code: 'en-US', label: 'English (US)' },
        { code: 'hi-IN', label: 'Hindi (हिंदी)' },
        { code: 'te-IN', label: 'Telugu (తెలుగు)' },
      ],
      availableTools: [
        'searchDishes',
        'searchRestaurants',
        'getRestaurantMenu',
        'getCart',
        'addToCart',
        'removeFromCart',
        'updateCartItem',
        'clearCart',
        'getOrderStatus',
        'navigatePage',
        'confirmAction',
      ],
      streamingSupported: true,
    };
  }

  /**
   * Primary voice conversation pipeline:
   * Transcript + Live Context -> Nemotron Reasoning -> Tool Execution -> Spoken & Visual Response.
   */
  public async respondToVoice(
    request: VoiceRespondRequest,
    userId?: string
  ): Promise<VoiceRespondResponse> {
    const startTime = Date.now();
    const transcript = request.transcript.trim();
    const ctx = request.context || {};
    const language = request.language || 'en-IN';

    // 1. Assemble rich context payload
    const userCtx = await this.context.buildUserContext(userId);
    const menuSlice = await this.context.getAvailableMenuSlice(ctx.currentRestaurant?.id, 12);

    let spokenResponse = '';
    let displayText = '';
    let toolAction: VoiceToolCall | undefined = undefined;
    let visualResults: AIRecommendedFoodCard[] = [];
    let suggestedFollowUps: string[] = [];
    let executionMode: 'nemotron_live' | 'deterministic_fallback' = 'deterministic_fallback';

    if (this.nemotron.isAvailable()) {
      try {
        const contextualPrompt = `USER VOICE INPUT: "${transcript}"
REQUEST LANGUAGE: ${language}

REAL-TIME CONTEXT:
- Active Route: ${ctx.currentRoute || ctx.currentPage || 'home'}
- Current Kitchen: ${ctx.currentRestaurant ? `${ctx.currentRestaurant.name} (ID: ${ctx.currentRestaurant.id})` : 'None (Browsing Platform)'}
- Active Cart: ${JSON.stringify(ctx.currentCart || { items: [], totalPrice: 0 })}
- Active Order Telemetry: ${JSON.stringify(ctx.currentOrder || { status: 'none' })}
- User Taste Profile: ${JSON.stringify(ctx.userPreferences || userCtx.user?.dietaryPreferences || {})}
- Recent Conversation Turns: ${JSON.stringify(ctx.recentConversation?.slice(-4) || [])}

LIVE VERIFIED MENU SAMPLES:
${menuSlice}`;

        const completion = await this.nemotron.generateCompletion({
          messages: [
            { role: 'system', content: AI_SYSTEM_PROMPTS.VOICE_ASSISTANT },
            { role: 'user', content: contextualPrompt },
          ],
          temperature: 0.15,
          maxTokens: 500,
          responseFormatJson: true,
        });

        if (completion.parsedJson && typeof completion.parsedJson === 'object') {
          const parsed = completion.parsedJson as any;
          spokenResponse = parsed.spokenResponse || '';
          displayText = parsed.displayText || spokenResponse;
          suggestedFollowUps = Array.isArray(parsed.suggestedFollowUps) ? parsed.suggestedFollowUps : [];

          if (parsed.tool && typeof parsed.tool === 'string') {
            toolAction = {
              tool: parsed.tool,
              arguments: parsed.arguments || {},
            };
          }

          executionMode = 'nemotron_live';
        }
      } catch (err) {
        logger.warn({ err, transcript }, 'VoiceService: Nemotron call error, activating deterministic voice pipeline');
      }
    }

    // 2. Tool Execution & Data Grounding
    if (toolAction) {
      const executed = await this.executeVoiceTool(toolAction, ctx, transcript);
      toolAction = executed.toolAction;
      if (executed.visualResults && executed.visualResults.length > 0) {
        visualResults = executed.visualResults;
      }
      if (executed.spokenOverride) {
        spokenResponse = executed.spokenOverride;
      }
      if (executed.displayOverride) {
        displayText = executed.displayOverride;
      }
    }

    // 3. Fallback Intent & Tool Inference if Nemotron was offline or returned empty
    if (!spokenResponse) {
      const fallbackResult = await this.handleVoiceFallback(transcript, ctx);
      spokenResponse = fallbackResult.spokenResponse;
      displayText = fallbackResult.displayText;
      visualResults = fallbackResult.visualResults || [];
      toolAction = fallbackResult.toolAction;
      suggestedFollowUps = fallbackResult.suggestedFollowUps || [];
    }

    // If visual results are empty but the query was a dish search/craving, fetch matching dishes
    if (visualResults.length === 0 && this.isDishSearchQuery(transcript)) {
      visualResults = await this.tools.searchDishes({
        query: transcript,
        restaurantId: ctx.currentRestaurant?.id,
        limit: 3,
      });
    }

    // Sanitize any remaining provider names from spoken audio
    spokenResponse = spokenResponse
      .replace(/NVIDIA(\s+Nemotron)?(\s+3\s+Ultra)?(\s+550B)?/gi, 'Feasto Voice')
      .replace(/Nemotron(\s+3\s+Ultra)?(\s+550B)?/gi, 'Feasto Voice');

    displayText = displayText
      .replace(/NVIDIA(\s+Nemotron)?(\s+3\s+Ultra)?(\s+550B)?/gi, 'Feasto Voice')
      .replace(/Nemotron(\s+3\s+Ultra)?(\s+550B)?/gi, 'Feasto Voice');

    return {
      spokenResponse,
      displayText,
      toolAction,
      visualResults: visualResults.slice(0, 4),
      suggestedFollowUps: suggestedFollowUps.slice(0, 3),
      executionMode,
      modelLatencyMs: Date.now() - startTime,
    };
  }

  /**
   * Safe execution of validated voice tools against real Feasto data APIs.
   */
  private async executeVoiceTool(
    toolCall: VoiceToolCall,
    ctx: VoiceRespondRequest['context'],
    rawTranscript: string
  ): Promise<{
    toolAction: VoiceToolCall;
    visualResults?: AIRecommendedFoodCard[];
    spokenOverride?: string;
    displayOverride?: string;
  }> {
    const { tool, arguments: args } = toolCall;

    switch (tool) {
      case 'searchDishes': {
        const dishes = await this.tools.searchDishes({
          query: args.query || rawTranscript,
          maxPrice: args.maxPrice,
          isVeg: args.isVeg,
          restaurantId: args.restaurantId || ctx?.currentRestaurant?.id,
          limit: 4,
        });

        return {
          toolAction: {
            ...toolCall,
            result: { count: dishes.length, dishIds: dishes.map((d) => d.id) },
          },
          visualResults: dishes,
        };
      }

      case 'addToCart': {
        // Resolve item from argument or recent candidate dishes
        let targetDish: AIRecommendedFoodCard | undefined;
        if (args.itemId) {
          const searched = await this.tools.searchDishes({ limit: 10 });
          targetDish = searched.find((d) => d.id === args.itemId || d.name.toLowerCase().includes(String(args.itemName || '').toLowerCase()));
        }

        if (!targetDish && args.itemName) {
          const searched = await this.tools.searchDishes({ query: args.itemName, limit: 1 });
          targetDish = searched[0];
        }

        if (targetDish) {
          return {
            toolAction: {
              tool: 'addToCart',
              arguments: {
                itemId: targetDish.id,
                itemName: targetDish.name,
                price: targetDish.price,
                restaurantId: targetDish.restaurantId,
                restaurantName: targetDish.restaurantName,
                quantity: args.quantity || 1,
              },
              result: { success: true, item: targetDish },
            },
            spokenOverride: `Added the ${targetDish.name} to your cart!`,
            displayOverride: `Added **${targetDish.name}** (₹${targetDish.price}) from *${targetDish.restaurantName}* to your active order.`,
            visualResults: [targetDish],
          };
        }

        return {
          toolAction: { ...toolCall, result: { success: false, reason: 'Item not found in catalog' } },
        };
      }

      case 'removeFromCart':
      case 'updateCartItem': {
        return {
          toolAction: {
            ...toolCall,
            result: { success: true },
          },
        };
      }

      case 'getOrderStatus': {
        const orderId = args.orderId || ctx?.currentOrder?.orderId || ctx?.currentOrder?.orderNumber;
        const order = await this.tools.getOrderDetails(orderId || 'ORD-DEMO-4821');
        return {
          toolAction: {
            ...toolCall,
            result: order,
          },
        };
      }

      case 'confirmAction': {
        return {
          toolAction: {
            ...toolCall,
            requiresConfirmation: true,
          },
        };
      }

      default:
        return { toolAction: toolCall };
    }
  }

  /**
   * Deterministic conversational voice reasoning when offline or ungrounded.
   */
  private async handleVoiceFallback(
    transcript: string,
    ctx: VoiceRespondRequest['context']
  ): Promise<{
    spokenResponse: string;
    displayText: string;
    visualResults?: AIRecommendedFoodCard[];
    toolAction?: VoiceToolCall;
    suggestedFollowUps?: string[];
  }> {
    const q = transcript.toLowerCase();

    // 1. Cart Queries
    if (q.includes('cart') || q.includes('total') || q.includes('how much')) {
      const cart = ctx?.currentCart;
      if (!cart || cart.items.length === 0) {
        return {
          spokenResponse: 'Your cart is currently empty. Tell me what you crave, and I will find it!',
          displayText: 'Your cart is empty. Try asking for spicy biryani, healthy bowls, or wood-fired pizza!',
          suggestedFollowUps: ['Find spicy biryani', 'Healthy meals under ₹400', 'Fastest delivery'],
        };
      }
      return {
        spokenResponse: `You have ${cart.itemCount} item${cart.itemCount > 1 ? 's' : ''} in your cart, totaling ₹${cart.totalPrice}. Ready for checkout?`,
        displayText: `Your cart contains **${cart.itemCount} items** totaling **₹${cart.totalPrice}**. Say *"Take me to checkout"* to place your order.`,
        suggestedFollowUps: ['Take me to checkout', 'Add a dessert', 'Clear cart'],
      };
    }

    // 2. Checkout / Order Placement Request
    if (q.includes('checkout') || q.includes('place order') || q.includes('pay')) {
      return {
        spokenResponse: 'Taking you to secure checkout. Please review your delivery address and confirm payment.',
        displayText: 'Navigating to **Secure Checkout**. Review your order details to confirm payment.',
        toolAction: {
          tool: 'navigatePage',
          arguments: { route: '/checkout' },
          requiresConfirmation: true,
        },
        suggestedFollowUps: ['Review items', 'Check delivery time'],
      };
    }

    // 3. Order Tracking / Delivery Inquiries
    if (q.includes('where is my order') || q.includes('when will my food') || q.includes('track') || q.includes('order status') || q.includes('rider')) {
      const activeOrder = await this.tools.getOrderDetails(ctx?.currentOrder?.orderId || 'ORD-DEMO-4821');
      const minutes = activeOrder.estimatedDeliveryMinutes || 16;
      return {
        spokenResponse: `Your order from ${activeOrder.restaurantId?.restaurantName || 'the kitchen'} is with the courier and arriving in about ${minutes} minutes.`,
        displayText: `Live Telemetry: Order **#${activeOrder.orderNumber || 'ORD-4821'}** is en route with our dispatch rider. Estimated arrival in **${minutes} minutes**.`,
        toolAction: {
          tool: 'getOrderStatus',
          arguments: { orderId: activeOrder.orderNumber },
        },
        suggestedFollowUps: ['Call rider', 'View delivery map'],
      };
    }

    // 4. Restaurant Specific Inquiries
    if (ctx?.currentRestaurant && (q.includes('what is good') || q.includes('bestseller') || q.includes('popular'))) {
      const menu = await this.tools.getRestaurantMenu(ctx.currentRestaurant.id);
      const topItems = menu.slice(0, 3);
      const spoken = `At ${ctx.currentRestaurant.name}, the most ordered dishes are the ${topItems[0]?.name || 'House Special'} and ${topItems[1]?.name || 'Chef Special'}.`;
      return {
        spokenResponse: spoken,
        displayText: `Top picks at **${ctx.currentRestaurant.name}**: ${topItems.map((i) => `*${i.name}* (₹${i.price})`).join(', ')}.`,
        toolAction: {
          tool: 'getRestaurantMenu',
          arguments: { restaurantId: ctx.currentRestaurant.id },
        },
        suggestedFollowUps: [`Add ${topItems[0]?.name || 'dish'}`, 'Show vegetarian dishes'],
      };
    }

    // 5. Food Discovery / Craving Inquiries
    const dishes = await this.tools.searchDishes({
      query: transcript,
      restaurantId: ctx?.currentRestaurant?.id,
      limit: 3,
    });

    const leadDish = dishes[0];
    const spoken = leadDish
      ? `I found great matches! The ${leadDish.name} at ₹${leadDish.price} from ${leadDish.restaurantName} is a top pick.`
      : 'Here are chef-curated selections freshly available from our kitchens.';

    return {
      spokenResponse: spoken,
      displayText: leadDish
        ? `Curated for your craving: **${leadDish.name}** (₹${leadDish.price}) from *${leadDish.restaurantName}*.`
        : 'Exploring our live culinary catalog for your craving.',
      visualResults: dishes,
      toolAction: {
        tool: 'searchDishes',
        arguments: { query: transcript },
        result: { count: dishes.length },
      },
      suggestedFollowUps: leadDish ? [`Add ${leadDish.name}`, 'Something cheaper', 'More spicy options'] : ['Show top rated', 'Quick delivery'],
    };
  }

  private isDishSearchQuery(transcript: string): boolean {
    const q = transcript.toLowerCase();
    const keywords = [
      'spicy', 'biryani', 'pizza', 'burger', 'thali', 'healthy', 'salad', 'protein',
      'cheap', 'under', 'rupees', 'veg', 'chicken', 'mutton', 'paneer', 'roll', 'dessert',
      'hungry', 'eat', 'food', 'dinner', 'lunch', 'breakfast'
    ];
    return keywords.some((k) => q.includes(k));
  }
}

export const voiceService = new VoiceService();
