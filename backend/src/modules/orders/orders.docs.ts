/**
 * @openapi
 * tags:
 *   - name: Order, Cart & Checkout Lifecycle
 *     description: Shopping Cart persistence, Checkout validation, Order Creation with Immutable Snapshots, Order State Machine, and Restaurant Kitchen Queue.
 */

/**
 * @openapi
 * /cart:
 *   get:
 *     summary: Read Customer Cart
 *     tags: [Order, Cart & Checkout Lifecycle]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Active cart details returned
 *
 * /checkout/initialize:
 *   post:
 *     summary: Initialize Checkout Session
 *     tags: [Order, Cart & Checkout Lifecycle]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Checkout session created with pricing breakdown
 *
 * /orders:
 *   get:
 *     summary: List Customer Order History
 *     tags: [Order, Cart & Checkout Lifecycle]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of customer orders returned
 */
