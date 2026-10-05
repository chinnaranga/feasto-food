import { Request, Response, NextFunction } from 'express';
import { restaurantsRepository } from './restaurants.repository.js';
import { UnauthorizedError } from '../../shared/errors/UnauthorizedError.js';
import { ForbiddenError } from '../../shared/errors/ForbiddenError.js';
import { UserRole } from '../../shared/constants/roles.js';
import { RESTAURANT_ERROR_CODES } from './restaurants.constants.js';

export const requireRestaurantAccess = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const rawId = req.params.restaurantId;
    const restaurantId = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!restaurantId) {
      throw new ForbiddenError('Restaurant ID parameter missing');
    }

    // Platform Admins always have access
    if (req.user.role === UserRole.ADMIN || req.user.role === UserRole.SUPER_ADMIN) {
      return next();
    }

    const restaurant = await restaurantsRepository.findRestaurantById(restaurantId);
    if (!restaurant) {
      throw new ForbiddenError('Restaurant workspace not found', RESTAURANT_ERROR_CODES.RESTAURANT_NOT_FOUND);
    }

    // Direct Owner check
    if (restaurant.ownerUserId.toString() === req.user.id) {
      return next();
    }

    // Staff Access check
    const staffAccess = await restaurantsRepository.findStaffAccess(restaurantId, req.user.id);
    if (staffAccess && staffAccess.isActive) {
      return next();
    }

    throw new ForbiddenError(
      'You do not have permission to access or manage this restaurant workspace',
      RESTAURANT_ERROR_CODES.UNAUTHORIZED_RESTAURANT_ACCESS
    );
  } catch (error) {
    next(error);
  }
};
