import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/database.js";
import { db, auth } from "./config/firebase.js";
import { checkRequiredEnvVars } from "./utils/envCheck.js";

// Verify environment variables before starting
checkRequiredEnvVars();

// Safe assertions
console.log("🚀 Starting Server...");
console.log("🔥 Firestore Project:", db?._settings?.projectId || "Unknown");

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`🌍 Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error("DB Fail", err);
});
