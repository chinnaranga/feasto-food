import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/database.js";
import { db, auth } from "./config/firebase.js";
import { checkRequiredEnvVars } from "./utils/envCheck.js";
import "./config/env.js";

import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import { initSocket } from "./sockets/socketManager.js";
import { startGrpcServer } from "./grpc/paymentServer.js";
import express from "express";
import cors from "cors";

// Verify environment variables before starting
checkRequiredEnvVars();

console.log("🔥 Booting server...");
console.log("🌍 ENV PORT:", process.env.PORT);

const PORT = process.env.PORT || 8080;

// ─── Build Executable Schema ──────────────────────────────────────────────────
const schema = makeExecutableSchema({ typeDefs, resolvers });

// ─── HTTP Server ──────────────────────────────────────────────────────────────
const httpServer = createServer(app);

// ─── Socket.IO (REST + WebRTC signaling) ─────────────────────────────────────
const io = initSocket(httpServer);

// ─── WebSocket Server for GraphQL Subscriptions ───────────────────────────────
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const serverCleanup = useServer(
  {
    schema,
    onConnect: (ctx) => {
      console.log("🔗 [GraphQL WS] Client connected");
    },
    onDisconnect: () => {
      console.log("🔗 [GraphQL WS] Client disconnected");
    },
  },
  wsServer
);

// ─── Apollo Server ────────────────────────────────────────────────────────────
const apolloServer = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
  introspection: true,
});

// ─── Database + Start ─────────────────────────────────────────────────────────
connectDB().then(async () => {
  // Start Apollo Server before attaching middleware
  await apolloServer.start();

  // Mount GraphQL endpoint
  app.use(
    "/graphql",
    cors({
      origin: [
        process.env.CLIENT_URL,
        "http://localhost:5173",
        "http://localhost:3000",
        "https://food-platform-b022f.web.app",
      ].filter(Boolean),
      credentials: true,
    }),
    express.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({
        user: req.user ?? null,
        db,
        auth,
      }),
    })
  );

  // Start gRPC Payment Server (internal)
  try {
    startGrpcServer();
  } catch (err) {
    console.warn("⚠️ gRPC server failed to start:", err.message);
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ HTTP + Socket.IO server running on port ${PORT}`);
    console.log(`🚀 GraphQL endpoint: http://localhost:${PORT}/graphql`);
    console.log(`🔌 GraphQL subscriptions: ws://localhost:${PORT}/graphql`);
  });
}).catch(err => {
  console.error("❌ DB connection failed:", err);
  process.exit(1);
});
