export type MerchantRole = 'Owner' | 'Manager' | 'Staff' | 'Finance' | 'Kitchen' | 'Cashier';

export interface MerchantUser {
  uid: string;
  email: string;
  displayName?: string;
  role: MerchantRole;
  permissions: string[];
}

export interface RestaurantContext {
  id: string;
  name: string;
  branchCode: string;
  status: 'active' | 'suspended' | 'pending';
}

export interface NavigationNode {
  label: string;
  path: string;
  iconName: string;
  roles: MerchantRole[];
}
