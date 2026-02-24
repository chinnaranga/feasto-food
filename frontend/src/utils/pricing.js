/**
 * Pricing Utilities
 * Centralized pricing logic with auth-aware discounts
 */

// Fixed discount for authenticated users
export const AUTH_DISCOUNT = 120;

/**
 * Calculate product/restaurant card pricing
 */
export const calculatePrice = ({
    basePrice,
    discount = 0,
    isAuthenticated,
}) => {
    if (!isAuthenticated || discount === 0) {
        return {
            finalPrice: basePrice,
            discountApplied: 0,
            lockedDiscount: discount,
        };
    }

    const discountAmount = (basePrice * discount) / 100;

    return {
        finalPrice: basePrice - discountAmount,
        discountApplied: discountAmount,
        lockedDiscount: 0,
    };
};

/**
 * Get auth-aware checkout pricing
 * Guests see locked discount, logged-in users get ₹120 off
 */
export function getAuthAwarePricing({ total, isAuthenticated }) {
    if (!isAuthenticated) {
        return {
            discount: 0,
            finalTotal: total,
            locked: true,
        };
    }

    const discount = Math.min(AUTH_DISCOUNT, total);
    return {
        discount,
        finalTotal: total - discount,
        locked: false,
    };
}
