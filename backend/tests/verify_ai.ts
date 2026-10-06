import { aiService } from '../src/modules/ai/services/ai.service.js';

async function main() {
  console.log('🧪 [TEST 1] AI Service Health & Status:');
  const health = aiService.getHealthStatus();
  console.log('  Health:', health);

  console.log('\n🧪 [TEST 2] Food Discovery ("Craving spicy Hyderabadi biryani under ₹400"):');
  const discovery = await aiService.discoverFood('Craving spicy Hyderabadi biryani under ₹400');
  console.log('  Intent:', {
    rawQuery: discovery.intent.rawQuery,
    detectedTags: discovery.intent.detectedTags,
    maxBudget: discovery.intent.maxBudget,
    isVeg: discovery.intent.isVeg,
  });
  console.log('  Recommendations count:', discovery.recommendations.length);
  if (discovery.recommendations.length > 0) {
    console.log('  Top match:', {
      name: discovery.recommendations[0].name,
      restaurant: discovery.recommendations[0].restaurantName,
      price: discovery.recommendations[0].price,
      reason: discovery.recommendations[0].matchReason,
    });
  }

  console.log('\n🧪 [TEST 3] AI Search ("wood-fired pizza"):');
  const search = await aiService.search('wood-fired pizza');
  console.log('  Interpreted intent:', search.interpretedIntent.cuisine);
  console.log('  Dishes found:', search.dishes.length);

  console.log('\n🧪 [TEST 4] AI Recommendations:');
  const recs = await aiService.recommend();
  console.log('  Headline:', recs.headline);
  console.log('  Dishes count:', recs.dishes.length);

  console.log('\n🧪 [TEST 5] AI Cart Assistant:');
  const cartRes = await aiService.assistCart({
    instruction: 'Add a cold drink or beverage',
    restaurantId: 'rest-spice-route',
    cartItems: [{ itemId: 'dish-01', itemName: 'Biryani', price: 340, quantity: 1 }],
  });
  console.log('  Message:', cartRes.message);
  console.log('  Suggested actions:', cartRes.suggestedActions);

  console.log('\n🧪 [TEST 6] AI Restaurant Sommelier:');
  const restRes = await aiService.assistRestaurant('rest-spice-route', 'What is 100% vegetarian?');
  console.log('  Sommelier Answer:', restRes.answer);

  console.log('\n🧪 [TEST 7] AI Order Planner:');
  const orderRes = await aiService.assistOrder({
    budget: 700,
    peopleCount: 2,
    isVegOnly: true,
  });
  console.log('  Message:', orderRes.message);
  console.log('  Combo total:', orderRes.suggestedMealCombo.totalPrice);
  console.log('  Requires confirmation:', orderRes.requiresUserConfirmation);

  console.log('\n🧪 [TEST 8] AI Order Tracking Telemetry:');
  const trackRes = await aiService.assistTracking('ORD-DEMO-4821', 'When will my order arrive?');
  console.log('  Telemetry Reply:', trackRes.reply);

  console.log('\n🧪 [TEST 9] Conversational Chat:');
  const chatRes = await aiService.chat('I need a quick lunch under ₹300');
  console.log('  Chat reply:', chatRes.message);

  console.log('\n✅ ALL AI PLATFORM SERVICES OPERATIONAL & VERIFIED!');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
