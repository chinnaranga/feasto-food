import { loadAIMemory } from "./aiMemory";
import { getTimeSlot } from "./timeBrain";

export function rankFoods(foodList) {
    const memory = loadAIMemory();
    const slot = getTimeSlot();

    return [...foodList]
        .map(food => {
            let score = food.rating || 0;

            // Boost score based on user biases
            if (food.time && parseInt(food.time) <= 25) {
                score += memory.fastBias * 2;
            }

            if (food.discount) {
                score += memory.offerBias * 2;
            }

            if (food.isPopular || food.trending) {
                score += memory.trendingBias * 2;
            }

            // 🧠 TIME INTELLIGENCE
            if (food.bestFor === slot && memory.timeBias && memory.timeBias[slot]) {
                score += memory.timeBias[slot] * 2;
            }

            return { ...food, aiScore: score };
        })
        .sort((a, b) => b.aiScore - a.aiScore);
}
