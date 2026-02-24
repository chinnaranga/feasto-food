/**
 * Razorpay Script Loader
 * Dynamically loads the Razorpay Checkout SDK
 */

export const loadRazorpay = () =>
    new Promise((resolve) => {
        // Check if already loaded
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

/**
 * Check if Razorpay is configured
 */
export const isRazorpayConfigured = () => {
    return !!import.meta.env.VITE_RAZORPAY_KEY_ID;
};
