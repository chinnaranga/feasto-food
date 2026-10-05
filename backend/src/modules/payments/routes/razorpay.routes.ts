import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { logger } from '../../../shared/utils/logger.js';

const router = Router();

const getRazorpayCredentials = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    logger.error('Razorpay credentials missing from server environment variables');
    throw new Error('Razorpay server configuration is incomplete.');
  }

  return { keyId, keySecret };
};

/**
 * POST /api/v1/razorpay/create-order
 * Initiates real Razorpay order on Razorpay servers
 */
router.post('/create-order', async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'A valid amount in paise is required.',
      });
    }

    const { keyId, keySecret } = getRazorpayCredentials();

    logger.info({ amount, currency, receipt }, '[RAZORPAY] Creating order with gateway');

    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const gatewayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({
        amount: Math.round(amount), // ensure integer paise
        currency: currency.toUpperCase(),
        receipt: receipt || `rcpt_${Date.now()}`,
        notes: notes || {},
      }),
    });

    const orderData = (await gatewayResponse.json()) as any;

    if (!gatewayResponse.ok) {
      logger.error({ gatewayError: orderData }, '[RAZORPAY] Order creation failed on Razorpay');
      return res.status(gatewayResponse.status).json({
        success: false,
        error: orderData?.error?.description || 'Failed to create order on payment gateway.',
      });
    }

    logger.info({ orderId: orderData.id }, '[RAZORPAY] Order successfully created');
    return res.status(200).json(orderData);
  } catch (err: any) {
    logger.error({ err: err.message }, '[RAZORPAY] Server error during order creation');
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal payment service error.',
    });
  }
});

/**
 * POST /api/v1/razorpay/verify-payment
 * Verifies Razorpay HMAC signature server-side
 */
router.post('/verify-payment', async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        verified: false,
        error: 'Missing required Razorpay verification parameters.',
      });
    }

    const { keySecret } = getRazorpayCredentials();

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const verified = expectedSignature === razorpay_signature;

    logger.info(
      { orderId: razorpay_order_id, paymentId: razorpay_payment_id, verified },
      '[RAZORPAY] Signature verification completed'
    );

    return res.status(200).json({
      success: true,
      verified,
    });
  } catch (err: any) {
    logger.error({ err: err.message }, '[RAZORPAY] Verification server error');
    return res.status(500).json({
      success: false,
      verified: false,
      error: 'Failed to verify payment signature on server.',
    });
  }
});

/**
 * GET /api/v1/razorpay/payment-status/:orderId
 * Network-resilient order status query
 */
router.get('/payment-status/:orderId', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { keyId, keySecret } = getRazorpayCredentials();

    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const response = await fetch(`https://api.razorpay.com/v1/orders/${orderId}`, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: 'Could not fetch payment status from gateway.',
      });
    }

    const data = (await response.json()) as any;
    return res.status(200).json({
      success: true,
      data: {
        orderId: data.id,
        status: data.status,
        amount: data.amount,
        amount_paid: data.amount_paid,
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to check status with payment gateway.',
    });
  }
});

export default router;
