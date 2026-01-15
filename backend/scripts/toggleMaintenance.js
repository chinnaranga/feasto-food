
import 'dotenv/config';
import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';

// Initialize Firebase Admin
try {
    let initialized = false;
    // Hardcoded absolute path to avoid ambiguity
    const serviceAccountPath = '/Users/ravipatichinnaranga/Desktop/index.html/food platform/backend/service-account-key.json';

    // 1. Try Environment Variables
    if (process.env.FIREBASE_PRIVATE_KEY) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                }),
            });
            console.log("✅ Authenticated via Environment Variables");
            initialized = true;
        } catch (err) {
            console.warn("⚠️ Failed to init via Env Vars:", err.message);
        }
    }

    // 2. Try File if Env failed
    if (!initialized) {
        if (existsSync(serviceAccountPath)) {
            console.log(`🔑 Reading key from: ${serviceAccountPath}`);
            const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            initialized = true;
            console.log("✅ Authenticated via service-account-key.json");
        } else {
            console.warn(`⚠️ Key not found at ${serviceAccountPath}`);
        }
    }

    if (!initialized) {
        throw new Error("Could not authenticate with Firebase. No valid Env vars or Key file.");
    }

    const db = admin.firestore();

    async function setMaintenance() {
        try {
            console.log('🔌 Enabling Maintenance Mode (Global Check)...');

            await db.collection('app_config').doc('global').set({
                maintenance: true,
                message: "We are currently undergoing scheduled maintenance. Please check back later.",
                lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
                // Clear any schedule so manual override takes precedence
                schedule: { enabled: false, start: null, end: null }
            }, { merge: true });

            console.log('✅ Maintenance Mode ENABLED Successfully!');
            process.exit(0);
        } catch (error) {
            console.error('❌ Error creating/updating maintenance config:', error);
            process.exit(1);
        }
    }

    setMaintenance();

} catch (error) {
    console.error('❌ Detailed error:', error);
    process.exit(1);
}
