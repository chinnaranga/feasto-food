import admin from "firebase-admin";

export async function verifyFirebaseToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "AUTH_REQUIRED" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Firebase Auth Error:", err);
        return res.status(401).json({ error: "INVALID_AUTH_TOKEN" });
    }
}
