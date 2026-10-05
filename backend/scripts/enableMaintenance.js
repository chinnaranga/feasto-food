import { db } from "../src/config/firebase.js";

async function enableMaintenance() {
    try {
        console.log("🔒 Enabling Maintenance Mode...");
        const docRef = db.collection("settings").doc("platform");

        await docRef.set({
            maintenance: true,
            maintenanceMessage: "Systems are currently being refined for peak performance.",
            updatedAt: new Date().toISOString()
        }, { merge: true });

        console.log("✅ Maintenance Mode ENABLED Successfully");
        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to enable maintenance:", error);
        process.exit(1);
    }
}

enableMaintenance();
