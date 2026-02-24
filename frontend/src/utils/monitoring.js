import { track } from "../analytics/track";

export function initMonitoring() {
    // 1. Global Error Capture
    window.onerror = function (msg, url, line, col, error) {
        track("js_error", {
            msg,
            url,
            line,
            col,
            stack: error?.stack
        });
    };

    // 2. Performance Monitoring (Page Load)
    window.addEventListener("load", () => {
        // Basic Navigation Timing API
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;

        // Core Web Vitals (Simplified)
        // In a real app, use web-vitals library
        track("page_load_metrics", {
            loadTimeMs: loadTime,
            screen: window.location.pathname
        });
    });

    // 3. Unhandled Promise Rejections
    window.addEventListener("unhandledrejection", (event) => {
        track("promise_rejection", { reason: event.reason });
    });
}
