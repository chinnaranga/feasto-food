/**
 * Centralized Analytics Tracker
 * Wraps logging and external providers (e.g., Segment, Mixpanel)
 */
export function track(event, props = {}) {
    // In Development: Log to console
    if (import.meta.env.DEV) {
        console.log("%c[TRACK]", "color: #3b82f6; font-weight: bold;", event, props);
        return;
    }

    // In Production: Call external analytics provider
    // Example: Segment
    if (window.analytics && typeof window.analytics.track === "function") {
        window.analytics.track(event, props);
    }
}
