/**
 * @openapi
 * tags:
 *   - name: Notifications
 *     description: In-App, Web/Mobile Push, Email, SMS, & Real-Time Socket Notifications System
 *
 * /api/v1/notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Get user in-app notification feed with optional type and category filtering
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications retrieved
 *
 * /api/v1/notifications/unread:
 *   get:
 *     tags: [Notifications]
 *     summary: Get unread notifications count and unread notification items
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread notification count and items
 *
 * /api/v1/notifications/preferences:
 *   get:
 *     tags: [Notifications]
 *     summary: Retrieve user notification channel preferences
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User preference matrix retrieved
 *   patch:
 *     tags: [Notifications]
 *     summary: Update notification channel preferences
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Preferences updated
 *
 * /api/v1/notifications/devices:
 *   post:
 *     tags: [Notifications]
 *     summary: Register push notification device token (FCM Web/Android/iOS)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Push device registered
 */
