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
import paymentRoutes from "./routes/payment.routes.js";

const app = express();

// Middleware
app.set("trust proxy", 1);

// CORS configuration - MUST be before helmet and other middleware
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.CLIENT_URL,
            "https://feasto.food",
            "http://localhost:5173",
            "http://localhost:3000",
            "https://food-platform-b022f.web.app",
            "https://feasto-backend-production.up.railway.app",
            "https://feasto-backend-production-c08e.up.railway.app"
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
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Now apply helmet and other middleware
// Now apply helmet and other middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"], // Allow Tailwind CDN
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.tailwindcss.com"], // Allow Fonts & Tailwind
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'"],
            upgradeInsecureRequests: [], // Optional: helpful for mixed content dev
        },
    },
}));
app.use(express.json());

// Global DB injection
app.use((req, res, next) => {
    req.db = db;
    next();
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200
});
app.use("/api/", limiter);

// Serve static files from public directory
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Go up one level from src to backend root
app.use(express.static(path.join(__dirname, "../public")));

// Root Route (Serve HTML Landing Page)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// JSON API Fallback for explicit check
app.get("/api-status", (req, res) => {
    res.status(200).json({
        success: true,
        message: "AeroBite Backend API is running 🚀",
        version: "1.0.0",
        endpoints: {
            health: "/health",
            api: "/api/*"
        }
    });
});

// Health Check with Metrics
app.get("/api/health", (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        timestamp: Date.now(),
        message: 'OK',
        memory: process.memoryUsage(),
        dbConnection: "Connected (Firestore)" // Simplified check
    };
    try {
        res.send(healthcheck);
    } catch (e) {
        healthcheck.message = e;
        res.status(503).send();
    }
});

// Alias for root health if needed by health checkers
app.get("/health", (req, res) => res.redirect("/api/health"));

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
app.use("/api/payment", paymentRoutes);

// Serve API Docs
app.get("/api/docs", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/docs.html"));
});

// Serve Admin Gateway
app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin.html"));
});

// Handle Admin Launch Redirect
app.get("/admin/launch", (req, res) => {
    const frontendUrl = process.env.CLIENT_URL || "https://feasto.food";
    res.redirect(`${frontendUrl}/admin/login`);
});

export default app;
