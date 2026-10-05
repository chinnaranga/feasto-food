/**
 * gRPC Payment Server
 * Runs on port 50051 (internal only — not exposed to the internet)
 * Called by Express routes via paymentClient.js
 */
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { fileURLToPath } from "url";
import path from "path";
import Stripe from "stripe";
import Razorpay from "razorpay";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "payment.proto");
const GRPC_PORT = process.env.GRPC_PORT || "50051";

// ─── Load Proto ───────────────────────────────────────────────────────────────
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDef);
const paymentProto = protoDescriptor.feasto.payment;

// ─── Payment Providers ────────────────────────────────────────────────────────
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

// ─── Service Implementations ──────────────────────────────────────────────────

async function ProcessPayment(call, callback) {
  const { order_id, amount, currency, provider, customer_id, customer_email, description } = call.request;

  try {
    if (provider === "stripe") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: currency || "inr",
            product_data: { name: description || "Feasto Order" },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        }],
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&orderId=${order_id}`,
        cancel_url: `${process.env.CLIENT_URL}/payment/cancel?orderId=${order_id}`,
        metadata: { order_id, customer_id },
      });

      callback(null, {
        success: true,
        transaction_id: session.id,
        payment_url: session.url,
        session_id: session.id,
        order_id,
        provider: "stripe",
      });

    } else if (provider === "razorpay") {
      const rzpOrder = await razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency: currency || "INR",
        receipt: `order_${order_id}`,
        notes: { customer_id, description },
      });

      callback(null, {
        success: true,
        transaction_id: rzpOrder.id,
        order_id: rzpOrder.id,
        provider: "razorpay",
      });

    } else {
      callback(null, { success: false, error_message: `Unknown provider: ${provider}` });
    }
  } catch (err) {
    console.error("[gRPC] ProcessPayment error:", err.message);
    callback(null, { success: false, error_message: err.message });
  }
}

async function VerifyPayment(call, callback) {
  const { transaction_id, order_id, provider, signature, payment_id } = call.request;

  try {
    if (provider === "stripe") {
      const session = await stripe.checkout.sessions.retrieve(transaction_id);
      callback(null, {
        verified: session.payment_status === "paid",
        status: session.payment_status,
      });

    } else if (provider === "razorpay") {
      const crypto = await import("crypto");
      const expectedSig = crypto.default
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
        .update(`${order_id}|${payment_id}`)
        .digest("hex");

      const verified = expectedSig === signature;
      callback(null, { verified, status: verified ? "paid" : "failed" });

    } else {
      callback(null, { verified: false, status: "unknown", error_message: "Unknown provider" });
    }
  } catch (err) {
    console.error("[gRPC] VerifyPayment error:", err.message);
    callback(null, { verified: false, error_message: err.message });
  }
}

async function RefundPayment(call, callback) {
  const { transaction_id, amount, reason, provider } = call.request;

  try {
    if (provider === "stripe") {
      const paymentIntent = await stripe.checkout.sessions.retrieve(transaction_id);
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntent.payment_intent,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason: reason || "requested_by_customer",
      });
      callback(null, { success: true, refund_id: refund.id });
    } else {
      callback(null, { success: false, error_message: `Refund not yet supported for ${provider} via gRPC` });
    }
  } catch (err) {
    callback(null, { success: false, error_message: err.message });
  }
}

async function GetPaymentStatus(call, callback) {
  const { transaction_id, provider } = call.request;
  try {
    if (provider === "stripe") {
      const session = await stripe.checkout.sessions.retrieve(transaction_id);
      callback(null, { status: session.payment_status });
    } else {
      callback(null, { status: "unknown" });
    }
  } catch (err) {
    callback(null, { status: "error", error_message: err.message });
  }
}

// ─── Server Bootstrap ─────────────────────────────────────────────────────────
export function startGrpcServer() {
  const server = new grpc.Server();

  server.addService(paymentProto.PaymentService.service, {
    ProcessPayment,
    VerifyPayment,
    RefundPayment,
    GetPaymentStatus,
  });

  server.bindAsync(
    `0.0.0.0:${GRPC_PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error("❌ gRPC Server failed to start:", err);
        return;
      }
      console.log(`⚡ gRPC Payment Server running on port ${port}`);
    }
  );

  return server;
}
