import { loadAIMemory } from "./aiMemory";
import { getTimeSlot } from "./timeBrain";

export function getSurprisePick(foodList) {
    const memory = loadAIMemory();
    const slot = getTimeSlot();

    // 1. Calculate a personalized "probabilistic weight" for each item
    const candidates = foodList.map(food => {
        let weight = 10; // Base weight

        // Boost based on memory
        if (food.time && parseInt(food.time) <= 25) weight += (memory.fastBias * 20);
        if (food.discount) weight += (memory.offerBias * 20);
        if (food.isPopular) weight += (memory.trendingBias * 20);

        // Boost based on time slot
        if (food.bestFor === slot) weight += (memory.timeBias?.[slot] * 30) || 15;

        // Rating boost
        if (food.rating >= 4.5) weight += 15;

        return { ...food, weight };
    });

    // 2. Select randomly based on weights (Weighted Random Selection)
    const totalWeight = candidates.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const item of candidates) {
        if (random < item.weight) return item;
        random -= item.weight;
    }

    return candidates[0]; // Fallback
}
