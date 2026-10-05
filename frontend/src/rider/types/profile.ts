// ─── Stage D3 Rider Profile, Vehicle & Operational Setup Types ────────────────

export interface RiderPersonalInfo {
  fullName: string;
  riderCode: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  preferredLanguage: string;
  communicationChannels: ('sms' | 'email' | 'push' | 'whatsapp')[];
}

export interface RiderVehicleSetup {
  vehicleType: 'scooter_ev' | 'motorbike' | 'bicycle' | 'car';
  brandModel: string;
  vehicleColor: string;
  plateNumber: string;
  rcNumber: string;
  fuelType: 'ev_battery' | 'petrol' | 'diesel' | 'manual';
  insurancePolicyNumber: string;
  insuranceExpiryDate: string;
  rcExpiryDate: string;
  isRcVerified: boolean;
  isInsuranceVerified: boolean;
}

export interface RiderDocumentAuditItem {
  id: string;
  docType: 'license' | 'aadhaar' | 'pan' | 'rc' | 'insurance' | 'tax_id';
  title: string;
  docNumber: string;
  expiryDate?: string;
  status: 'approved' | 'under_review' | 'submitted' | 'action_needed' | 'expired';
  lastUpdated: string;
  isMandatory: boolean;
}

export interface RiderAvailabilitySetup {
  isDutyOnline: boolean;
  isBreakModeActive: boolean;
  defaultShiftWindow: 'morning' | 'afternoon' | 'evening' | 'night' | 'flexible';
  weekdaySlots: string[];
  weekendSlots: string[];
  holidayAvailability: boolean;
  weeklyTargetHours: number;
}

export interface RiderServiceArea {
  primaryZone: string;
  secondaryZones: string[];
  preferNearHome: boolean;
  maxDeliveryRadiusKm: number;
}

export interface RiderDeliveryPreferences {
  acceptFoodDelivery: boolean;
  acceptPickupHandoff: boolean;
  acceptPriorityOrders: boolean;
  acceptScheduledOrders: boolean;
  acceptLargeOrders: boolean;
  contactPreference: 'call_and_sms' | 'in_app_chat' | 'sms_only';
}

export interface RiderPayoutSetup {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  upiId: string;
  kycStatus: 'verified' | 'pending' | 'action_needed';
  taxStatus: 'compliant' | 'pending';
}

export interface RiderOperationalReadiness {
  overallScorePct: number;
  profileCompletenessScorePct: number;
  vehicleReadinessScorePct: number;
  documentStatusScorePct: number;
  availabilityScorePct: number;
  payoutReadinessScorePct: number;
  missingInfoFields: string[];
}

export interface SmartAIRiderProfileInsight {
  profileCompletenessScore: number;
  vehicleReadinessWarning?: string;
  documentExpiryPrediction?: string;
  zoneOptimizationSuggestion?: string;
}
