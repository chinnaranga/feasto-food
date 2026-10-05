/**
 * @openapi
 * tags:
 *   - name: Rider Partner Operations
 *     description: Rider Profile, Vehicle Manager, Document Verification Tracker, Shift Availability, Delivery Zones, and Active Delivery Lifecycle.
 */

/**
 * @openapi
 * /riders:
 *   post:
 *     summary: Create Rider Profile
 *     tags: [Rider Partner Operations]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Rider profile created
 *
 * /riders/{riderId}/availability:
 *   patch:
 *     summary: Toggle Shift Availability (Online/Offline)
 *     tags: [Rider Partner Operations]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Shift availability updated
 */
