import { Request, Response } from 'express';
import { adminService } from './admin.service.js';
import { HttpStatus } from '../../shared/constants/httpStatusCodes.js';

function parseParam(val: string | string[] | undefined): string {
  if (Array.isArray(val)) return val[0];
  return val || '';
}

export class AdminController {
  async getOverview(_req: Request, res: Response): Promise<void> {
    const overview = await adminService.getOverview();
    res.status(HttpStatus.OK).json({
      success: true,
      data: overview,
      timestamp: new Date().toISOString(),
    });
  }

  // USERS
  async listUsers(req: Request, res: Response): Promise<void> {
    const users = await adminService.listUsers();
    res.status(HttpStatus.OK).json({
      success: true,
      count: users.length,
      data: users,
      timestamp: new Date().toISOString(),
    });
  }

  async getUser(req: Request, res: Response): Promise<void> {
    const userId = parseParam(req.params.userId);
    const user = await adminService.getUserDetails(userId);
    res.status(HttpStatus.OK).json({
      success: true,
      data: user,
      timestamp: new Date().toISOString(),
    });
  }

  async suspendUser(req: Request, res: Response): Promise<void> {
    const userId = parseParam(req.params.userId);
    const user = await adminService.suspendUser(userId, req.body.reason, req.user?.id || '');
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'User suspended successfully',
      data: user,
      timestamp: new Date().toISOString(),
    });
  }

  async restoreUser(req: Request, res: Response): Promise<void> {
    const userId = parseParam(req.params.userId);
    const user = await adminService.restoreUser(userId, req.body.reason || 'Restored by admin', req.user?.id || '');
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'User restored successfully',
      data: user,
      timestamp: new Date().toISOString(),
    });
  }

  // RESTAURANTS
  async listRestaurants(_req: Request, res: Response): Promise<void> {
    const restaurants = await adminService.listRestaurants();
    res.status(HttpStatus.OK).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
      timestamp: new Date().toISOString(),
    });
  }

  async verifyRestaurant(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const restaurant = await adminService.verifyRestaurant(restaurantId, req.body.reason || 'Approved', req.user?.id || '');
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Restaurant verified successfully',
      data: restaurant,
      timestamp: new Date().toISOString(),
    });
  }

  async suspendRestaurant(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const restaurant = await adminService.suspendRestaurant(restaurantId, req.body.reason, req.user?.id || '');
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Restaurant suspended',
      data: restaurant,
      timestamp: new Date().toISOString(),
    });
  }

  // RIDERS
  async listRiders(_req: Request, res: Response): Promise<void> {
    const riders = await adminService.listRiders();
    res.status(HttpStatus.OK).json({
      success: true,
      count: riders.length,
      data: riders,
      timestamp: new Date().toISOString(),
    });
  }

  async verifyRider(req: Request, res: Response): Promise<void> {
    const riderId = parseParam(req.params.riderId);
    const rider = await adminService.verifyRider(riderId, req.body.reason || 'Verification approved', req.user?.id || '');
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Rider verified successfully',
      data: rider,
      timestamp: new Date().toISOString(),
    });
  }

  async suspendRider(req: Request, res: Response): Promise<void> {
    const riderId = parseParam(req.params.riderId);
    const rider = await adminService.suspendRider(riderId, req.body.reason, req.user?.id || '');
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Rider suspended',
      data: rider,
      timestamp: new Date().toISOString(),
    });
  }

  // ORDERS
  async cancelOrder(req: Request, res: Response): Promise<void> {
    const orderId = parseParam(req.params.orderId);
    const order = await adminService.cancelOrder(orderId, req.body.reason, req.user?.id || '');
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Order cancelled by admin',
      data: order,
      timestamp: new Date().toISOString(),
    });
  }

  async overrideOrder(req: Request, res: Response): Promise<void> {
    const orderId = parseParam(req.params.orderId);
    const order = await adminService.overrideOrderStatus(orderId, req.body.newStatus, req.body.reason, req.user?.id || '');
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Order status overridden by admin',
      data: order,
      timestamp: new Date().toISOString(),
    });
  }

  // VERIFICATIONS
  async listVerifications(_req: Request, res: Response): Promise<void> {
    const verifications = await adminService.listVerifications();
    res.status(HttpStatus.OK).json({
      success: true,
      count: verifications.length,
      data: verifications,
      timestamp: new Date().toISOString(),
    });
  }

  async approveVerification(req: Request, res: Response): Promise<void> {
    const verificationId = parseParam(req.params.verificationId);
    const review = await adminService.approveVerification(verificationId, req.body.reason || 'Approved', req.user?.id || '');
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Verification review approved',
      data: review,
      timestamp: new Date().toISOString(),
    });
  }

  // SETTINGS
  async getSettings(_req: Request, res: Response): Promise<void> {
    const settings = await adminService.getSettings();
    res.status(HttpStatus.OK).json({
      success: true,
      count: settings.length,
      data: settings,
      timestamp: new Date().toISOString(),
    });
  }

  async updateSetting(req: Request, res: Response): Promise<void> {
    const setting = await adminService.updateSetting(
      req.body.category,
      req.body.key,
      req.body.value,
      req.user?.id || '',
      req.body.description
    );
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Platform setting updated',
      data: setting,
      timestamp: new Date().toISOString(),
    });
  }

  // STAFF
  async listStaff(_req: Request, res: Response): Promise<void> {
    const staff = await adminService.listStaff();
    res.status(HttpStatus.OK).json({
      success: true,
      count: staff.length,
      data: staff,
      timestamp: new Date().toISOString(),
    });
  }

  async createStaff(req: Request, res: Response): Promise<void> {
    const staff = await adminService.createStaff(
      req.body.userId,
      req.body.role,
      req.body.permissions,
      req.user?.id || ''
    );
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Admin staff member created',
      data: staff,
      timestamp: new Date().toISOString(),
    });
  }

  // AUDIT LOGS
  async getAuditLogs(_req: Request, res: Response): Promise<void> {
    const logs = await adminService.getAuditLogs();
    res.status(HttpStatus.OK).json({
      success: true,
      count: logs.length,
      data: logs,
      timestamp: new Date().toISOString(),
    });
  }
}

export const adminController = new AdminController();
