import { Request, Response } from 'express';
import { notificationsService } from './notifications.service.js';
import { HttpStatus } from '../../shared/constants/httpStatusCodes.js';

function parseParam(val: string | string[] | undefined): string {
  if (Array.isArray(val)) return val[0];
  return val || '';
}

export class NotificationsController {
  // NOTIFICATIONS
  async getNotifications(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id || '';
    const limit = Number(req.query.limit) || 50;
    const skip = Number(req.query.skip) || 0;
    const filter: Record<string, any> = {};

    if (req.query.type) filter.type = parseParam(req.query.type as string);
    if (req.query.category) filter.category = parseParam(req.query.category as string);
    if (req.query.channel) filter.channel = parseParam(req.query.channel as string);

    const notifications = await notificationsService.getUserNotifications(userId, filter, limit, skip);
    res.status(HttpStatus.OK).json({
      success: true,
      count: notifications.length,
      data: notifications,
      timestamp: new Date().toISOString(),
    });
  }

  async getUnread(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id || '';
    const unreadData = await notificationsService.getUnreadUserNotifications(userId);
    res.status(HttpStatus.OK).json({
      success: true,
      data: unreadData,
      timestamp: new Date().toISOString(),
    });
  }

  async getNotification(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id || '';
    const notificationId = parseParam(req.params.notificationId);
    const notification = await notificationsService.getNotificationById(notificationId, userId);
    res.status(HttpStatus.OK).json({
      success: true,
      data: notification,
      timestamp: new Date().toISOString(),
    });
  }

  async markRead(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id || '';
    const notificationId = parseParam(req.params.notificationId);
    const notification = await notificationsService.markAsRead(notificationId, userId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
      timestamp: new Date().toISOString(),
    });
  }

  async markAllRead(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id || '';
    const result = await notificationsService.markAllAsRead(userId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'All notifications marked as read',
      data: result,
      timestamp: new Date().toISOString(),
    });
  }

  async archiveNotification(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id || '';
    const notificationId = parseParam(req.params.notificationId);
    const notification = await notificationsService.archiveNotification(notificationId, userId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Notification archived',
      data: notification,
      timestamp: new Date().toISOString(),
    });
  }

  async deleteNotification(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id || '';
    const notificationId = parseParam(req.params.notificationId);
    await notificationsService.deleteNotification(notificationId, userId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Notification deleted',
      timestamp: new Date().toISOString(),
    });
  }

  // PREFERENCES
  async getPreferences(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id || '';
    const prefs = await notificationsService.getOrCreateUserPreferences(userId);
    res.status(HttpStatus.OK).json({
      success: true,
      data: prefs,
      timestamp: new Date().toISOString(),
    });
  }

  async updatePreferences(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id || '';
    const prefs = await notificationsService.updateUserPreferences(userId, req.body);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Notification preferences updated',
      data: prefs,
      timestamp: new Date().toISOString(),
    });
  }

  // DEVICES
  async getDevices(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id || '';
    const devices = await notificationsService.getUserDevices(userId);
    res.status(HttpStatus.OK).json({
      success: true,
      count: devices.length,
      data: devices,
      timestamp: new Date().toISOString(),
    });
  }

  async registerDevice(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id || '';
    const device = await notificationsService.registerDevice(
      userId,
      req.body.token,
      req.body.platform,
      req.body.appVersion
    );
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Device registered for push notifications',
      data: device,
      timestamp: new Date().toISOString(),
    });
  }

  async updateDevice(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id || '';
    const deviceId = parseParam(req.params.deviceId);
    const device = await notificationsService.updateDevice(deviceId, userId, req.body);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Device updated',
      data: device,
      timestamp: new Date().toISOString(),
    });
  }

  async removeDevice(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id || '';
    const deviceId = parseParam(req.params.deviceId);
    await notificationsService.removeDevice(deviceId, userId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Device token removed',
      timestamp: new Date().toISOString(),
    });
  }

  // INTERNAL DISPATCH
  async dispatchEvent(req: Request, res: Response): Promise<void> {
    const result = await notificationsService.dispatchNotificationEvent(req.body);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Notification event dispatched',
      data: result,
      timestamp: new Date().toISOString(),
    });
  }
}

export const notificationsController = new NotificationsController();
