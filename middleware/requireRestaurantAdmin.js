import admin from "firebase-admin";

export async function requireRestaurantAdmin(req, res, next) {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token) return res.status(401).json({ error: "No token provided" });

        const decoded = await admin.auth().verifyIdToken(token);

        // Fetch user details from Firestore to check role
        const userDoc = await admin
            .firestore()
            .collection("users")
            .doc(decoded.uid)
            .get();

        if (!userDoc.exists) {
            return res.status(403).json({ error: "User not registered in database" });
        }

        const user = userDoc.data();

        // Check for restaurant_admin or super_admin role
        if (user.role !== "restaurant_admin" && user.role !== "super_admin") {
            return res.status(403).json({ error: "Access denied. Restaurant Admin only." });
        }

        // Attach user info and db instance to request
        req.admin = user;
        req.db = admin.firestore();
        next();
    } catch (err) {
        console.error("Restaurant Admin Auth Error:", err);
        res.status(401).json({ error: "Unauthorized access" });
    }
}
