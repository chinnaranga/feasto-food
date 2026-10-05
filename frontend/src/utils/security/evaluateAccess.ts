import { AdminRole, AdminPermission } from '../../types/admin';
import { accessControl } from '../../services/security/accessControl';

// Evaluates complex conditions like OR/AND permission lists
export const evaluateAccess = {
  // Checks if a role has ANY of the specified permissions (OR check)
  hasAny: (role: AdminRole, permissions: AdminPermission[]): boolean => {
    return permissions.some((permission) => accessControl.hasAccess(role, permission));
  },

  // Checks if a role has ALL of the specified permissions (AND check)
  hasAll: (role: AdminRole, permissions: AdminPermission[]): boolean => {
    return permissions.every((permission) => accessControl.hasAccess(role, permission));
  },
};
