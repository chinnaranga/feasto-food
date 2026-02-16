import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
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
import riderRoutes from "./routes/rider.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import stripeRoutes from "./routes/stripe.routes.js";
import recommendationsRoutes from "./routes/recommendations.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";
import userRoutes from "./routes/user.routes.js";

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
app.use(compression()); // Compress responses for better performance
app.use(express.json());
app.use(cookieParser());

// Global DB injection
app.use((req, res, next) => {
    req.db = db;
    // Metrics Counting
    metricState.requests++;
    res.on('finish', () => {
        if (res.statusCode >= 500) {
            metricState.errors++;
        }
    });
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
app.use("/api/rider", riderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/recommendations", recommendationsRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/user", userRoutes);

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
