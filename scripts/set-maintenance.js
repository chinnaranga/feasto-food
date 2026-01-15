import "dotenv/config";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// ESM directory fix
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serviceAccountPath = path.join(__dirname, "../service-account-key.json");

// --- 1. Initialize Firebase Admin ---
let initialized = false;

// Optimization: Check env first (Production style)
if (process.env.FIREBASE_PRIVATE_KEY) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
        });
        initialized = true;
        console.log("✅ Authenticated via Environment Variables");
    } catch (err) {
        console.warn("⚠️ Failed to init via Env Vars:", err.message);
    }
}

// Fallback: Check local file
if (!initialized) {
    try {
        if (fs.existsSync(serviceAccountPath)) {
            const rawFile = fs.readFileSync(serviceAccountPath, "utf8");
            const serviceAccount = JSON.parse(rawFile);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            initialized = true;
            console.log("✅ Authenticated via service-account-key.json");
        } else {
            console.error(`❌ keys not found at ${serviceAccountPath}`);
        }
    } catch (error) {
        console.error("❌ Failed to init via local file:", error.message);
    }
}

if (!initialized) {
    console.error("❌ Could not authenticate with Firebase. Please check your keys.");
    process.exit(1);
}

const db = admin.firestore();

// --- 2. Logic ---
async function setMaintenance() {
    const args = process.argv.slice(2);
    const command = args[0]; // 'on', 'off', 'status'

    const docRef = db.collection("settings").doc("app");

    try {
        if (command === "on") {
            const message = args[1] || "We are currently performing scheduled maintenance.";
            await docRef.set({
                maintenance: true,
                message: message,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            console.log(`\n🔒 MAINTENANCE MODE ACTIVATED`);
            console.log(`   Message: "${message}"`);

        } else if (command === "off") {
            await docRef.update({
                maintenance: false,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`\n🟢 MAINTENANCE MODE DISABLED`);
            console.log(`   Site is live.`);

        } else {
            // Status check
            const doc = await docRef.get();
            if (!doc.exists) {
                console.log("⚠️ Settings document does not exist yet.");
            } else {
                const data = doc.data();
                const status = data.maintenance ? "🔒 ON" : "🟢 OFF";
                console.log(`\nCurrent Status: ${status}`);
                if (data.maintenance) console.log(`Message: "${data.message}"`);
                if (data.admins) console.log(`Admins: ${data.admins.length}`);
            }
        }
    } catch (error) {
        console.error("❌ Error updating Firestore:", error.message);
    } finally {
        process.exit(0);
    }
}

setMaintenance();
