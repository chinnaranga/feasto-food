/**
 * gRPC Payment Client
 * Used by Express routes to call the internal Payment gRPC service
 * instead of calling Stripe/Razorpay SDKs directly.
 */
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "payment.proto");
const GRPC_HOST = process.env.GRPC_HOST || "localhost";
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

// ─── Singleton Client ─────────────────────────────────────────────────────────
let _client = null;

function getClient() {
  if (!_client) {
    _client = new paymentProto.PaymentService(
      `${GRPC_HOST}:${GRPC_PORT}`,
      grpc.credentials.createInsecure()
    );
  }
  return _client;
}

// ─── Promisified Helpers ──────────────────────────────────────────────────────

/**
 * Process a payment via gRPC
 * @param {object} params - { order_id, amount, currency, provider, customer_id, customer_email, description }
 */
export function processPayment(params) {
  return new Promise((resolve, reject) => {
    getClient().ProcessPayment(params, (err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

/**
 * Verify a payment via gRPC
 * @param {object} params - { transaction_id, order_id, provider, signature, payment_id }
 */
export function verifyPayment(params) {
  return new Promise((resolve, reject) => {
    getClient().VerifyPayment(params, (err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

/**
 * Issue a refund via gRPC
 * @param {object} params - { transaction_id, amount, reason, provider }
 */
export function refundPayment(params) {
  return new Promise((resolve, reject) => {
    getClient().RefundPayment(params, (err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

/**
 * Get payment status via gRPC
 * @param {object} params - { transaction_id, provider }
 */
export function getPaymentStatus(params) {
  return new Promise((resolve, reject) => {
    getClient().GetPaymentStatus(params, (err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}
