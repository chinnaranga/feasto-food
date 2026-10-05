import { VerificationStatus, OperationalStatus, AccountStatus } from './restaurants.model.js';
import { BranchStatus } from './models/restaurantBranch.model.js';
import { IDailySchedule, IHolidaySchedule } from './models/restaurantHours.model.js';
import { RestaurantStaffRole } from './models/restaurantStaffAccess.model.js';

export interface CreateRestaurantDTO {
  restaurantName: string;
  legalBusinessName: string;
  description?: string;
  cuisineTypes: string[];
  logoUrl?: string;
  coverImageUrl?: string;
  brandColor?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country?: string;
  timezone?: string;
  currency?: string;
  serviceModes?: {
    dineIn?: boolean;
    takeaway?: boolean;
    delivery?: boolean;
    pickup?: boolean;
  };
}

export interface UpdateRestaurantDTO extends Partial<CreateRestaurantDTO> {
  operationalStatus?: OperationalStatus;
  accountStatus?: AccountStatus;
}

export interface CreateBranchDTO {
  branchName: string;
  branchCode: string;
  branchManagerId?: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  isMainBranch?: boolean;
}

export interface UpdateBranchDTO extends Partial<CreateBranchDTO> {
  status?: BranchStatus;
}

export interface UpdateHoursDTO {
  openingHours?: IDailySchedule[];
  kitchenHours?: IDailySchedule[];
  deliveryHours?: IDailySchedule[];
  pickupHours?: IDailySchedule[];
  holidayHours?: IHolidaySchedule[];
}

export interface UpdateSettingsDTO {
  orderSettings?: {
    autoAcceptOrders?: boolean;
    prepTimeMinutes?: number;
    minOrderValue?: number;
  };
  notificationSettings?: {
    newOrderEmail?: boolean;
    newOrderPush?: boolean;
    newOrderSms?: boolean;
  };
  serviceToggles?: {
    allowDineIn?: boolean;
    allowTakeaway?: boolean;
    allowDelivery?: boolean;
    allowPickup?: boolean;
    pauseOrders?: boolean;
  };
}

export interface SubmitVerificationDTO {
  businessLicenseNumber: string;
  taxId: string;
  ownerIdentityDocumentUrl: string;
  proofOfAddressUrl: string;
}

export interface AddStaffAccessDTO {
  userId: string;
  branchId?: string;
  role: RestaurantStaffRole;
  assignedPermissions?: string[];
}

export interface UpdateStaffAccessDTO {
  branchId?: string;
  role?: RestaurantStaffRole;
  assignedPermissions?: string[];
  isActive?: boolean;
}

export interface RestaurantSummaryResponse {
  restaurantId: string;
  restaurantName: string;
  verificationStatus: VerificationStatus;
  accountStatus: AccountStatus;
  operationalStatus: OperationalStatus;
  profileCompleteness: number;
  readinessStatus: 'ready' | 'incomplete_setup' | 'pending_verification';
  stats: {
    totalBranchesCount: number;
    activeBranchesCount: number;
    activeStaffCount: number;
    prepTimeMinutes: number;
  };
  missingSetupItems: string[];
  createdAt: Date;
}
