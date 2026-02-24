import { loadAIMemory } from "./aiMemory";
import { getTimeSlot } from "./timeBrain";

export function getAIReason(food) {
    const memory = loadAIMemory();
    const slot = getTimeSlot();

    const reasons = [];

    if (food.time && parseInt(food.time) <= 25 && memory.fastBias > 0.3) {
        reasons.push("⚡ Quick delivery based on your habits");
    }

    if (food.discount && memory.offerBias > 0.3) {
        reasons.push("💸 You often choose discounted items");
    }

    if ((food.isPopular || food.trending) && memory.trendingBias > 0.3) {
        reasons.push("🔥 Trending among users like you");
    }

    if (food.bestFor === slot && memory.timeBias?.[slot] > 0.2) {
        reasons.push(`🕒 Perfect for ${slot} time`);
    }

    if (food.rating >= 4.5) {
        reasons.push("⭐ Highly rated choice");
    }

    return reasons.slice(0, 2); // keep UI clean
}

export function explainWhyRecommended(food, intent) {
    const reasons = [];

    if (intent.light && (food.healthy || (food.nutrition && parseInt(food.nutrition.calories) < 500))) {
        reasons.push("Light & easy to digest");
    }

    if (intent.spicy && (food.spicy || food.spiceLevel > 0)) {
        reasons.push("Matches your spicy craving");
    }

    if (intent.fast && food.time <= 25) {
        reasons.push("Quick to prepare");
    }

    if (intent.dinner && (food.bestFor === "dinner" || food.bestFor === "evening")) {
        reasons.push("Popular dinner choice");
    }

    if (intent.lunch && (food.bestFor === "lunch" || food.bestFor === "afternoon")) {
        reasons.push("Popular lunch choice");
    }

    if (food.rating >= 4.5) {
        reasons.push("Highly rated by users");
    }

    if (food.isPopular) {
        reasons.push("Trending right now");
    }

    return reasons.slice(0, 3); // Keep it short & human
}

export function explainRecommendation(food) {
    const memory = loadAIMemory();
    const reasons = [];

    if (food.time && parseInt(food.time) <= 25 && memory.fastBias > 0.3) {
        reasons.push("⚡ You prefer fast delivery");
    }

    if (food.discount && memory.offerBias > 0.3) {
        reasons.push("💸 You often choose discounted items");
    }

    if ((food.isPopular || food.trending) && memory.trendingBias > 0.3) {
        reasons.push("🔥 You like trending dishes");
    }

    if (food.rating >= 4.5) {
        reasons.push("⭐ Highly rated by users");
    }

    return reasons.slice(0, 2); // keep UI clean
}
