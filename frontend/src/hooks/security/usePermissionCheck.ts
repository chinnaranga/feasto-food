import { useAdminStore } from '../../store/admin/adminStore';
import { accessControl } from '../../services/security/accessControl';
import { AdminPermission } from '../../types/admin';

export const usePermissionCheck = () => {
  const { activeRole } = useAdminStore();

  const hasPermission = (permission: AdminPermission): boolean => {
    return accessControl.hasAccess(activeRole, permission);
  };

  const getRolePermissions = () => {
    return accessControl.getPermissions(activeRole);
  };

  return {
    activeRole,
    hasPermission,
    getRolePermissions,
  };
};
export { usePermissionCheck as useAccessBoundary }; // support alternate naming hook
