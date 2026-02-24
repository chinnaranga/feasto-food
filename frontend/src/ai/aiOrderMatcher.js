export function matchFoodForOrder(foodList, intent) {
    let results = [...foodList];

    if (intent.light) {
        results = results.filter(
            f => f.healthy || (f.nutrition && parseInt(f.nutrition.calories) < 500)
        );
    }

    if (intent.spicy) {
        results = results.filter(f => f.spicy || f.spiceLevel > 0);
    }

    if (intent.fast) {
        results = results.filter(f => f.time <= 25);
    }

    if (intent.dinner) {
        results = results.filter(f => f.bestFor === "dinner" || f.bestFor === "evening" || f.bestFor === "late_night");
    }

    if (intent.lunch) {
        results = results.filter(f => f.bestFor === "lunch" || f.bestFor === "afternoon");
    }

    if (intent.breakfast) {
        results = results.filter(f => f.bestFor === "breakfast" || f.bestFor === "morning");
    }

    // Rank by rating
    results.sort((a, b) => b.rating - a.rating);

    return results.slice(0, 3); // Top 3 suggestions
}
