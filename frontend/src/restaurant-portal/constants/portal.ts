import { NavigationNode, RestaurantContext } from '../types/portal';

export const NAVIGATION_NODES: NavigationNode[] = [
  { label: 'Dashboard', path: '/restaurant-portal/dashboard', iconName: 'LayoutDashboard', roles: ['Owner', 'Manager', 'Staff', 'Finance', 'Kitchen', 'Cashier'] },
  { label: 'Orders', path: '/restaurant-portal/orders', iconName: 'ShoppingBag', roles: ['Owner', 'Manager', 'Staff', 'Kitchen', 'Cashier'] },
  { label: 'Menu Catalog', path: '/restaurant-portal/menu', iconName: 'Utensils', roles: ['Owner', 'Manager'] },
  { label: 'Inventory', path: '/restaurant-portal/inventory', iconName: 'Package', roles: ['Owner', 'Manager', 'Staff'] },
  { label: 'Staff Management', path: '/restaurant-portal/staff', iconName: 'Users', roles: ['Owner', 'Manager'] },
  { label: 'Analytics & Sales', path: '/restaurant-portal/analytics', iconName: 'BarChart2', roles: ['Owner', 'Manager', 'Finance'] },
  { label: 'Accounting & Finance', path: '/restaurant-portal/finance', iconName: 'Landmark', roles: ['Owner', 'Manager', 'Finance'] },
  { label: 'Promotions', path: '/restaurant-portal/promotions', iconName: 'Percent', roles: ['Owner', 'Manager'] },
  { label: 'Guest & CRM Directory', path: '/restaurant-portal/customers', iconName: 'MessageSquare', roles: ['Owner', 'Manager'] },
  { label: 'Restaurant Profile', path: '/restaurant-portal/profile', iconName: 'Building2', roles: ['Owner', 'Manager'] },
  { label: 'Settings', path: '/restaurant-portal/settings', iconName: 'Settings', roles: ['Owner', 'Manager', 'Finance'] },
];

export const MOCK_RESTAURANTS: RestaurantContext[] = [
  { id: 'sora-sushi', name: 'Sora Sushi Merchant', branchCode: 'SOR-DEL-01', status: 'active' },
  { id: 'artisan-table', name: 'Artisan Table Merchant', branchCode: 'ART-MUM-02', status: 'active' },
  { id: 'la-cucina', name: 'La Cucina Bistro', branchCode: 'LAC-BLR-03', status: 'pending' },
];
