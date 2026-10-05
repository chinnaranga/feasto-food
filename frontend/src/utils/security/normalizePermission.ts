import { AdminPermission } from '../../types/admin';

// Normalizes and sanitizes permission string formatting
export const normalizePermission = (permission: string): AdminPermission => {
  const normalized = permission.toLowerCase().trim().replace(/[\s-]/g, '_');
  return normalized as AdminPermission;
};
