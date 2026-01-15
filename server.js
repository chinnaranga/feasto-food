import "dotenv/config";
import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import fs from "fs";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import connectDB from "./db.js";

// Routes
import authRoutes from "./routes/auth.js";
import cartRoutes from "./routes/cart.js";
import protectedRoutes from "./routes/protected.js";
import stripeRoutes from "./routes/stripe.js";
import razorpayRoutes from "./routes/razorpay.js";
import adminRoutes from "./routes/admin.js";
import aiRoutes from "./routes/ai.js";

console.log("🚀 Starting Server...");

const app = express();

// ✅ REQUIRED for Railway / proxies
app.set("trust proxy", 1);

/* =======================
   FIREBASE INITIALIZATION
   ======================= */
let serviceAccount;

// PRODUCTION: Use Environment Variables (Railway/Render)
if (process.env.FIREBASE_PRIVATE_KEY) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    console.log("✅ Firebase initialized (Env Vars)");
  } catch (err) {
    console.error("❌ Firebase Env Var Init Error:", err);
  }
}
// DEVELOPMENT: Use local JSON file
else {
  try {
    const rawFile = fs.readFileSync("./service-account-key.json", "utf8");
    serviceAccount = JSON.parse(rawFile);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("✅ Firebase initialized (Local File)");
  } catch (error) {
    console.warn(
      "⚠️ Firebase not initialized (service-account-key.json missing or invalid)"
    );
  }
}

/* =======================
   MIDDLEWARE
   ======================= */
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(express.json());

// Rate Limiting (100 reqs / 15 min)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/", limiter);
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://food-platform-b022f.web.app",
      "https://feasto.food",
      process.env.CLIENT_URL
    ].filter(Boolean),
    credentials: true,
  })
);

/* =======================
   ROUTES
   ======================= */

// Health Check for Railway/Uptime Monitors
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// Backend Status Dashboard (Developer/Debug Page)
app.get("/", (req, res) => {
  const razorpayConfigured = !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
  const stripeConfigured = !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== "sk_test_YOUR_STRIPE_SECRET_KEY");
  const razorpayKeyPreview = process.env.RAZORPAY_KEY_ID
    ? `${process.env.RAZORPAY_KEY_ID.slice(0, 12)}...`
    : "Not configured";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Feasto Backend | Status Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0f0f12 0%, #1a1a2e 100%);
      color: #e0e0e0;
      min-height: 100vh;
      padding: 40px 20px;
    }
    .container { max-width: 800px; margin: 0 auto; }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .header h1 {
      font-size: 2.5rem;
      background: linear-gradient(90deg, #22c55e, #10b981);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 8px;
    }
    .header p { color: #888; font-size: 0.9rem; }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-top: 16px;
    }
    .status-online {
      background: rgba(34, 197, 94, 0.15);
      color: #22c55e;
      border: 1px solid rgba(34, 197, 94, 0.3);
    }
    .card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 20px;
    }
    .card h2 {
      font-size: 1.1rem;
      color: #fff;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .config-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .config-row:last-child { border-bottom: none; }
    .config-label { color: #888; }
    .config-value { font-family: 'SF Mono', Monaco, monospace; font-size: 0.85rem; }
    .configured { color: #22c55e; }
    .not-configured { color: #ef4444; }
    .endpoint-list { list-style: none; }
    .endpoint-list li {
      padding: 10px 14px;
      margin: 6px 0;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 8px;
      font-family: 'SF Mono', Monaco, monospace;
      font-size: 0.85rem;
      display: flex;
      justify-content: space-between;
    }
    .method {
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .method-post { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
    .method-get { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
    .footer {
      text-align: center;
      margin-top: 40px;
      color: #555;
      font-size: 0.8rem;
    }
    .pulse {
      width: 10px;
      height: 10px;
      background: #22c55e;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
      50% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🍕 Feasto Backend</h1>
      <p>API Server • Payment Gateway Integration</p>
      <div class="status-badge status-online">
        <span class="pulse"></span>
        Server Online
      </div>
    </div>

    <div class="card">
      <h2>⚡ Payment Gateways</h2>
      <div class="config-row">
        <span class="config-label">Razorpay</span>
        <span class="config-value ${razorpayConfigured ? 'configured' : 'not-configured'}">
          ${razorpayConfigured ? '✓ Configured' : '✗ Not Configured'}
        </span>
      </div>
      <div class="config-row">
        <span class="config-label">Key ID</span>
        <span class="config-value">${razorpayKeyPreview}</span>
      </div>
      <div class="config-row">
        <span class="config-label">Stripe</span>
        <span class="config-value ${stripeConfigured ? 'configured' : 'not-configured'}">
          ${stripeConfigured ? '✓ Configured' : '✗ Not Configured'}
        </span>
      </div>
    </div>

    <div class="card">
      <h2>🔌 API Endpoints</h2>
      <ul class="endpoint-list">
        <li>
          <span>/api/razorpay/create-order</span>
          <span class="method method-post">POST</span>
        </li>
        <li>
          <span>/api/razorpay/verify-payment</span>
          <span class="method method-post">POST</span>
        </li>
        <li>
          <span>/api/razorpay/order/:orderId</span>
          <span class="method method-get">GET</span>
        </li>
        <li>
          <span>/api/stripe/create-checkout-session</span>
          <span class="method method-post">POST</span>
        </li>
        <li>
          <span>/api/stripe/session/:sessionId</span>
          <span class="method method-get">GET</span>
        </li>
        <li>
          <span>/api/ai/chat-order</span>
          <span class="method method-post">POST</span>
        </li>
        <li>
          <span>/api/auth/...</span>
          <span class="method method-post">POST</span>
        </li>
        <li>
          <span>/api/cart/...</span>
          <span class="method method-get">GET/POST</span>
        </li>
      </ul>
    </div>

    <div class="card">
      <h2>🕐 Server Info</h2>
      <div class="config-row">
        <span class="config-label">Server Time</span>
        <span class="config-value">${new Date().toISOString()}</span>
      </div>
      <div class="config-row">
        <span class="config-label">Port</span>
        <span class="config-value">${process.env.PORT || 5001}</span>
      </div>
      <div class="config-row">
        <span class="config-label">Environment</span>
        <span class="config-value">${process.env.NODE_ENV || 'development'}</span>
      </div>
    </div>

    <div class="footer">
      <p>Feasto Backend v1.0 • For internal use only</p>
      <p style="margin-top: 4px;">Do not expose sensitive data in production</p>
    </div>
  </div>
</body>
</html>
  `;

  res.send(html);
});

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/razorpay", razorpayRoutes);
app.use("/api/ai", aiRoutes);

import restaurantRoutes from "./routes/restaurant.js";
app.use("/api/restaurant", restaurantRoutes);

import { verifyFirebaseToken } from "./middleware/firebaseAuth.js";
app.post("/api/protected", verifyFirebaseToken, (req, res) => {
  res.json({
    message: "Access granted",
    uid: req.user.uid,
    email: req.user.email,
  });
});

/* =======================
   START SERVER
   ======================= */
import http from "http";
import { initWebSocket } from "./wsServer.js";

const server = http.createServer(app);
export const ws = initWebSocket(server);

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🌍 Server running at http://localhost:${PORT}`);
    console.log(`📡 WebSocket Server ready`);
  });
});
