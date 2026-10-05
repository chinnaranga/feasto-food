import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../../shared/errors/ForbiddenError.js';
import { UnauthorizedError } from '../../shared/errors/UnauthorizedError.js';
import { UserRole } from '../../shared/constants/roles.js';
import { trackingRepository } from './tracking.repository.js';
import { Order } from '../orders/orders.model.js';

export const requireOrderTrackingAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required'));
  }

  const { role, id: userId } = req.user;
  const orderId = req.params.orderId || req.query.orderId;

  if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
    return next();
  }

  if (orderId) {
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new ForbiddenError('Order tracking resource not found'));
    }

    if (order.customerId.toString() !== userId && role !== UserRole.RESTAURANT_OWNER && role !== UserRole.RIDER) {
      return next(new ForbiddenError('You do not have permission to view tracking for this order'));
    }
  }

  next();
};
