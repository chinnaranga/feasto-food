export function getFollowUpQuestion(intent) {
    if (!intent.spicy) {
        return {
            question: "Want something spicier?",
            action: { spicy: true }
        };
    }

    if (!intent.budget) {
        return {
            question: "Should I keep it under ₹200?",
            action: { budget: 200 }
        };
    }

    if (!intent.fast) {
        return {
            question: "Need something quick (under 25 mins)?",
            action: { fast: true }
        };
    }

    return null; // No more follow-ups
}
