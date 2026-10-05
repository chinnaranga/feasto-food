import { UserRole } from '../../shared/constants/roles.js';
import { AccountStatus } from './user.model.js';
import { FavoriteEntityType } from './models/favorite.model.js';

export interface UpdateProfileDTO {
  name?: string;
  phone?: string;
  profilePhoto?: string;
  preferredLanguage?: string;
  preferredCurrency?: string;
  timezone?: string;
  bio?: string;
}

export interface CreateAddressDTO {
  label: string;
  street: string;
  building?: string;
  floor?: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
  deliveryInstructions?: string;
}

export interface UpdateAddressDTO extends Partial<CreateAddressDTO> {}

export interface AddFavoriteDTO {
  entityType: FavoriteEntityType;
  entityId: string;
  metadata?: {
    name?: string;
    image?: string;
    price?: number;
    rating?: number;
    cuisine?: string;
  };
}

export interface UpdatePreferencesDTO {
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
    marketing?: boolean;
  };
  privacy?: {
    showProfilePhoto?: boolean;
    allowDataAnalytics?: boolean;
  };
  accessibility?: {
    highContrast?: boolean;
    screenReader?: boolean;
  };
  dietary?: string[];
}

export interface UserSummaryResponse {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  accountStatus: AccountStatus;
  verificationStatus: {
    emailVerified: boolean;
    phoneVerified: boolean;
  };
  profileCompleteness: number;
  healthStatus: 'excellent' | 'good' | 'action_required';
  stats: {
    activeSessionsCount: number;
    savedAddressesCount: number;
    favoritesCount: number;
    trustedDevicesCount: number;
  };
  missingProfileFields: string[];
  lastLoginAt?: Date;
  createdAt: Date;
}
