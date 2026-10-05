import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../../shared/errors/ForbiddenError.js';
import { UnauthorizedError } from '../../shared/errors/UnauthorizedError.js';
import { UserRole } from '../../shared/constants/roles.js';
import { ridersRepository } from './riders.repository.js';

export const requireRiderAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required'));
  }

  const { role, id: userId } = req.user;
  const targetRiderId = req.params.riderId;

  // Admins & super admins have full access
  if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
    return next();
  }

  // Find rider profile associated with current authenticated user
  const rider = await ridersRepository.findRiderByUserId(userId);
  if (!rider) {
    return next(new ForbiddenError('Rider profile not found for this user account'));
  }

  // Ensure rider accesses only their own profile
  if (targetRiderId && rider._id.toString() !== targetRiderId) {
    return next(new ForbiddenError('You do not have permission to access another rider’s account'));
  }

  // Attach rider instance to express request for convenience
  (req as any).rider = rider;
  next();
};
