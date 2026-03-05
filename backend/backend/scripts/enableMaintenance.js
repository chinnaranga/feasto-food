import { db } from "../src/config/firebase.js";

async function enableMaintenance() {
    try {
        console.log("🔒 Enabling Maintenance Mode...");
        const docRef = db.collection("app_config").doc("global");

        await docRef.set({
            maintenance: true,
            message: "Maintenance Mode Enabled via Script",
            lastUpdated: new Date().toISOString(),
            schedule: { enabled: false, start: null, end: null }
        }, { merge: true });

        console.log("✅ Maintenance Mode ENABLED Successfully");
        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to enable maintenance:", error);
        process.exit(1);
    }
}

enableMaintenance();
