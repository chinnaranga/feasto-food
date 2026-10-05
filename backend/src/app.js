import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { db } from "./config/firebase.js";
import Order from "./models/Order.js";

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

app.set("trust proxy", 1);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ================= CORS & SECURITY HEADERS =================
const ALLOWED_ORIGINS = [
    "https://feasto.food",
    "https://www.feasto.food",
    "https://flavor.food",
    "https://www.flavor.food",
    "https://food-platform-b022f.web.app",
    "https://food-platform-b022f.firebaseapp.com",
    "http://localhost:5173",
    "http://localhost:3000"
];

// Custom middleware for COOP and explicit CORS headers
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    next();
});

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || ALLOWED_ORIGINS.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn("🚫 Blocked by CORS:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));


// ================= HELMET SECURITY =================

app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],

                scriptSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://cdn.tailwindcss.com",
                    "https://apis.google.com",
                    "https://www.gstatic.com",
                    "https://checkout.razorpay.com"
                ],

                styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://fonts.googleapis.com",
                    "https://cdn.tailwindcss.com"
                ],

                fontSrc: [
                    "'self'",
                    "https://fonts.gstatic.com"
                ],

                imgSrc: [
                    "'self'",
                    "data:",
                    "https://*.googleusercontent.com",
                    "https://www.google.com"
                ],

                connectSrc: [
                    "'self'",
                    "https://flavor.food",
                    "https://www.flavor.food",
                    "https://*.googleapis.com",
                    "https://*.firebaseio.com",
                    "https://*.razorpay.com",
                    "https://checkout.razorpay.com",
                    "https://api.razorpay.com",
                    "https://*.cashfree.com",
                    "https://api.cashfree.com",
                    "https://*.stripe.com",
                    "https://api.stripe.com",
                    "https://*.up.railway.app",
                    "wss://*.up.railway.app"
                ],

                frameSrc: [
                    "'self'",
                    "https://*.firebaseapp.com",
                    "https://*.web.app",
                    "https://*.razorpay.com",
                    "https://checkout.razorpay.com",
                    "https://*.cashfree.com",
                    "https://*.stripe.com"
                ],

                upgradeInsecureRequests: []
            }
        }
    })
);


// ================= GENERAL MIDDLEWARE =================

app.use(compression());
app.use(express.json());
app.use(cookieParser());


// ================= METRICS =================

let metricState = {
    requests: 0,
    errors: 0,
    rpm: 0,
    errorRate: 0
};

setInterval(() => {
    metricState.rpm = metricState.requests;

    metricState.errorRate =
        metricState.requests > 0
            ? ((metricState.errors / metricState.requests) * 100).toFixed(2)
            : 0;

    metricState.requests = 0;
    metricState.errors = 0;
}, 60000);


// ================= GLOBAL MIDDLEWARE =================

app.use((req, res, next) => {

    req.db = db;

    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${req.ip}`);

    metricState.requests++;

    res.on("finish", () => {
        if (res.statusCode >= 500) {
            metricState.errors++;
        }
    });

    maintenanceMiddleware(req, res, next);
});


// ================= RATE LIMIT =================

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200
});

app.use("/api/", limiter);


// ================= STATIC FILES =================

app.use(express.static(path.join(__dirname, "../public")));


// ================= ROOT =================

app.get("/", (req, res) => {

    const authCookie = req.cookies.admin_access;

    if (
        authCookie === process.env.ADMIN_SECRET ||
        authCookie === "flavor_secure_2026"
    ) {
        res.sendFile(path.join(__dirname, "../public/status.html"));
    } else {
        res.sendFile(path.join(__dirname, "../public/access.html"));
    }

});


// ================= VERIFY ACCESS =================

app.post("/api/verify-access", (req, res) => {

    const { password } = req.body;

    const SECRET = process.env.ADMIN_SECRET || "flavor_secure_2026";

    if (password === SECRET) {

        res.cookie("admin_access", SECRET, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000
        });

        res.status(200).send({ success: true });

    } else {

        res.status(401).send({ error: "Invalid password" });

    }

});


// ================= HEALTH =================

app.get("/api/health", async (req, res) => {
    try {
        const settingsDoc = await db.collection("settings").doc("platform").get();
        const isMaintenance = settingsDoc.exists ? !!settingsDoc.data().maintenance : false;

        res.status(200).json({
            uptime: process.uptime(),
            message: isMaintenance ? (settingsDoc.data().maintenanceMessage || "Scheduled maintenance") : "System is healthy",
            timestamp: Date.now(),
            memory: process.memoryUsage(),
            dbConnection: "Connected",
            maintenance: isMaintenance
        });
    } catch (error) {
        res.status(500).json({ error: "Health check failed" });
    }
});

app.get("/health", async (req, res) => {
    try {
        const settingsDoc = await db.collection("settings").doc("platform").get();
        const isMaintenance = settingsDoc.exists ? !!settingsDoc.data().maintenance : false;
        res.status(200).json({ 
            status: "UP", 
            maintenance: isMaintenance, 
            message: isMaintenance ? "Under maintenance" : "System operational" 
        });
    } catch (error) {
        res.status(500).json({ error: "Down" });
    }
});






// ================= PUBLIC STATS =================

app.get("/api/public-stats", async (req, res) => {

    try {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [ordersToday, activeOrders] = await Promise.all([
            Order.countDocuments({ createdAt: { $gte: today } }),
            Order.countDocuments({
                status: {
                    $in: [
                        "Pending",
                        "Preparing",
                        "Ready",
                        "Out for delivery",
                        "PENDING",
                        "PREPARING",
                        "READY",
                        "OUT_FOR_DELIVERY"
                    ]
                }
            })
        ]);

        res.json({
            rpm: metricState.rpm,
            errorRate: metricState.errorRate,
            ordersToday,
            activeOrders
        });

    } catch (err) {

        console.error("Stats Error:", err);
        res.status(500).json({ error: "Stats failure" });

    }

});


// ================= ROUTES =================

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


// ================= DOCS =================

app.get("/api/docs", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/docs.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin.html"));
});

app.get("/admin/launch", (req, res) => {

    const frontendUrl = process.env.CLIENT_URL || "https://flavor.food";

    res.redirect(`${frontendUrl}/admin/login`);

});

export default app;