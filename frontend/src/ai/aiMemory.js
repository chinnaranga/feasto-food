import { getTimeSlot } from "./timeBrain";
import { syncAIMemoryToCloud } from "./aiMemoryCloud";
import { getAuth } from "firebase/auth";

const DEFAULT_MEMORY = {
    fastBias: 0,
    offerBias: 0,
    trendingBias: 0,
    timeBias: {
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        late_night: 0,
    },
    lastUpdated: Date.now(),
};

const DECAY_RATE = 0.92; // Taste fades over time
const STEP = 0.15;
const MAX = 1;

function decay(memory) {
    const now = Date.now();
    const hoursPassed = (now - memory.lastUpdated) / (1000 * 60 * 60);

    // Only decay if significant time has passed (e.g. 1 hour)
    if (hoursPassed < 1) return memory;

    return {
        ...memory,
        fastBias: memory.fastBias * DECAY_RATE,
        offerBias: memory.offerBias * DECAY_RATE,
        trendingBias: memory.trendingBias * DECAY_RATE,
        timeBias: {
            breakfast: (memory.timeBias?.breakfast || 0) * DECAY_RATE,
            lunch: (memory.timeBias?.lunch || 0) * DECAY_RATE,
            dinner: (memory.timeBias?.dinner || 0) * DECAY_RATE,
            late_night: (memory.timeBias?.late_night || 0) * DECAY_RATE,
        },
        lastUpdated: now,
    };
}

export function loadAIMemory() {
    try {
        const stored = JSON.parse(localStorage.getItem("aerobite_ai_memory"));
        if (!stored) return DEFAULT_MEMORY;

        // Merge with default to ensure new fields (like timeBias) exist if old memory is loaded
        const merged = { ...DEFAULT_MEMORY, ...stored };
        if (!merged.timeBias) merged.timeBias = DEFAULT_MEMORY.timeBias;

        return decay(merged);
    } catch {
        return DEFAULT_MEMORY;
    }
}

export function updateAIMemory(action) {
    let memory = loadAIMemory();
    const slot = getTimeSlot();

    if (action === "fast_pick") memory.fastBias += STEP;
    if (action === "offer_pick") memory.offerBias += STEP;
    if (action === "trending_pick") memory.trendingBias += STEP;

    // 🧠 Time learning
    if (memory.timeBias && memory.timeBias[slot] !== undefined) {
        memory.timeBias[slot] += 0.3;
        // Clamp time bias
        memory.timeBias[slot] = Math.min(memory.timeBias[slot], MAX);
    }

    // Clamp other biases
    memory.fastBias = Math.min(memory.fastBias, MAX);
    memory.offerBias = Math.min(memory.offerBias, MAX);
    memory.trendingBias = Math.min(memory.trendingBias, MAX);

    memory.lastUpdated = Date.now();

    localStorage.setItem("aerobite_ai_memory", JSON.stringify(memory));

    // ☁️ Sync to Cloud
    const auth = getAuth();
    if (auth.currentUser) {
        syncAIMemoryToCloud(auth.currentUser.uid);
    }
}
