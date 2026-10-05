import { UserRole } from '../constants/roles.js';
import { Permission } from '../constants/permissions.js';

export interface UserContext {
  id: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
}

declare global {
  namespace Express {
    interface Request {
      user?: UserContext;
    }
  }
}
