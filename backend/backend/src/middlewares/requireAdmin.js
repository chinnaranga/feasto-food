import admin from "firebase-admin";

export const requireAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = await admin.auth().verifyIdToken(token);

        // 🔐 HARD ADMIN CHECK
        // Replace with actual Firebase UIDs from Console -> Authentication
        const ADMIN_UIDS = [
            "7sKi3g5X1wZqXyZ8oP4qR5sT9uV2", // Example placeholder
            "ADMIN_UID_FROM_CONSOLE"
        ];

        // Allow if email is admin@aerobite.com, admin@feasto.food, ends with @aerobite.com, has admin token, or is in ADMIN_UIDS
        if (
            decoded.email === "admin@aerobite.com" ||
            decoded.email === "admin@feasto.food" ||
            (decoded.email && decoded.email.endsWith("@aerobite.com")) ||
            decoded.admin === true ||
            ADMIN_UIDS.includes(decoded.uid)
        ) {
            req.admin = decoded;
            next();
        } else {
            return res.status(403).json({ message: "Not authorized as admin" });
        }

    } catch (err) {
        console.error("ADMIN AUTH ERROR", err);
        return res.status(401).json({ message: "Invalid token" });
    }
};
