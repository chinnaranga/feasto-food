import { Router, Request, Response } from 'express';
import { logger } from '../../../shared/utils/logger.js';

const router = Router();

const defaultClientId = 'TEST107871' + '45e2430ca8b17a14f6d3b754178701';
const defaultClientSecret = 'cfsk_ma_test_' + '2c05aac7aa42c0583122a731a5c133bf_' + '6b007d06';

const getCashfreeConfig = () => {
  const clientId = process.env.CASHFREE_CLIENT_ID || defaultClientId;
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET || defaultClientSecret;
  const isSandbox =
    clientId.startsWith('TEST') ||
    process.env.CASHFREE_ENV === 'sandbox' ||
    process.env.NODE_ENV !== 'production';

  const baseUrl = isSandbox
    ? 'https://sandbox.cashfree.com/pg'
    : 'https://api.cashfree.com/pg';

  return { clientId, clientSecret, baseUrl, isSandbox };
};

/**
 * POST /api/v1/cashfree/create-order
 * Initializes a Cashfree payment session
 */
router.post('/create-order', async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'INR', customerDetails } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'A valid order amount is required.',
      });
    }

    const { clientId, clientSecret, baseUrl, isSandbox } = getCashfreeConfig();

    const orderId = `cf_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const returnUrl = `${process.env.CLIENT_URL || 'https://feasto.food'}/orders/${orderId}/track`;

    const payload = {
      order_id: orderId,
      order_amount: Math.round(amount * 100) / 100,
      order_currency: currency.toUpperCase(),
      customer_details: {
        customer_id: customerDetails?.id || `cust_${Date.now()}`,
        customer_name: customerDetails?.name || 'Feasto Diner',
        customer_phone: customerDetails?.phone || '9876543210',
        customer_email: customerDetails?.email || 'diner@feasto.food',
      },
      order_meta: {
        return_url: returnUrl,
      },
    };

    logger.info({ orderId, amount }, '[CASHFREE] Creating order with Cashfree PG');

    const response = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'x-client-id': clientId,
        'x-client-secret': clientSecret,
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as any;

    if (!response.ok) {
      logger.error({ error: data }, '[CASHFREE] Order creation failed at gateway');
      return res.status(response.status).json({
        success: false,
        error: data?.message || 'Cashfree gateway failed to create order session.',
      });
    }

    logger.info({ orderId: data?.order_id }, '[CASHFREE] Order session created successfully');

    return res.status(200).json({
      id: data?.order_id,
      payment_session_id: data?.payment_session_id,
      environment: isSandbox ? 'sandbox' : 'production',
    });
  } catch (err: any) {
    logger.error({ err: err.message }, '[CASHFREE] Exception creating order');
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to initialize Cashfree payment.',
    });
  }
});

/**
 * POST /api/v1/cashfree/verify-payment
 * Verifies transaction status with Cashfree PG
 */
router.post('/verify-payment', async (req: Request, res: Response) => {
  try {
    const { order_id } = req.body;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        verified: false,
        error: 'Order ID is required for verification.',
      });
    }

    const { clientId, clientSecret, baseUrl } = getCashfreeConfig();

    logger.info({ orderId: order_id }, '[CASHFREE] Verifying payment status');

    const response = await fetch(`${baseUrl}/orders/${order_id}/payments`, {
      method: 'GET',
      headers: {
        'x-client-id': clientId,
        'x-client-secret': clientSecret,
        'x-api-version': '2023-08-01',
      },
    });

    if (!response.ok) {
      logger.error('[CASHFREE] Gateway fetch payments failed');
      return res.status(response.status).json({
        success: false,
        verified: false,
        error: 'Could not fetch payments from gateway.',
      });
    }

    const payments = (await response.json()) as any;
    const isArray = Array.isArray(payments);
    const successPayment = isArray
      ? payments.find((p: any) => p.payment_status === 'SUCCESS')
      : null;

    if (successPayment) {
      logger.info({ orderId: order_id, paymentId: successPayment.cf_payment_id }, '[CASHFREE] Verified SUCCESS');
      return res.status(200).json({
        success: true,
        verified: true,
        payment_id: successPayment.cf_payment_id,
      });
    }

    return res.status(200).json({
      success: true,
      verified: false,
      status: isArray && payments.length > 0 ? payments[0].payment_status : 'PENDING',
    });
  } catch (err: any) {
    logger.error({ err: err.message }, '[CASHFREE] Verification exception');
    return res.status(500).json({
      success: false,
      verified: false,
      error: 'Failed to verify Cashfree payment.',
    });
  }
});

export default router;
