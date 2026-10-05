/**
 * @openapi
 * tags:
 *   - name: Admin Platform
 *     description: Enterprise platform administration, user/restaurant/rider verification, operational overrides & audit logging
 *
 * /api/v1/admin/overview:
 *   get:
 *     tags: [Admin Platform]
 *     summary: Retrieve real-time operational overview metrics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Operational overview metrics
 *
 * /api/v1/admin/users:
 *   get:
 *     tags: [Admin Platform]
 *     summary: List platform user accounts with filter and pagination
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user accounts
 *
 * /api/v1/admin/restaurants/{restaurantId}/verify:
 *   post:
 *     tags: [Admin Platform]
 *     summary: Verify restaurant workspace partner
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Restaurant verified
 */
