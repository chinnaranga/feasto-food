import { UserRole } from './roles.js';

export enum Permission {
  // Auth & Identity
  AUTH_READ = 'auth:read',
  AUTH_WRITE = 'auth:write',

  // User Management
  USER_READ = 'user:read',
  USER_WRITE = 'user:write',

  // Restaurant Portal
  RESTAURANT_READ = 'restaurant:read',
  RESTAURANT_WRITE = 'restaurant:write',
  MENU_MANAGE = 'menu:manage',
  KITCHEN_ORDERS_VIEW = 'kitchen:orders_view',
  KITCHEN_ORDERS_UPDATE = 'kitchen:orders_update',
  INVENTORY_MANAGE = 'inventory:manage',

  // Order Operations
  ORDER_READ = 'order:read',
  ORDER_WRITE = 'order:write',
  ORDER_CANCEL = 'order:cancel',

  // Rider Operations
  RIDER_READ = 'rider:read',
  RIDER_WRITE = 'rider:write',
  RIDER_LOCATION_UPDATE = 'rider:location_update',

  // Admin & Financial
  ADMIN_ACCESS = 'admin:access',
  FINANCE_ACCESS = 'finance:access',
  SUPPORT_ACCESS = 'support:access',
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.CUSTOMER]: [
    Permission.AUTH_READ,
    Permission.AUTH_WRITE,
    Permission.USER_READ,
    Permission.USER_WRITE,
    Permission.ORDER_READ,
    Permission.ORDER_WRITE,
    Permission.ORDER_CANCEL,
  ],
  [UserRole.RESTAURANT_OWNER]: [
    Permission.AUTH_READ,
    Permission.AUTH_WRITE,
    Permission.USER_READ,
    Permission.USER_WRITE,
    Permission.RESTAURANT_READ,
    Permission.RESTAURANT_WRITE,
    Permission.MENU_MANAGE,
    Permission.KITCHEN_ORDERS_VIEW,
    Permission.KITCHEN_ORDERS_UPDATE,
    Permission.INVENTORY_MANAGE,
    Permission.ORDER_READ,
    Permission.ORDER_WRITE,
    Permission.FINANCE_ACCESS,
  ],
  [UserRole.RESTAURANT_MANAGER]: [
    Permission.RESTAURANT_READ,
    Permission.MENU_MANAGE,
    Permission.KITCHEN_ORDERS_VIEW,
    Permission.KITCHEN_ORDERS_UPDATE,
    Permission.INVENTORY_MANAGE,
    Permission.ORDER_READ,
  ],
  [UserRole.KITCHEN_STAFF]: [
    Permission.KITCHEN_ORDERS_VIEW,
    Permission.KITCHEN_ORDERS_UPDATE,
  ],
  [UserRole.CASHIER]: [
    Permission.KITCHEN_ORDERS_VIEW,
    Permission.KITCHEN_ORDERS_UPDATE,
    Permission.ORDER_READ,
  ],
  [UserRole.INVENTORY_MANAGER]: [
    Permission.INVENTORY_MANAGE,
    Permission.MENU_MANAGE,
  ],
  [UserRole.RIDER]: [
    Permission.AUTH_READ,
    Permission.AUTH_WRITE,
    Permission.USER_READ,
    Permission.RIDER_READ,
    Permission.RIDER_WRITE,
    Permission.RIDER_LOCATION_UPDATE,
    Permission.ORDER_READ,
  ],
  [UserRole.ADMIN]: [
    Permission.AUTH_READ,
    Permission.AUTH_WRITE,
    Permission.USER_READ,
    Permission.USER_WRITE,
    Permission.RESTAURANT_READ,
    Permission.RESTAURANT_WRITE,
    Permission.RIDER_READ,
    Permission.RIDER_WRITE,
    Permission.ADMIN_ACCESS,
    Permission.SUPPORT_ACCESS,
  ],
  [UserRole.SUPER_ADMIN]: Object.values(Permission),
  [UserRole.SUPPORT]: [
    Permission.SUPPORT_ACCESS,
    Permission.USER_READ,
    Permission.ORDER_READ,
  ],
  [UserRole.FINANCE]: [
    Permission.FINANCE_ACCESS,
    Permission.ORDER_READ,
  ],
};
