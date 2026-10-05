import { AdminRole, VerificationStatus, SettingCategory } from './admin.constants.js';

export interface IAdminAuditLog {
  _id?: any;
  auditId: string;
  actorUserId: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  previousState?: Record<string, any>;
  newState?: Record<string, any>;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  createdAt?: Date;
}

export interface IAdminSetting {
  _id?: any;
  settingId: string;
  category: SettingCategory;
  key: string;
  value: any;
  description?: string;
  updatedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAdminStaffAccess {
  _id?: any;
  accessId: string;
  userId: string;
  role: AdminRole;
  permissions: string[];
  isSuspended: boolean;
  grantedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IVerificationReview {
  _id?: any;
  verificationId: string;
  targetType: 'restaurant' | 'rider' | 'document' | 'account';
  targetId: string;
  status: VerificationStatus;
  reviewerId?: string;
  reason?: string;
  previousStatus?: string;
  newStatus?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAdminOverview {
  activeOrdersCount: number;
  pendingRestaurantOrdersCount: number;
  activeDeliveriesCount: number;
  onlineRidersCount: number;
  onlineRestaurantsCount: number;
  pendingVerificationsCount: number;
  failedPaymentsCount: number;
  failedDispatchesCount: number;
  unresolvedOperationalIssuesCount: number;
}
