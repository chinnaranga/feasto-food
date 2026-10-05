import { AdminRole, AdminPermission } from '../../types/admin';

// Unified Role Permissions Mapping
const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  super_admin: [
    'view_dashboard',
    'manage_restaurants',
    'manage_orders',
    'manage_users',
    'manage_delivery',
    'manage_support',
    'manage_marketing',
    'view_analytics',
    'manage_content',
    'manage_settings',
  ],
  admin: [
    'view_dashboard',
    'manage_restaurants',
    'manage_orders',
    'manage_users',
    'manage_delivery',
    'manage_support',
    'manage_marketing',
    'view_analytics',
    'manage_content',
  ],
  restaurant_owner: ['view_dashboard', 'manage_restaurants', 'manage_orders', 'view_analytics'],
  restaurant_manager: ['view_dashboard', 'manage_restaurants', 'manage_orders'],
  support: ['view_dashboard', 'manage_orders', 'manage_support'],
  delivery_manager: ['view_dashboard', 'manage_orders', 'manage_delivery'],
  marketing: ['view_dashboard', 'manage_marketing', 'manage_content', 'view_analytics'],
  finance: ['view_dashboard', 'view_analytics'],
  analyst: ['view_dashboard', 'view_analytics'],
};

export const accessControl = {
  // Validate if a role has the required permission
  hasAccess: (role: AdminRole, permission: AdminPermission): boolean => {
    const list = ROLE_PERMISSIONS[role];
    return list ? list.includes(permission) : false;
  },

  // Get all permission mappings for a specific role
  getPermissions: (role: AdminRole): AdminPermission[] => {
    return ROLE_PERMISSIONS[role] || [];
  },
};
export { ROLE_PERMISSIONS };
