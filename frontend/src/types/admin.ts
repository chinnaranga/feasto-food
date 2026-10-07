export type AdminRole =
  | 'super_admin'
  | 'admin'
  | 'restaurant_owner'
  | 'restaurant_manager'
  | 'support_lead'
  | 'support'
  | 'delivery_manager'
  | 'marketing'
  | 'finance'
  | 'analyst'
  | 'trust_safety_officer'
  | 'operations_lead'
  | 'auditor';

export type AdminPermission =
  | 'view_dashboard'
  | 'manage_restaurants'
  | 'manage_orders'
  | 'manage_users'
  | 'manage_delivery'
  | 'manage_support'
  | 'manage_trust_safety'
  | 'manage_flags'
  | 'view_audit_logs'
  | 'manage_marketing'
  | 'view_analytics'
  | 'manage_content'
  | 'manage_settings'
  | 'view_system_health';

export interface VerificationDoc {
  id: string;
  type: 'FSSAI License' | 'GST Registration' | 'Pan Card' | 'Bank Account Proof';
  documentNumber: string;
  fileUrl?: string;
  status: 'verified' | 'pending' | 'rejected';
}

export interface AdminRestaurant {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  cuisine: string;
  itemsCount: number;
  status: 'pending' | 'verified' | 'suspended';
  riskScore: number; // 0 to 100
  revenue: number;
  rating: number;
  joinedAt: string;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  restaurantName: string;
  total: number;
  status: 'placed' | 'preparing' | 'dispatched' | 'delivered' | 'cancelled';
  itemsCount: number;
  paymentMethod: string;
  placedAt: string;
  type: 'instant' | 'scheduled';
  fraudAlert: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'owner' | 'rider' | 'support' | 'admin';
  status: 'active' | 'suspended';
  joinedAt: string;
  ordersCount: number;
  spends: number;
}

export interface AdminDeliveryPartner {
  id: string;
  name: string;
  phone: string;
  zone: string;
  currentDeliveries: number;
  deliveriesCount: number;
  rating: number;
  status: 'active' | 'on_delivery' | 'offline';
  vehicleType?: string;
  totalDeliveries?: number;
  activeOrderId?: string;
  batteryLevel?: number;
  currentZone?: string;
  lastLocationUpdate?: string;
}

