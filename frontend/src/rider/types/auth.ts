// ─── Stage D2 Rider Authentication & Identity Verification Types ──────────────

export type VerificationStatus = 'pending' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'expired';

export type OnboardingStep =
  | 'welcome'
  | 'register'
  | 'otp'
  | 'email_verify'
  | 'identity'
  | 'documents'
  | 'vehicle'
  | 'review'
  | 'approved';

export interface RiderRegistrationData {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  emergencyContactName: string;
  emergencyContactPhone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface IdentityDocument {
  id: string;
  docType: 'aadhaar' | 'pan' | 'tax_id' | 'passport';
  docNumber: string;
  frontImageUrl?: string;
  backImageUrl?: string;
  status: VerificationStatus;
  rejectionReason?: string;
}

export interface DrivingLicenseDocument {
  licenseNumber: string;
  expiryDate: string;
  frontImageUrl?: string;
  backImageUrl?: string;
  status: VerificationStatus;
}

export interface VehicleVerificationData {
  vehicleType: 'motorbike' | 'scooter_ev' | 'bicycle' | 'car';
  brandModel: string;
  plateNumber: string;
  rcNumber: string;
  insurancePolicyNumber: string;
  insuranceExpiryDate: string;
  rcDocumentUrl?: string;
  insuranceDocumentUrl?: string;
  status: VerificationStatus;
}

export interface AccountReviewStatus {
  step: OnboardingStep;
  overallReadinessPct: number;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isIdentityVerified: boolean;
  isLicenseVerified: boolean;
  isVehicleVerified: boolean;
  isBackgroundCheckApproved: boolean;
  estimatedApprovalHours: number;
  reviewerNotes?: string;
}

export interface RiderAuthSession {
  sessionId: string;
  deviceName: string;
  ipAddress: string;
  lastActive: string;
  isTrustedDevice: boolean;
  locationCity: string;
}

export interface SmartAIAuthInsight {
  fraudRiskScorePct: number; // 0 = Safe, 100 = High Risk
  duplicateCheckPassed: boolean;
  documentQualityScorePct: number;
  identityMatchScorePct: number;
  verificationCompletionEstimateMins: number;
}
