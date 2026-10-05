import { db } from "../config/firebase.js";

let maintenanceCache = {
    status: false, // Default to false — off until Firestore confirms otherwise
    lastChecked: 0,
    ttl: 10000 // 10 seconds
};

/**
 * Middleware to enforce scheduled maintenance mode
 */
export const maintenanceMiddleware = async (req, res, next) => {
    const now = Date.now();

    // Update cache if expired
    if (now - maintenanceCache.lastChecked > maintenanceCache.ttl) {
        try {
            const settingsDoc = await db.collection("settings").doc("platform").get();
            if (settingsDoc.exists) {
                maintenanceCache.status = !!settingsDoc.data().maintenance;
            } else {
                // If doc doesn't exist, default to false (or true depending on preference)
                maintenanceCache.status = false;
            }
            maintenanceCache.lastChecked = now;
        } catch (error) {
            console.error("MAINTENANCE CACHE ERROR:", error);
            // On error, keep previous status or default to false to avoid blocking the app
        }
    }

    if (maintenanceCache.status) {
        // Exclude health check endpoints and admin login from maintenance lockdown
        const publicPaths = [
            '/api/health', 
            '/health',
            '/api/auth/login',
            '/api/admin/verify-access',
            '/api/admin/settings/platform'
        ];
        
        if (publicPaths.includes(req.path)) {
            return next();
        }

        // 🔐 Admin Bypass: Allow access if the admin_access secret is present in cookies
        const adminCookie = req.cookies?.admin_access;
        const ADMIN_SECRET = process.env.ADMIN_SECRET || "flavor_secure_2026";
        
        if (adminCookie && adminCookie === ADMIN_SECRET) {
            console.log("🔓 Maintenance Bypass: Admin Access Detected");
            return next();
        }

        return res.status(503).json({
            success: false,
            message: 'Service is currently under maintenance. Please try again later.',
            maintenance: true
        });
    }

    next();
};

