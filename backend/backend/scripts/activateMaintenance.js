import admin from 'firebase-admin';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync('./service-account-key.json', 'utf8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function run() {
    try {
        await db.collection("app_config").doc("global").update({
            maintenance: true,
            message: "We're currently performing some server-side updates to improve the rider experience. We'll be back in a few minutes!"
        });
        console.log("Maintenance mode activated via service account.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();
