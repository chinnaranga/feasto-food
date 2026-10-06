import { aiService } from '../src/modules/ai/services/ai.service.js';
import { nemotronService } from '../src/modules/ai/services/nemotron.service.js';
import { toolsService } from '../src/modules/ai/services/tools.service.js';

describe('Feasto Autonomous AI Service - NVIDIA Nemotron 3 Ultra 550B', () => {
  it('should initialize AI Service with status reporting', () => {
    const health = aiService.getHealthStatus();
    expect(health.provider).toBe('nemotron');
    expect(health.model).toContain('nemotron');
    expect(typeof health.nemotronAvailable).toBe('boolean');
  });

  describe('AI Food Discovery', () => {
    it('should translate natural language craving into structured intent and dishes', async () => {
      const result = await aiService.discoverFood('Craving spicy Hyderabadi biryani under ₹400');
      expect(result).toBeDefined();
      expect(result.intent).toBeDefined();
      expect(result.intent.rawQuery).toContain('biryani');
      expect(result.intent.maxBudget).toBe(400);
      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.recommendations[0].name).toBeDefined();
      expect(result.recommendations[0].price).toBeLessThanOrEqual(400);
    });

    it('should correctly handle vegetarian preference constraints', async () => {
      const result = await aiService.discoverFood('Healthy vegetarian comfort bowl');
      expect(result.intent.isVeg).toBe(true);
      expect(result.recommendations.every((d) => d.isVeg)).toBe(true);
    });
  });

  describe('AI Search', () => {
    it('should interpret search query and return matching items', async () => {
      const searchRes = await aiService.search('wood-fired pizza');
      expect(searchRes).toBeDefined();
      expect(searchRes.interpretedIntent).toBeDefined();
      expect(Array.isArray(searchRes.dishes)).toBe(true);
    });
  });

  describe('AI Cart Assistant', () => {
    it('should propose verified actions matching restaurant menu', async () => {
      const cartRes = await aiService.assistCart({
        instruction: 'Add a cold drink or beverage',
        restaurantId: 'rest-spice-route',
        cartItems: [
          {
            itemId: 'dish-hyd-biryani-01',
            itemName: 'Hyderabadi Dum Biryani',
            price: 340,
            quantity: 1,
            isVeg: false,
          },
        ],
      });

      expect(cartRes).toBeDefined();
      expect(cartRes.message).toBeDefined();
      expect(Array.isArray(cartRes.suggestedActions)).toBe(true);
    });
  });

  describe('AI Restaurant Sommelier', () => {
    it('should answer questions about restaurant menu truthfully', async () => {
      const sommelierRes = await aiService.assistRestaurant('rest-spice-route', 'What is vegetarian here?');
      expect(sommelierRes).toBeDefined();
      expect(sommelierRes.answer).toBeDefined();
      expect(sommelierRes.confidence).toBeGreaterThan(0);
    });
  });

  describe('AI Order Combo Planner', () => {
    it('should curate balanced meal combo without auto-placing orders', async () => {
      const comboRes = await aiService.assistOrder({
        budget: 700,
        peopleCount: 2,
        isVegOnly: true,
      });

      expect(comboRes).toBeDefined();
      expect(comboRes.requiresUserConfirmation).toBe(true);
      expect(comboRes.suggestedMealCombo.totalPrice).toBeLessThanOrEqual(700);
      expect(comboRes.suggestedMealCombo.items.length).toBeGreaterThan(0);
    });
  });

  describe('AI Order Tracking Telemetry', () => {
    it('should provide honest telemetry explanation for active or demo orders', async () => {
      const trackingRes = await aiService.assistTracking('ORD-DEMO-999', 'When will my food arrive?');
      expect(trackingRes).toBeDefined();
      expect(trackingRes.reply).toBeDefined();
      expect(typeof trackingRes.isDelayed).toBe('boolean');
    });
  });

  describe('AI Chat & Conversational Memory', () => {
    it('should process multi-turn conversational culinary query', async () => {
      const chatRes = await aiService.chat('Suggest a dinner for two under ₹600');
      expect(chatRes).toBeDefined();
      expect(chatRes.message).toBeDefined();
      expect(chatRes.recommendations).toBeDefined();
    });
  });
});
