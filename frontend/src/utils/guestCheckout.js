/**
 * Guest Checkout Helpers
 * Persist checkout data for guests, merge after login
 */

const KEY = "guest_checkout";

export const saveGuestCheckout = (data) => {
    sessionStorage.setItem(KEY, JSON.stringify(data));
};

export const getGuestCheckout = () => {
    const data = sessionStorage.getItem(KEY);
    return data ? JSON.parse(data) : null;
};

export const clearGuestCheckout = () => {
    sessionStorage.removeItem(KEY);
};
