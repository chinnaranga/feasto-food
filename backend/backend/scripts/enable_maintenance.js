import admin from 'firebase-admin';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('../service-account-key.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function enableMaintenance() {
    try {
        const configRef = db.collection('app_config').doc('global');

        // Check if doc exists first
        const doc = await configRef.get();

        if (!doc.exists) {
            console.log("Creating new config doc...");
            await configRef.set({
                maintenance: true,
                message: "We are undergoing scheduled maintenance. Please check back soon.",
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
        } else {
            console.log("Updating existing config doc...");
            await configRef.update({
                maintenance: true,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
        }

        console.log("✅ Maintenance mode ENABLED successfully in Firestore.");
        console.log("All connected clients should see the update immediately.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to enable maintenance mode:", error);
        process.exit(1);
    }
}

enableMaintenance();
