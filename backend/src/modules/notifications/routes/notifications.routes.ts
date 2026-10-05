import { Router } from 'express';
import { notificationsController } from '../notifications.controller.js';
import { validateRequest } from '../../../shared/validators/common.js';
import { dispatchNotificationEventSchema } from '../notifications.validation.js';
import { authenticate, requireRoles } from '../../../shared/middleware/authMiddleware.js';
import { catchAsync } from '../../../shared/utils/catchAsync.js';

const router = Router();

// All notification routes require authentication
router.use(authenticate);

// GET /notifications — list user notifications (filterable by type, category, channel)
router.get('/', catchAsync(notificationsController.getNotifications));

// GET /notifications/unread — get unread notifications + unread count
router.get('/unread', catchAsync(notificationsController.getUnread));

// PATCH /notifications/read-all — mark all as read
router.patch('/read-all', catchAsync(notificationsController.markAllRead));

// GET /notifications/:notificationId — get a single notification
router.get('/:notificationId', catchAsync(notificationsController.getNotification));

// PATCH /notifications/:notificationId/read — mark a single notification as read
router.patch('/:notificationId/read', catchAsync(notificationsController.markRead));

// PATCH /notifications/:notificationId/archive — archive a notification
router.patch('/:notificationId/archive', catchAsync(notificationsController.archiveNotification));

// DELETE /notifications/:notificationId — permanently delete a notification
router.delete('/:notificationId', catchAsync(notificationsController.deleteNotification));

// POST /notifications/dispatch — internal event dispatch (admin/service only)
router.post(
  '/dispatch',
  requireRoles('admin', 'super_admin'),
  validateRequest({ body: dispatchNotificationEventSchema }),
  catchAsync(notificationsController.dispatchEvent)
);

export default router;
