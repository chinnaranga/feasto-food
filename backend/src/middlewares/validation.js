/**
 * Input Validation Middleware
 * Validates and sanitizes user input to prevent injection attacks
 */

/**
 * Validate email format
 */
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number (Indian format)
 */
export const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
};

/**
 * Sanitize string input (remove HTML/script tags)
 */
export const sanitizeString = (str) => {
    if (typeof str !== 'string') return '';
    return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .trim();
};

/**
 * Validate user ID from JWT (never trust req.body.userId)
 */
export const validateUserId = (req, res, next) => {
    // Always get userId from authenticated JWT, not from request body
    if (!req.user || !req.user.uid) {
        return res.status(401).json({ error: 'Unauthorized - Invalid user token' });
    }

    // Override any userId in request with authenticated user's ID
    if (req.body.userId && req.body.userId !== req.user.uid) {
        console.warn(`⚠️  Security: userId mismatch - body: ${req.body.userId}, token: ${req.user.uid}`);
        return res.status(403).json({ error: 'Forbidden - User ID mismatch' });
    }

    // Set userId from JWT token
    req.validatedUserId = req.user.uid;
    next();
};

/**
 * Validate order creation input
 */
export const validateOrderInput = (req, res, next) => {
    const { items, deliveryAddress, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Invalid order items' });
    }

    if (!deliveryAddress || typeof deliveryAddress !== 'object') {
        return res.status(400).json({ error: 'Invalid delivery address' });
    }

    if (typeof total !== 'number' || total <= 0) {
        return res.status(400).json({ error: 'Invalid order total' });
    }

    // Sanitize text fields
    if (deliveryAddress.address) {
        deliveryAddress.address = sanitizeString(deliveryAddress.address);
    }

    next();
};

/**
 * Validate payment amount (prevent price manipulation)
 */
export const validatePaymentAmount = (req, res, next) => {
    const { amount } = req.body;

    if (typeof amount !== 'number' || amount < 50) {
        return res.status(400).json({ error: 'Invalid payment amount (minimum ₹50)' });
    }

    if (amount > 100000) {
        return res.status(400).json({ error: 'Payment amount exceeds maximum limit' });
    }

    next();
};
