/**
 * @openapi
 * tags:
 *   - name: Restaurant Operations
 *     description: Real-time order fulfillment, kitchen workflow, operational status & delay management
 *
 * /api/v1/restaurants/{restaurantId}/orders/incoming:
 *   get:
 *     tags: [Restaurant Operations]
 *     summary: Retrieve incoming placed orders pending restaurant acceptance
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of incoming orders
 *
 * /api/v1/restaurants/{restaurantId}/orders/{orderId}/accept:
 *   post:
 *     tags: [Restaurant Operations]
 *     summary: Accept incoming order and set preparation ETA
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order accepted by restaurant
 *
 * /api/v1/restaurants/{restaurantId}/operations/status:
 *   get:
 *     tags: [Restaurant Operations]
 *     summary: Get current operational status (OPEN, BUSY, PAUSED, CLOSED)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Operational status retrieved
 */
