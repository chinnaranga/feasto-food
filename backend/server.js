import "dotenv/config";
import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import fs from "fs";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

import connectDB from "./db.js";

// Routes
import authRoutes from "./routes/auth.js";
import cartRoutes from "./routes/cart.js";
import protectedRoutes from "./routes/protected.js";
import razorpayRoutes from "./routes/razorpay.js";
import aiRoutes from "./routes/ai.js";
import restaurantRoutes from "./routes/restaurants.js";
import ordersRoutes from "./routes/orders.js";
import riderWalletRoutes from "./routes/riderWallet.js";
import riderStatusRoutes from "./routes/riderStatus.js";
import adminRoutes from "./routes/admin.js";

console.log("🚀 Starting Server...");

const app = express();

// ✅ REQUIRED for Railway / proxies
app.set("trust proxy", 1);

/* =======================
   FIREBASE INITIALIZATION
   ======================= */
if (!admin.apps.length) {
  try {
    let serviceAccount;

    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      console.log("✅ Firebase Config Loaded from ENV");
    } else if (fs.existsSync("./service-account-key.json")) {
      serviceAccount = JSON.parse(fs.readFileSync("./service-account-key.json", "utf8"));
      console.log("✅ Firebase Config Loaded from File");
    } else {
      console.error("❌ NO FIREBASE CONFIG FOUND");
    }

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("🚀 Firebase Admin Initialized");
    }
  } catch (error) {
    console.error("❌ Firebase Init Error:", error.message);
    // In production, exiting is safer if auth is critical
    if (process.env.NODE_ENV === 'production') process.exit(1);
  }
}

export const firestore = admin.firestore();
export const auth = admin.auth();

/* =======================
   MIDDLEWARE
   ======================= */
app.use(helmet());
app.use(express.json());

// Global: Attach DB to request for backward compatibility
app.use((req, res, next) => {
  req.db = firestore;
  next();
});

app.use(cors({
  origin: true, // Allow all for now, or use process.env.CLIENT_URL
  credentials: true
}));

// Rate Limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200
});
app.use("/api/", limiter);

/* =======================
   ROUTES
   ======================= */
app.get("/health", (req, res) => res.status(200).send("OK"));

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/razorpay", razorpayRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/rider-wallet", riderWalletRoutes);
app.use("/api/rider", riderStatusRoutes);
app.use("/api/admin", adminRoutes);

/* =======================
   START SERVER
   ======================= */
const PORT = process.env.PORT || 8080;

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌍 Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error("DB Fail", err);
});