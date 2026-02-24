/**
 * Console Noise Suppressor
 * 
 * Filters out known third-party warnings from payment gateways (Razorpay, Stripe)
 * that are non-fatal and cannot be fixed by application code.
 * 
 * IMPORTANT: Only use in development. In production, keep original console for debugging.
 */

const KNOWN_THIRD_PARTY_PATTERNS = [
    // Razorpay fingerprinting headers (cannot be fixed)
    /Refused to get unsafe header.*x-rtb-fingerprint/i,

    // Permissions policy warnings for device sensors (handled in index.html)
    /Permissions-Policy.*accelerometer/i,
    /Permissions-Policy.*gyroscope/i,
    /Permissions-Policy.*magnetometer/i,

    // Mixed content from Razorpay trying to load localhost images
    /Mixed Content.*localhost.*logo/i,

    // CORS errors from third-party analytics (non-fatal)
    /blocked by CORS policy.*razorpay/i,
    /blocked by CORS policy.*stripe/i,

    // Connection refused for third-party tracking pixels
    /net::ERR_CONNECTION_REFUSED.*image/i,

    // React DevTools recommendation (not an error)
    /Download the React DevTools/i,
];

/**
 * Check if a message should be suppressed
 */
const shouldSuppress = (args) => {
    const message = args.map(arg => String(arg)).join(' ');
    return KNOWN_THIRD_PARTY_PATTERNS.some(pattern => pattern.test(message));
};

/**
 * Initialize console filtering (development only)
 */
export const initConsoleFilter = () => {
    // Only filter in development
    if (import.meta.env.PROD) {
        return;
    }

    const originalWarn = console.warn;
    const originalError = console.error;

    console.warn = (...args) => {
        if (!shouldSuppress(args)) {
            originalWarn.apply(console, args);
        }
    };

    console.error = (...args) => {
        if (!shouldSuppress(args)) {
            originalError.apply(console, args);
        }
    };

    // Log that filtering is active (once)
    console.log(
        '%c[Console Filter] Third-party noise suppression active (dev only)',
        'color: #888; font-size: 11px;'
    );
};

/**
 * List of errors that are SAFE TO IGNORE (for documentation):
 * 
 * ✅ SAFE TO IGNORE:
 * - "Refused to get unsafe header x-rtb-fingerprint-id" 
 *   → Razorpay internal analytics, does not affect payments
 * 
 * - "Permissions-Policy header: Unrecognized feature: 'accelerometer'"
 *   → Razorpay fraud detection, works even without permission
 * 
 * - "Mixed Content: The page was loaded over HTTPS, but requested an insecure element"
 *   → Only happens with localhost images, won't occur in production
 * 
 * - "net::ERR_CONNECTION_REFUSED" for random image URLs
 *   → Third-party tracking pixels, non-fatal
 * 
 * ❌ MUST FIX:
 * - Any JavaScript errors in your own components
 * - Network errors for YOUR API calls (/api/razorpay/*, /api/stripe/*)
 * - "Razorpay not defined" → Script load failure
 * - Payment verification failures
 */
export default initConsoleFilter;
