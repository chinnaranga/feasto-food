export const AeroBiteAI = {
    name: "AeroBot",
    tone: "warm-premium",
    messages: {
        greeting: (name) =>
            `Good evening, ${name}. I’ve found something you’ll love 🍽️`,

        recommendation: (reason) =>
            `I chose this because it matches your preferences — ${reason}.`,

        learning: "Noted 👍 I’ll adapt future picks.",
        fallback: "Let me surprise you with a chef favorite 👨‍🍳",
    },
};
