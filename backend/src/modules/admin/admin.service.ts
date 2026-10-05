import { adminRepository } from './admin.repository.js';
import { User } from '../users/user.model.js';
import { Restaurant } from '../restaurants/restaurants.model.js';
import { Rider } from '../riders/riders.model.js';
import { Order } from '../orders/orders.model.js';
import { paymentsService } from '../payments/payments.service.js';
import { dispatchService } from '../dispatch/dispatch.service.js';
import { trackingRepository } from '../tracking/tracking.repository.js';
import { generateAuditId, generateAccessId, generateSettingId, generateVerificationId } from './admin.utils.js';
import { IAdminOverview, IAdminAuditLog, IAdminStaffAccess, IVerificationReview } from './admin.types.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { BadRequestError } from '../../shared/errors/BadRequestError.js';
import { socketGateway } from '../../config/socket.js';
import { notificationsService } from '../notifications/notifications.service.js';

export class AdminService {
  // 1. AUDIT LOGGING
  async logAction(data: {
    actorUserId: string;
    actorRole: string;
    action: string;
    entityType: string;
    entityId: string;
    previousState?: any;
    newState?: any;
    reason?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<IAdminAuditLog> {
    const auditId = generateAuditId();
    return adminRepository.createAuditLog({
      auditId,
      ...data,
    });
  }

  async getAuditLogs(query: Record<string, any> = {}, limit = 50, skip = 0): Promise<IAdminAuditLog[]> {
    return adminRepository.findAuditLogs(query, limit, skip);
  }

  // 2. OVERVIEW DASHBOARD
  async getOverview(): Promise<IAdminOverview> {
    const [
      activeOrdersCount,
      pendingRestaurantOrdersCount,
      activeDeliveriesCount,
      onlineRidersCount,
      onlineRestaurantsCount,
      pendingVerificationsCount,
    ] = await Promise.all([
      Order.countDocuments({ orderStatus: { $in: ['placed', 'accepted', 'preparing', 'ready'] } }),
      Order.countDocuments({ orderStatus: 'placed' }),
      Order.countDocuments({ orderStatus: 'out_for_delivery' }),
      Rider.countDocuments({ availabilityStatus: 'online', accountStatus: 'active' }),
      Restaurant.countDocuments({ status: 'active' }),
      Rider.countDocuments({ verificationStatus: 'pending_review' }),
    ]);

    return {
      activeOrdersCount,
      pendingRestaurantOrdersCount,
      activeDeliveriesCount,
      onlineRidersCount,
      onlineRestaurantsCount,
      pendingVerificationsCount,
      failedPaymentsCount: 0,
      failedDispatchesCount: 0,
      unresolvedOperationalIssuesCount: 0,
    };
  }

  // 3. USER MANAGEMENT
  async listUsers(query: Record<string, any> = {}, limit = 50, skip = 0): Promise<any[]> {
    return User.find(query).select('-password').sort({ createdAt: -1 }).limit(limit).skip(skip);
  }

  async getUserDetails(userId: string): Promise<any> {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new NotFoundError(`User ${userId} not found`);
    return user;
  }

  async suspendUser(userId: string, reason: string, actorId: string): Promise<any> {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError(`User ${userId} not found`);

    const previousState = { accountStatus: user.accountStatus };
    user.accountStatus = 'suspended';
    await user.save();

    await this.logAction({
      actorUserId: actorId,
      actorRole: 'admin',
      action: 'ADMIN_USER_SUSPENDED',
      entityType: 'user',
      entityId: userId,
      previousState,
      newState: { accountStatus: 'suspended' },
      reason,
    });

    return user;
  }

  async restoreUser(userId: string, reason: string, actorId: string): Promise<any> {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError(`User ${userId} not found`);

    user.accountStatus = 'active';
    await user.save();

    await this.logAction({
      actorUserId: actorId,
      actorRole: 'admin',
      action: 'ADMIN_USER_RESTORED',
      entityType: 'user',
      entityId: userId,
      reason,
    });

    return user;
  }

  // 4. RESTAURANT ADMINISTRATION
  async listRestaurants(query: Record<string, any> = {}, limit = 50, skip = 0): Promise<any[]> {
    return Restaurant.find(query).sort({ createdAt: -1 }).limit(limit).skip(skip);
  }

  async verifyRestaurant(restaurantId: string, reason: string, actorId: string): Promise<any> {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) throw new NotFoundError(`Restaurant ${restaurantId} not found`);

    restaurant.accountStatus = 'active';
    await restaurant.save();

    await this.logAction({
      actorUserId: actorId,
      actorRole: 'admin',
      action: 'ADMIN_RESTAURANT_VERIFIED',
      entityType: 'restaurant',
      entityId: restaurantId,
      reason,
    });

    return restaurant;
  }

  async suspendRestaurant(restaurantId: string, reason: string, actorId: string): Promise<any> {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) throw new NotFoundError(`Restaurant ${restaurantId} not found`);

    restaurant.accountStatus = 'suspended';
    await restaurant.save();

    await this.logAction({
      actorUserId: actorId,
      actorRole: 'admin',
      action: 'ADMIN_RESTAURANT_SUSPENDED',
      entityType: 'restaurant',
      entityId: restaurantId,
      reason,
    });

    return restaurant;
  }

  // 5. RIDER ADMINISTRATION
  async listRiders(query: Record<string, any> = {}, limit = 50, skip = 0): Promise<any[]> {
    return Rider.find(query).sort({ createdAt: -1 }).limit(limit).skip(skip);
  }

  async verifyRider(riderId: string, reason: string, actorId: string): Promise<any> {
    const rider = await Rider.findById(riderId);
    if (!rider) throw new NotFoundError(`Rider ${riderId} not found`);

    rider.verificationStatus = 'verified';
    rider.accountStatus = 'active';
    await rider.save();

    await this.logAction({
      actorUserId: actorId,
      actorRole: 'admin',
      action: 'ADMIN_RIDER_VERIFIED',
      entityType: 'rider',
      entityId: riderId,
      reason,
    });

    return rider;
  }

  async suspendRider(riderId: string, reason: string, actorId: string): Promise<any> {
    const rider = await Rider.findById(riderId);
    if (!rider) throw new NotFoundError(`Rider ${riderId} not found`);

    rider.accountStatus = 'suspended';
    await rider.save();

    await this.logAction({
      actorUserId: actorId,
      actorRole: 'admin',
      action: 'ADMIN_RIDER_SUSPENDED',
      entityType: 'rider',
      entityId: riderId,
      reason,
    });

    return rider;
  }

  // 6. ORDER OVERRIDE & CANCEL
  async cancelOrder(orderId: string, reason: string, actorId: string): Promise<any> {
    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError(`Order ${orderId} not found`);

    order.orderStatus = 'cancelled';
    await order.save();

    await this.logAction({
      actorUserId: actorId,
      actorRole: 'admin',
      action: 'ADMIN_ORDER_CANCELLED',
      entityType: 'order',
      entityId: orderId,
      reason,
    });

    socketGateway.emitToRoom('/orders', `order:${orderId}`, 'order.cancelled', { orderId, reason });

    return order;
  }

  async overrideOrderStatus(orderId: string, newStatus: any, reason: string, actorId: string): Promise<any> {
    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError(`Order ${orderId} not found`);

    const previousState = { orderStatus: order.orderStatus };
    order.orderStatus = newStatus;
    await order.save();

    await this.logAction({
      actorUserId: actorId,
      actorRole: 'admin',
      action: 'ADMIN_ORDER_OVERRIDDEN',
      entityType: 'order',
      entityId: orderId,
      previousState,
      newState: { orderStatus: newStatus },
      reason,
    });

    return order;
  }

  // 7. VERIFICATION CENTER
  async listVerifications(query: Record<string, any> = {}, limit = 50, skip = 0): Promise<IVerificationReview[]> {
    return adminRepository.findVerifications(query, limit, skip);
  }

  async approveVerification(verificationId: string, reason: string, actorId: string): Promise<IVerificationReview> {
    const vrf = await adminRepository.findVerificationById(verificationId);
    if (!vrf) throw new NotFoundError(`Verification review ${verificationId} not found`);

    const updated = await adminRepository.updateVerification(verificationId, {
      status: 'APPROVED',
      reviewerId: actorId,
      reason,
      newStatus: 'APPROVED',
    });

    if (vrf.targetType === 'rider') {
      await this.verifyRider(vrf.targetId, reason, actorId);
    } else if (vrf.targetType === 'restaurant') {
      await this.verifyRestaurant(vrf.targetId, reason, actorId);
    }

    return updated!;
  }

  // 8. PLATFORM SETTINGS
  async getSettings(category?: string): Promise<any[]> {
    return adminRepository.findSettings(category);
  }

  async updateSetting(category: any, key: string, value: any, actorId: string, description?: string): Promise<any> {
    const setting = await adminRepository.upsertSetting(key, category, value, actorId, description);

    await this.logAction({
      actorUserId: actorId,
      actorRole: 'admin',
      action: 'ADMIN_SETTINGS_CHANGED',
      entityType: 'setting',
      entityId: key,
      newState: { value },
    });

    return setting;
  }

  // 9. STAFF MANAGEMENT
  async listStaff(): Promise<IAdminStaffAccess[]> {
    return adminRepository.findStaffList();
  }

  async createStaff(userId: string, role: any, permissions: string[], actorId: string): Promise<IAdminStaffAccess> {
    const accessId = generateAccessId();
    const staff = await adminRepository.createStaffAccess({
      accessId,
      userId,
      role,
      permissions,
      isSuspended: false,
      grantedBy: actorId,
    });

    await this.logAction({
      actorUserId: actorId,
      actorRole: 'admin',
      action: 'ADMIN_STAFF_CREATED',
      entityType: 'staff',
      entityId: userId,
      newState: { role, permissions },
    });

    return staff;
  }
}

export const adminService = new AdminService();
