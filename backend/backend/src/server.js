import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/database.js";
import { db, auth } from "./config/firebase.js";
import { checkRequiredEnvVars } from "./utils/envCheck.js";
import "./config/env.js";

import { createServer } from "http";
import { initSocket } from "./sockets/socketManager.js";

// Verify environment variables before starting
checkRequiredEnvVars();

// Safe assertions
console.log("🔥 Booting server...");
console.log("🌍 ENV PORT:", process.env.PORT);

const PORT = process.env.PORT || 8080;

const httpServer = createServer(app);
const io = initSocket(httpServer);

connectDB().then(() => {
    httpServer.listen(PORT, "0.0.0.0", () => {
        console.log(`✅ Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
});
