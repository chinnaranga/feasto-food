
import admin from "firebase-admin";
import fs from "fs";

const uid = process.argv[2];

if (!uid) {
    console.error("Please provide a UID as an argument.");
    process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync("./backend/service-account-key.json", "utf8"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const setAdmin = async () => {
    try {
        await admin.auth().setCustomUserClaims(uid, { admin: true });
        console.log(`✅ Successfully set admin claim for user: ${uid}`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error setting admin claim:", error);
        process.exit(1);
    }
};

setAdmin();
