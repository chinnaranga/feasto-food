import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { db as firestore } from "./config/firebase.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import razorpayRoutes from "./routes/razorpay.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import restaurantRoutes from "./routes/restaurants.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import riderWalletRoutes from "./routes/riderWallet.routes.js";
import riderStatusRoutes from "./routes/riderStatus.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import stripeRoutes from "./routes/stripe.routes.js";

const app = express();

// Middleware
app.set("trust proxy", 1);
app.use(helmet());
app.use(express.json());

// Global DB injection
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

// Health Check
app.get("/health", (req, res) => res.status(200).send("OK"));

// Mount Routes
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

export default app;
