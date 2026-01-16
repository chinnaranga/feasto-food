import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Import centralized Firebase Admin
import { db as firestore, auth } from "./firebaseAdmin.js";
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

app.set("trust proxy", 1);

// Export db and auth for legacy usage if any (though imports should change)
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