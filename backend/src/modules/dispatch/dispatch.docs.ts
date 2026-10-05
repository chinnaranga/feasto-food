/**
 * @openapi
 * tags:
 *   - name: Dispatch Engine
 *     description: Real-time rider matching, deterministic scoring, delivery offer lifecycle & assignment Engine
 *
 * /api/v1/dispatch/orders/{orderId}:
 *   post:
 *     tags: [Dispatch Engine]
 *     summary: Trigger automated dispatch search and offer generation for ready order
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dispatch algorithm executed
 *
 * /api/v1/rider/offers:
 *   get:
 *     tags: [Dispatch Engine]
 *     summary: Get pending delivery offers for authenticated rider
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending offers list
 *
 * /api/v1/rider/offers/{offerId}/accept:
 *   post:
 *     tags: [Dispatch Engine]
 *     summary: Accept delivery offer and atomically assign order
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Delivery offer accepted
 */
