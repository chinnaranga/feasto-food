import { IUserDocument } from './user.model.js';

export interface ProfileCompletenessResult {
  score: number;
  missingFields: string[];
}

export const calculateProfileCompleteness = (
  user: IUserDocument,
  addressCount: number = 0,
  hasPreferences: boolean = false
): ProfileCompletenessResult => {
  let score = 0;
  const missingFields: string[] = [];

  // Name (20%)
  if (user.name && user.name.trim().length > 0) {
    score += 20;
  } else {
    missingFields.push('name');
  }

  // Verified Email (20%)
  if (user.verificationStatus?.emailVerified) {
    score += 20;
  } else {
    missingFields.push('email_verification');
  }

  // Verified Phone (15%)
  if (user.phone && user.verificationStatus?.phoneVerified) {
    score += 15;
  } else {
    missingFields.push('phone_verification');
  }

  // Profile Photo (15%)
  if (user.profilePhoto) {
    score += 15;
  } else {
    missingFields.push('profile_photo');
  }

  // Bio (10%)
  if (user.bio && user.bio.trim().length > 0) {
    score += 10;
  } else {
    missingFields.push('bio');
  }

  // Saved Delivery Address (10%)
  if (addressCount > 0) {
    score += 10;
  } else {
    missingFields.push('delivery_address');
  }

  // Configured Preferences (10%)
  if (hasPreferences) {
    score += 10;
  } else {
    missingFields.push('preferences');
  }

  return {
    score: Math.min(100, score),
    missingFields,
  };
};
