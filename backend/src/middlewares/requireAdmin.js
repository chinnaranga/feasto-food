import { admin } from "../config/firebase.js";

export const requireAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Missing token" });
        }

        const token = authHeader.split(" ")[1];

        // Verify Firebase ID Token
        const decoded = await admin.auth().verifyIdToken(token);

        // Check for Admin Custom Claim
        if (!decoded.admin) {
            return res.status(403).json({ error: "Forbidden - Admin access required" });
        }

        req.user = decoded;
        next();
    } catch (err) {
        console.error("Admin Auth Error:", err);
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};
