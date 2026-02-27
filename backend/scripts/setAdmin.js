
import { auth } from "../src/config/firebase.js";

const uid = process.argv[2];

if (!uid) {
    console.error("Please provide a UID as an argument.");
    console.log("Usage: node scripts/setAdmin.js <UID>");
    process.exit(1);
}

const setAdmin = async () => {
    try {
        await auth.setCustomUserClaims(uid, { admin: true });
        console.log(`✅ Successfully set admin claim for user: ${uid}`);

        // Verify
        const user = await auth.getUser(uid);
        console.log("Current Claims:", user.customClaims);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error setting admin claim:", error);
        process.exit(1);
    }
};

setAdmin();
