import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../../shared/errors/ForbiddenError.js';
import { UnauthorizedError } from '../../shared/errors/UnauthorizedError.js';
import { notificationsRepository } from './notifications.repository.js';

export async function requireNotificationOwnership(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const user = req.user;
  if (!user) throw new UnauthorizedError('User authentication context missing');

  if (user.role === 'admin') return next();

  const notificationIdParam = req.params.notificationId;
  const notificationId = Array.isArray(notificationIdParam)
    ? notificationIdParam[0]
    : notificationIdParam;
  if (!notificationId) return next();

  const notif = await notificationsRepository.findNotificationById(notificationId);
  if (!notif) return next(); // Let controller handle 404

  if (notif.recipientUserId !== user.id) {
    throw new ForbiddenError('You can only access your own notifications');
  }

  next();
}
