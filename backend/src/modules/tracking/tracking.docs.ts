/**
 * @openapi
 * tags:
 *   - name: Tracking & Live Location Stream
 *     description: Live Rider GPS Coordinates, Delivery Tracking Sessions, Route Snapshots, Geofence Events, and Realtime ETA Calculations.
 */

/**
 * @openapi
 * /tracking/sessions:
 *   post:
 *     summary: Create Live Tracking Session
 *     tags: [Tracking & Live Location Stream]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Tracking session initialized
 *
 * /tracking/sessions/{sessionId}/location:
 *   post:
 *     summary: Push Live Rider Location Ping
 *     tags: [Tracking & Live Location Stream]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Location ping recorded and broadcasted
 */
