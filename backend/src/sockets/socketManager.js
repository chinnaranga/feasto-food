/**
 * Enhanced Socket.IO Manager — Namespaced Architecture
 * 
 * Namespaces:
 *   /orders  — Real-time order lifecycle events
 *   /kitchen — Restaurant kitchen dashboard (new orders, status updates)
 *   /rider   — Rider location broadcasting and assignment
 *   /admin   — Admin dashboard metrics and security alerts
 *   /        — Default namespace: notifications, general
 */
import { Server } from "socket.io";
import { pubsub, TOPICS } from "../graphql/resolvers.js";
import Order from "../models/Order.js";
import Rider from "../models/Rider.js";

let io;
const CORS_ORIGINS = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "https://food-platform-b022f.web.app",
  "https://feasto.food",
  "https://www.feasto.food",
].filter(Boolean);

// ─── Initialize ────────────────────────────────────────────────────────────────
export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: CORS_ORIGINS,
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 30000,
    pingInterval: 10000,
  });

  // ── Default namespace (/): User notifications & general ──
  io.on("connection", (socket) => {
    console.log("🔌 [default] Client connected:", socket.id);

    socket.on("join", (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
        console.log(`👤 User ${userId} joined personal room`);
      }
    });

    socket.on("join:admin", () => {
      socket.join("admin_room");
      console.log(`🛡️ Admin joined admin_room`);
    });

    socket.on("disconnect", () => {
      console.log("🔌 [default] Client disconnected:", socket.id);
    });
  });

  // ── /orders namespace ─────────────────────────────────────────────────────
  const ordersNsp = io.of("/orders");
  ordersNsp.on("connection", (socket) => {
    console.log("📦 [/orders] Client connected:", socket.id);

    // Customer subscribes to a specific order
    socket.on("order:subscribe", (orderId) => {
      if (orderId) {
        socket.join(`order:${orderId}`);
        console.log(`📦 Socket subscribed to order:${orderId}`);
      }
    });

    socket.on("order:unsubscribe", (orderId) => {
      socket.leave(`order:${orderId}`);
    });

    socket.on("disconnect", () => {
      console.log("📦 [/orders] Client disconnected:", socket.id);
    });
  });

  // ── /kitchen namespace ────────────────────────────────────────────────────
  const kitchenNsp = io.of("/kitchen");
  kitchenNsp.on("connection", (socket) => {
    console.log("🍳 [/kitchen] Restaurant connected:", socket.id);

    socket.on("kitchen:join", (restaurantId) => {
      if (restaurantId) {
        socket.join(`kitchen:${restaurantId}`);
        console.log(`🍳 Kitchen joined restaurant:${restaurantId}`);
      }
    });

    // Restaurant marks order ready
    socket.on("kitchen:order:ready", async ({ orderId, restaurantId }) => {
      try {
        const order = await Order.findByIdAndUpdate(
          orderId,
          { status: "Ready" },
          { new: true }
        ).lean();

        if (order) {
          // Notify the customer
          io.to(`user:${order.userId}`).emit("order:statusChanged", {
            orderId,
            status: "Ready",
            message: "Your order is ready for pickup! 🚀",
          });
          // Broadcast to admin room
          io.to("admin_room").emit("order:statusChanged", { orderId, status: "Ready" });
          // Publish to GraphQL subscriptions
          pubsub.publish(TOPICS.ORDER_STATUS_UPDATED, {
            orderStatusUpdated: { orderId, status: "Ready", updatedAt: new Date().toISOString() },
          });

          console.log(`🍳 Order ${orderId} marked Ready`);
        }
      } catch (err) {
        console.error("[/kitchen] order:ready error:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("🍳 [/kitchen] Restaurant disconnected:", socket.id);
    });
  });

  // ── /rider namespace ──────────────────────────────────────────────────────
  const riderNsp = io.of("/rider");
  riderNsp.on("connection", (socket) => {
    console.log("🛵 [/rider] Rider connected:", socket.id);

    socket.on("rider:identify", (riderId) => {
      if (riderId) {
        socket.join(`rider:${riderId}`);
        console.log(`🛵 Rider ${riderId} identified`);
      }
    });

    // Rider broadcasts location every ~5 seconds from the app
    socket.on("rider:location", async ({ riderId, orderId, lat, lng, heading, speed }) => {
      try {
        // Persist to DB
        await Rider.findOneAndUpdate(
          { userId: riderId },
          { currentLocation: { lat, lng, heading, speed, lastUpdated: new Date() } }
        );

        const payload = { riderId, orderId, lat, lng, heading, speed, timestamp: new Date().toISOString() };

        // Broadcast to customer watching this order
        if (orderId) {
          io.of("/orders").to(`order:${orderId}`).emit("rider:locationUpdate", payload);
        }

        // Broadcast to admin room
        io.to("admin_room").emit("rider:locationUpdate", payload);

        // Publish to GraphQL subscriptions
        pubsub.publish(TOPICS.RIDER_LOCATION_UPDATED, { riderLocationUpdated: payload });

      } catch (err) {
        console.error("[/rider] location error:", err.message);
      }
    });

    // Rider picks up the order
    socket.on("rider:pickedUp", async ({ riderId, orderId }) => {
      try {
        const order = await Order.findByIdAndUpdate(
          orderId,
          { status: "Picked_Up" },
          { new: true }
        ).lean();
        if (order) {
          io.to(`user:${order.userId}`).emit("order:statusChanged", {
            orderId,
            status: "Picked_Up",
            message: "Your order has been picked up! 🛵",
          });
          pubsub.publish(TOPICS.ORDER_STATUS_UPDATED, {
            orderStatusUpdated: { orderId, status: "Picked_Up", updatedAt: new Date().toISOString() },
          });
        }
      } catch (err) {
        console.error("[/rider] pickedUp error:", err.message);
      }
    });

    // Rider delivers the order
    socket.on("rider:delivered", async ({ riderId, orderId }) => {
      try {
        const order = await Order.findByIdAndUpdate(
          orderId,
          { status: "Delivered" },
          { new: true }
        ).lean();
        if (order) {
          io.to(`user:${order.userId}`).emit("order:statusChanged", {
            orderId,
            status: "Delivered",
            message: "Your order has been delivered! 🎉",
          });
          pubsub.publish(TOPICS.ORDER_STATUS_UPDATED, {
            orderStatusUpdated: { orderId, status: "Delivered", updatedAt: new Date().toISOString() },
          });
        }
      } catch (err) {
        console.error("[/rider] delivered error:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("🛵 [/rider] Rider disconnected:", socket.id);
    });
  });

  // ── /webrtc namespace (WebRTC Signaling) ──────────────────────────────────
  const webrtcNsp = io.of("/webrtc");
  webrtcNsp.on("connection", (socket) => {
    console.log("📞 [/webrtc] Client connected:", socket.id);

    // Caller initiates call
    socket.on("call:offer", ({ targetId, callerId, callerName, offer }) => {
      webrtcNsp.to(`user:${targetId}`).emit("call:incoming", {
        callerId,
        callerName,
        offer,
        socketId: socket.id,
      });
      console.log(`📞 Call offer from ${callerId} → ${targetId}`);
    });

    // Callee answers
    socket.on("call:answer", ({ callerId, answer }) => {
      webrtcNsp.to(callerId).emit("call:answered", { answer });
    });

    // ICE candidates
    socket.on("call:ice-candidate", ({ targetSocketId, candidate }) => {
      webrtcNsp.to(targetSocketId).emit("call:ice-candidate", { candidate });
    });

    // Join with user ID for targeting
    socket.on("user:join", (userId) => {
      socket.join(`user:${userId}`);
    });

    // Hang up
    socket.on("call:end", ({ targetSocketId }) => {
      webrtcNsp.to(targetSocketId).emit("call:ended");
    });

    socket.on("disconnect", () => {
      console.log("📞 [/webrtc] Client disconnected:", socket.id);
    });
  });

  console.log("✅ Socket.IO initialized with namespaces: /orders, /kitchen, /rider, /webrtc");
  return io;
};

// ─── Utility Emitters ──────────────────────────────────────────────────────────

/** Emit a notification to a specific user */
export const emitNotification = (userId, notification) => {
  if (io) {
    io.to(`user:${userId}`).emit("notification", notification);
    console.log(`📢 Notification → user:${userId}`);
  }
};

/** Emit an order status change across all channels */
export const emitOrderStatusChange = (order) => {
  if (!io) return;
  const payload = {
    orderId: order._id.toString(),
    status: order.status,
    updatedAt: new Date().toISOString(),
  };
  // Notify customer
  io.to(`user:${order.userId}`).emit("order:statusChanged", payload);
  // Notify admin room
  io.to("admin_room").emit("order:statusChanged", payload);
  // Notify order room (via /orders namespace)
  io.of("/orders").to(`order:${order._id.toString()}`).emit("order:statusChanged", payload);
  // Publish to GraphQL
  pubsub.publish(TOPICS.ORDER_STATUS_UPDATED, { orderStatusUpdated: payload });
};

/** Broadcast new order to kitchen and admin */
export const emitNewOrder = (order, restaurantId) => {
  if (!io) return;
  io.of("/kitchen").to(`kitchen:${restaurantId}`).emit("kitchen:newOrder", order);
  io.to("admin_room").emit("order:new", order);
  pubsub.publish(TOPICS.NEW_ORDER, { newOrder: order });
};

/** Emit a security alert to all admins */
export const emitSecurityAlert = (alert) => {
  if (io) {
    io.to("admin_room").emit("securityAlert", alert);
    console.log(`🛡️ Security Alert: ${alert.type}`);
  }
};

export const getIo = () => io;
