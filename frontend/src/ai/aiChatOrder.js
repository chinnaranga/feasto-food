export function parseAIOrderIntent(message) {
    const text = message.toLowerCase();

    return {
        light: text.includes("light") || text.includes("healthy"),
        spicy: text.includes("spicy"),
        fast: text.includes("quick") || text.includes("fast"),
        dinner: text.includes("dinner"),
        lunch: text.includes("lunch"),
        breakfast: text.includes("breakfast"),
    };
}
