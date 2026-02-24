import { track } from "../analytics/track";

/**
 * Tracks when an AI recommendation is displayed to the user.
 * @param {string} itemId - The ID or Name of the item shown
 */
export function trackAIShown(itemId) {
    track("ai_reco_shown", { itemId });
}

/**
 * Tracks when a user converts (clicks/adds) an AI recommended item.
 * @param {string} itemId - The ID of the item converted
 */
export function trackAIConverted(itemId) {
    track("ai_reco_converted", { itemId });
}
