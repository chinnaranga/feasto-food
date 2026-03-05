/**
 * Middleware to enforce scheduled maintenance mode (11:00 PM - 10:00 AM daily)
 */
export const maintenanceMiddleware = (req, res, next) => {
    // Maintenance mode disabled to ensure 24/7 availability
    next();
};
