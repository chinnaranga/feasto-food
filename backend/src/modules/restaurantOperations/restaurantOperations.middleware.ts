import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../../shared/errors/ForbiddenError.js';
import { UnauthorizedError } from '../../shared/errors/UnauthorizedError.js';
import { UserRole } from '../../shared/constants/roles.js';

export function requireRestaurantAccess(req: Request, _res: Response, next: NextFunction): void {
  const user = req.user;
  if (!user) throw new UnauthorizedError('User authentication context missing');

  if (user.role === UserRole.ADMIN) return next();

  const allowedRoles: UserRole[] = [
    UserRole.RESTAURANT_OWNER,
    UserRole.RESTAURANT_MANAGER,
    UserRole.KITCHEN_STAFF,
    UserRole.CASHIER,
    UserRole.INVENTORY_MANAGER,
  ];

  if (!allowedRoles.includes(user.role)) {
    throw new ForbiddenError(`Role '${user.role}' is not authorized for restaurant operations`);
  }

  next();
}
