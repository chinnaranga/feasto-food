import { IRestaurantDocument } from './restaurants.model.js';

export interface RestaurantCompletenessResult {
  score: number;
  missingItems: string[];
}

export const calculateRestaurantCompleteness = (
  restaurant: IRestaurantDocument,
  branchCount: number = 0,
  hasHoursConfigured: boolean = false,
  isVerificationSubmitted: boolean = false
): RestaurantCompletenessResult => {
  let score = 0;
  const missingItems: string[] = [];

  // Basic Profile (30%)
  if (restaurant.restaurantName && restaurant.legalBusinessName && restaurant.cuisineTypes?.length > 0) {
    score += 30;
  } else {
    missingItems.push('basic_profile_details');
  }

  // Contact Info & Address (20%)
  if (restaurant.email && restaurant.phone && restaurant.address && restaurant.city) {
    score += 20;
  } else {
    missingItems.push('contact_info_address');
  }

  // Branch Setup (20%)
  if (branchCount > 0) {
    score += 20;
  } else {
    missingItems.push('branch_setup');
  }

  // Operating Hours Configured (15%)
  if (hasHoursConfigured) {
    score += 15;
  } else {
    missingItems.push('operating_hours');
  }

  // Business Verification Submitted (15%)
  if (isVerificationSubmitted || restaurant.verificationStatus === 'verified' || restaurant.verificationStatus === 'pending_review') {
    score += 15;
  } else {
    missingItems.push('business_verification_documents');
  }

  return {
    score: Math.min(100, score),
    missingItems,
  };
};
