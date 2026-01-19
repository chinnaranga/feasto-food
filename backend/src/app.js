import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { db } from "./config/firebase.js";

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
import recommendationsRoutes from "./routes/recommendations.routes.js";

const app = express();

// Middleware
app.set("trust proxy", 1);
app.use(helmet());
app.use(express.json());

// Global DB injection
app.use((req, res, next) => {
    req.db = db;
    next();
});

app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.CLIENT_URL,
            "https://feasto.food",
            "http://localhost:5173",
            "http://localhost:3000",
            "https://food-platform-b022f.web.app",
            "https://feasto-backend-production.up.railway.app"
        ];
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".web.app")) {
            callback(null, true);
        } else {
            console.warn("Blocked by CORS:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200
});
app.use("/api/", limiter);

// Root Route (API Status)
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Feasto Backend API is running 🚀",
        version: "1.0.0",
        endpoints: {
            health: "/health",
            api: "/api/*"
        }
    });
});

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
app.use("/api/recommendations", recommendationsRoutes);

export default app;
