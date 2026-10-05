/**
 * @openapi
 * tags:
 *   - name: Payments
 *     description: Financial payment processing, transaction ledger, wallets, payouts, settlements & refunds
 *
 * /api/v1/payments/initialize:
 *   post:
 *     tags: [Payments]
 *     summary: Initialize a new payment transaction intent
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId, customerId, restaurantId, amount]
 *             properties:
 *               orderId:
 *                 type: string
 *               customerId:
 *                 type: string
 *               restaurantId:
 *                 type: string
 *               amount:
 *                 type: number
 *               gateway:
 *                 type: string
 *                 enum: [stripe, razorpay, wallet, cod, cash]
 *     responses:
 *       21:
 *         description: Payment initialized
 *
 * /api/v1/payments/confirm:
 *   post:
 *     tags: [Payments]
 *     summary: Confirm gateway payment status and capture funds
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment confirmed and ledger recorded
 *
 * /api/v1/wallets:
 *   get:
 *     tags: [Payments]
 *     summary: Retrieve user or owner wallet balance details
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet state retrieved
 *
 * /api/v1/payouts:
 *   post:
 *     tags: [Payments]
 *     summary: Initiate payout request to restaurant or rider
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       21:
 *         description: Payout initiated
 *
 * /api/v1/refunds:
 *   post:
 *     tags: [Payments]
 *     summary: Request or process customer refund
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       21:
 *         description: Refund processed
 *
 * /api/v1/webhooks/payments:
 *   post:
 *     tags: [Payments]
 *     summary: Secure gateway webhook receiver for payment events
 *     responses:
 *       200:
 *         description: Webhook event verified and processed
 */
