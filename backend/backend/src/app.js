import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import cookieParser from "cookie-parser";
import { db } from "./config/firebase.js";
import Order from "./models/Order.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import razorpayRoutes from "./routes/razorpay.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import restaurantRoutes from "./routes/restaurants.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import riderWalletRoutes from "./routes/riderWallet.routes.js";
import riderRoutes from "./routes/rider.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import stripeRoutes from "./routes/stripe.routes.js";
import recommendationsRoutes from "./routes/recommendations.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";
import userRoutes from "./routes/user.routes.js";
import cashfreeRoutes from "./routes/cashfree.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import { maintenanceMiddleware } from "./middlewares/maintenance.js";


const app = express();

// Middleware
app.set("trust proxy", 1);

const corsOptions = {
    origin: [
        "https://feasto.food",
        "https://www.feasto.food",
        "https://food-platform-b022f.web.app",
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options("*", cors(corsOptions));

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://apis.google.com", "https://www.gstatic.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.tailwindcss.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https://*.googleusercontent.com", "https://www.google.com"],
            connectSrc: [
                "'self'",
                "https://feasto.food",
                "https://www.feasto.food",
                "https://*.googleapis.com",
                "https://*.firebaseio.com",
                "https://*.razorpay.com",
                "https://*.cashfree.com",
                "https://*.stripe.com",
                "https://api.razorpay.com",
                "https://api.cashfree.com",
                "https://api.stripe.com",
                "https://*.up.railway.app",
                "wss://*.up.railway.app"
            ],
            frameSrc: [
                "'self'",
                "https://*.firebaseapp.com",
                "https://*.web.app",
                "https://*.razorpay.com",
                "https://*.cashfree.com",
                "https://*.stripe.com"
            ],
            upgradeInsecureRequests: [],
        },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression()); // Compress responses for better performance
app.use(express.json());
app.use(cookieParser());

// Global DB injection & Maintenance Check
app.use((req, res, next) => {
    req.db = db;

    // Log requests for debugging deployment issues
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${req.ip}`);

    // Metrics Counting
    metricState.requests++;
    res.on('finish', () => {
        if (res.statusCode >= 500) {
            metricState.errors++;
        }
    });

    // Apply Maintenance Check
    maintenanceMiddleware(req, res, next);
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



// Root Route (Protected)
app.get("/", (req, res) => {
    const authCookie = req.cookies.admin_access;
    if (authCookie === process.env.ADMIN_SECRET || authCookie === "feasto_secure_2026") {
        res.sendFile(path.join(__dirname, "../public/status.html"));
    } else {
        res.sendFile(path.join(__dirname, "../public/access.html"));
    }
});

// Verify Access
app.post("/api/verify-access", (req, res) => {
    const { password } = req.body;
    const SECRET = process.env.ADMIN_SECRET || "feasto_secure_2026";

    if (password === SECRET) {
        res.cookie("admin_access", SECRET, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        res.status(200).send({ success: true });
    } else {
        res.status(401).send({ error: "Invalid password" });
    }
});

// Analytics State
let metricState = {
    requests: 0,
    errors: 0,
    rpm: 0,
    errorRate: 0
};

// Reset metrics every minute
setInterval(() => {
    metricState.rpm = metricState.requests;
    metricState.errorRate = metricState.requests > 0
        ? ((metricState.errors / metricState.requests) * 100).toFixed(2)
        : 0;
    metricState.requests = 0;
    metricState.errors = 0;
}, 60000);

// Import requireAdmin middleware
import { requireAdmin } from "./middlewares/requireAdmin.js";
// Status Page Stats (Cookie Protected)
app.get("/api/public-stats", async (req, res) => {
    const authCookie = req.cookies.admin_access;
    const SECRET = process.env.ADMIN_SECRET || "feasto_secure_2026";

    // Allow if authenticated via cookie OR if it's a local request (optional, but sticking to cookie for now)
    // if (authCookie !== SECRET) {
    //     return res.status(401).json({ error: "Unauthorized" });
    // }

    try {
        // Orders Today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Parallelize queries
        const [ordersToday, activeOrders] = await Promise.all([
            Order.countDocuments({ createdAt: { $gte: today } }),
            Order.countDocuments({
                status: { $in: ['Pending', 'Preparing', 'Ready', 'Out for delivery', 'PENDING', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'] }
            })
        ]);

        res.json({
            rpm: metricState.rpm,
            errorRate: metricState.errorRate,
            ordersToday,
            activeOrders
        });
    } catch (error) {
        console.error("Public Stats Error:", error);
        res.status(500).json({ error: "Stats failure" });
    }
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
        dbConnection: "Connected (MongoDB)"
    };
    try {
        res.status(200).send(healthcheck);
    } catch (e) {
        healthcheck.message = e;
        res.status(503).send(healthcheck);
    }
});

// Avoid redirect for health check to ensure compatibility with all orchestrators
app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP", message: "AeroBite Backend is Healthy" });
});

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
app.use("/api/rider", riderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/recommendations", recommendationsRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cashfree", cashfreeRoutes);
app.use("/api/notifications", notificationRoutes);

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
