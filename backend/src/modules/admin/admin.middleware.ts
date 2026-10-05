import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../../shared/errors/ForbiddenError.js';
import { UnauthorizedError } from '../../shared/errors/UnauthorizedError.js';
import { UserRole } from '../../shared/constants/roles.js';
import { Permission } from '../../shared/constants/permissions.js';

export function requireAdminRole(req: Request, _res: Response, next: NextFunction): void {
  const user = req.user;
  if (!user) throw new UnauthorizedError('User authentication context missing');

  if (user.role !== UserRole.ADMIN) {
    throw new ForbiddenError(`Access denied. Requires admin privileges.`);
  }

  next();
}

export function requireAdminPermission(permission: string) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.user;
    if (!user) throw new UnauthorizedError('User authentication context missing');

    if (user.role === UserRole.ADMIN) return next();

    if (!user.permissions || !user.permissions.includes(permission as Permission)) {
      throw new ForbiddenError(`Insufficient admin permissions. Required: '${permission}'`);
    }

    next();
  };
}
