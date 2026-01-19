/**
 * Rider Self-Authorization Guard
 * Ensures riders can only modify their own data
 */

export const riderSelfOnly = (req, res, next) => {
    const user = req.user;

    // Check if user is authenticated
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user is a rider
    if (user.role !== 'rider') {
        return res.status(403).json({
            error: 'Forbidden - Only riders can access this resource'
        });
    }

    // Check if rider is accessing their own data
    const riderId = req.params.riderId || req.body.riderId;

    if (user.uid !== riderId) {
        return res.status(403).json({
            error: 'Forbidden - You can only modify your own data',
            attemptedId: riderId,
            authenticatedId: user.uid
        });
    }

    next();
};
