export const ADMIN_ROLES = [
  'super_admin',
  'admin',
  'operations_admin',
  'restaurant_admin',
  'rider_operations',
  'finance_admin',
  'support_admin',
  'compliance_admin',
  'analyst',
] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const VERIFICATION_STATUSES = [
  'PENDING',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'SUSPENDED',
] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export const SETTING_CATEGORIES = [
  'ORDER',
  'DELIVERY',
  'DISPATCH',
  'PAYMENT',
  'RESTAURANT',
  'RIDER',
  'NOTIFICATION',
  'SECURITY',
] as const;
export type SettingCategory = (typeof SETTING_CATEGORIES)[number];
