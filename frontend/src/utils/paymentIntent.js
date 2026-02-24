/**
 * Payment Intent Helpers
 * Persist payment data across login redirects (refresh-safe)
 */

export const savePaymentIntent = (data) => {
    sessionStorage.setItem("payment_intent", JSON.stringify(data));
};

export const getPaymentIntent = () => {
    const data = sessionStorage.getItem("payment_intent");
    return data ? JSON.parse(data) : null;
};

export const clearPaymentIntent = () => {
    sessionStorage.removeItem("payment_intent");
};
