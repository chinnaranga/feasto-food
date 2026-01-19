import admin from "firebase-admin";
import "dotenv/config";

if (!admin.apps.length) {
    try {
        const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

        if (!rawServiceAccount) {
            throw new Error("Missing FIREBASE_SERVICE_ACCOUNT env var");
        }

        // Robust parsing to handle Railway's potential formatting issues
        let serviceAccount;
        try {
            serviceAccount = JSON.parse(rawServiceAccount);
        } catch (e) {
            // Try cleaning up quotes/newlines if simple parse fails
            let cleaned = rawServiceAccount.trim();
            if (cleaned.startsWith('"') && cleaned.endsWith('"')) cleaned = cleaned.slice(1, -1);
            if (cleaned.startsWith("'") && cleaned.endsWith("'")) cleaned = cleaned.slice(1, -1);
            cleaned = cleaned.replace(/\\n/g, '\\n'); // Escape newlines for JSON parse
            serviceAccount = JSON.parse(cleaned);
        }

        // Fix private_key newlines
        if (serviceAccount.private_key) {
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });

        console.log("✅ Firebase Admin initialized with Service Account");
    } catch (error) {
        console.error("❌ Firebase Admin Init Invalid:", error.message);
        // process.exit(1); // Optional: Fail hard if init fails
    }
}

const db = admin.firestore();
const auth = admin.auth();

export { admin, db, auth };
