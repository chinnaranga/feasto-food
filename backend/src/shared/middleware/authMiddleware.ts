import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import { ForbiddenError } from '../errors/ForbiddenError.js';
import { UserRole } from '../constants/roles.js';
import { Permission, ROLE_PERMISSIONS } from '../constants/permissions.js';

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authorization header missing or invalid format');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new UnauthorizedError('Access token is missing');
  }

  const decoded = verifyAccessToken(token);

  req.user = {
    id: decoded.sub,
    email: decoded.email,
    role: decoded.role,
    permissions: ROLE_PERMISSIONS[decoded.role] || [],
  };

  next();
};

export const requireRoles = (...allowedRoles: (UserRole | string)[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('User authentication context missing');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(
        `Role '${req.user.role}' is not authorized to access this resource`
      );
    }

    next();
  };
};

export const requirePermissions = (...requiredPermissions: (Permission | string)[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('User authentication context missing');
    }

    const hasAllPermissions = requiredPermissions.every((permission) =>
      req.user?.permissions.includes(permission as Permission)
    );

    if (!hasAllPermissions) {
      throw new ForbiddenError(
        `Insufficient permissions. Required: [${requiredPermissions.join(', ')}]`
      );
    }

    next();
  };
};
