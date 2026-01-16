import "dotenv/config";
import express from "express";
import cors from "cors";
import admin from "firebase-admin";
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
import stripeRoutes from "./routes/stripe.js";

console.log("🚀 Starting Server...");

const app = express();

// ✅ REQUIRED for Railway / proxies
app.set("trust proxy", 1);

/* =======================
   FIREBASE INITIALIZATION
   ======================= */
/* =======================
   FIREBASE INITIALIZATION
   ======================= */
if (!admin.apps.length) {
  try {
    let serviceAccount;

    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      console.log("🔹 Parsing FIREBASE_SERVICE_ACCOUNT_JSON...");
      let rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON.trim();

      // HEURISTIC: Remove outer quotes if present (common in Railway/Env vars)
      if (rawJson.startsWith('"') && rawJson.endsWith('"')) {
        rawJson = rawJson.slice(1, -1);
      }
      if (rawJson.startsWith("'") && rawJson.endsWith("'")) {
        rawJson = rawJson.slice(1, -1);
      }

      // HEURISTIC: Unescape newlines explicitly if they are literal `\n` characters
      // This fixes the issue where JSON validation fails because of escaped control characters
      rawJson = rawJson.replace(/\\n/g, '\\n');

      try {
        serviceAccount = JSON.parse(rawJson);
      } catch (jsonErr) {
        console.error("❌ JSON Parse Failed. Attempting aggressive cleanup...");
        // Fallback: If standard parse fails, try to aggressively fix newlines for the private key
        // This is risky but often necessary if the env var is heavily mangled
        const fixedJson = rawJson.replace(/\\n/g, '\n');
        try {
          serviceAccount = JSON.parse(fixedJson);
        } catch (finalErr) {
          throw new Error(`Critical JSON Parse Error: ${finalErr.message}`);
        }
      }
    } else {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON missing");
    }

    // FINAL SAFETY CHECK: Ensure private_key has real newlines
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("🚀 Firebase Admin Initialized (ENV)");
  } catch (error) {
    console.error("❌ Firebase Init Error:", error.message);
    process.exit(1);
  }
}

// ✅ SAFE EXPORTS
let firestore;
let auth;

if (admin.apps.length) {
  firestore = admin.firestore();
  auth = admin.auth();
  console.log("✅ Firestore & Auth Ready");
} else {
  console.error("❌ Firebase NOT initialized — Firestore disabled");
}

export { firestore, auth };

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
  origin: process.env.CLIENT_URL,
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
app.use("/api/stripe", stripeRoutes);
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