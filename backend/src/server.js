import "dotenv/config";
import app from "./app.js";
import "./config/firebase.js";
import connectDB from "./config/database.js";
import { firestore, auth } from "./config/firebase.js"; // Optional: if you need to export them or log them

// Safe assertions
console.log("🚀 Starting Server...");
console.log("🔥 Firestore Project:", firestore?._settings?.projectId || "Unknown");

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`🌍 Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error("DB Fail", err);
});
