/**
 * RBAC Authorization Middleware
 * Provides role-based and scope-based access control
 */

export const authorize = ({ roles = [], scopes = [] }) => {
    return (req, res, next) => {
        const user = req.user;

        // Check if user is authenticated
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized - No user found' });
        }

        // Check role-based authorization
        if (roles.length && !roles.includes(user.role)) {
            return res.status(403).json({
                error: 'Forbidden - Insufficient role permissions',
                required: roles,
                current: user.role
            });
        }

        // Check scope-based authorization (fine-grained permissions)
        if (scopes.length) {
            const userScopes = user.scope || [];
            const hasAllScopes = scopes.every(scope => userScopes.includes(scope));

            if (!hasAllScopes) {
                return res.status(403).json({
                    error: 'Forbidden - Insufficient scope permissions',
                    required: scopes,
                    current: userScopes
                });
            }
        }

        next();
    };
};
