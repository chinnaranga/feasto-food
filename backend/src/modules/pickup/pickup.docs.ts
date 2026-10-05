/**
 * @openapi
 * tags:
 *   - name: Pickup Handoff
 *     description: Restaurant-to-rider pickup verification and handoff confirmation
 *
 * /api/v1/restaurants/{restaurantId}/orders/{orderId}/handoff:
 *   get:
 *     tags: [Pickup Handoff]
 *     summary: Get pickup handoff details for an order
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Handoff record retrieved
 *
 * /api/v1/restaurants/{restaurantId}/orders/{orderId}/handoff/confirm:
 *   post:
 *     tags: [Pickup Handoff]
 *     summary: Verify pickup code and confirm handoff to rider
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Handoff confirmed and order status updated to out_for_delivery
 */
