export enum UserRole {
  CUSTOMER = 'customer',
  RESTAURANT_OWNER = 'restaurant_owner',
  RESTAURANT_MANAGER = 'restaurant_manager',
  KITCHEN_STAFF = 'kitchen_staff',
  CASHIER = 'cashier',
  INVENTORY_MANAGER = 'inventory_manager',
  RIDER = 'rider',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  SUPPORT = 'support',
  FINANCE = 'finance',
}

export const ALL_ROLES = Object.values(UserRole);
