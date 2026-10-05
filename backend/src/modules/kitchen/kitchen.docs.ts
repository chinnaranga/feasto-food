/**
 * @openapi
 * tags:
 *   - name: Kitchen Display System
 *     description: Kitchen display queue, station routing & item-level preparation tracking
 *
 * /api/v1/restaurants/{restaurantId}/kitchen/queue:
 *   get:
 *     tags: [Kitchen Display System]
 *     summary: Get live kitchen order queue (FIFO & Priority ordered)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active kitchen queue
 *
 * /api/v1/restaurants/{restaurantId}/kitchen/stations:
 *   get:
 *     tags: [Kitchen Display System]
 *     summary: List configured kitchen stations (Grill, Beverage, Dessert, etc.)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kitchen stations list
 */
