export function getChefDescription(food) {
    // If it's a "simple" description, we enhance it.
    const base = food.desc;
    const ingredients = food.ingredients?.slice(0, 3).join(", ") || "fresh ingredients";
    const method = food.tags?.find(t => t.includes("ed")) || "prepared"; // find "grilled", "baked", etc.

    // 1. Emotion/Texture Keywords based on tags
    let texture = "perfectly balanced";
    if (food.tags?.includes("crispy")) texture = "satisfyingly crispy";
    if (food.tags?.includes("juicy")) texture = "succulently juicy";
    if (food.tags?.includes("creamy")) texture = "rich and velvety";
    if (food.tags?.includes("spicy")) texture = "bold and fiery";

    // 2. Generate "Chef's Voice"
    // "A [texture] masterpiece featuring [ingredients], [method] to perfection."

    const templates = [
        `A ${texture} culinary experience, highlighting ${ingredients}, ${method} with passion.`,
        `Savor the ${texture} notes of this dish, crafted with ${ingredients}.`,
        `Our chef's signature: ${method} ${ingredients} creating a ${texture} delight.`,
        `${base} Elevated with a ${texture} finish.`
    ];

    // Simple deterministic hash to pick same description for same food id
    const index = (food.id || 0) % templates.length;

    return templates[index];
}
