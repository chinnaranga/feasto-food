import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  OnboardingStep,
  RiderRegistrationData,
  IdentityDocument,
  DrivingLicenseDocument,
  VehicleVerificationData,
  AccountReviewStatus,
  RiderAuthSession,
} from '../types/auth';

interface RiderAuthState {
  currentStep: OnboardingStep;
  language: string;
  phone: string;
  isOtpSent: boolean;
  otpCode: string;
  isOtpVerified: boolean;
  isEmailVerified: boolean;

  registrationData: RiderRegistrationData;
  identityDoc: IdentityDocument;
  licenseDoc: DrivingLicenseDocument;
  vehicleData: VehicleVerificationData;

  reviewStatus: AccountReviewStatus;
  sessions: RiderAuthSession[];

  isAuthenticated: boolean;

  // Actions
  login: (credentials: { phone: string; password?: string }) => boolean;
  loginWithOtp: (phone: string, otp: string) => boolean;
  logoutRider: () => void;
  setCurrentStep: (step: OnboardingStep) => void;
  setLanguage: (lang: string) => void;
  setPhone: (phone: string) => void;
  setOtpCode: (code: string) => void;

  verifyOtp: () => boolean;
  verifyEmail: () => void;

  updateRegistrationData: (data: Partial<RiderRegistrationData>) => void;
  updateIdentityDoc: (doc: Partial<IdentityDocument>) => void;
  updateLicenseDoc: (doc: Partial<DrivingLicenseDocument>) => void;
  updateVehicleData: (vehicle: Partial<VehicleVerificationData>) => void;

  submitForAccountReview: () => void;
  revokeSession: (sessionId: string) => void;
  resetOnboarding: () => void;
}

const INITIAL_REGISTRATION: RiderRegistrationData = {
  fullName: 'Arjun Kumar',
  phone: '+91 98765 43210',
  email: 'arjun.rider@feasto.food',
  dateOfBirth: '1998-06-15',
  gender: 'male',
  emergencyContactName: 'Rajesh Kumar',
  emergencyContactPhone: '+91 98200 11223',
  streetAddress: 'Flat 402, Waterfield Road, Bandra West',
  city: 'Mumbai',
  state: 'Maharashtra',
  postalCode: '400050',
};

const INITIAL_IDENTITY: IdentityDocument = {
  id: 'doc-aadhaar-1',
  docType: 'aadhaar',
  docNumber: '5849 2014 9920',
  status: 'approved',
};

const INITIAL_LICENSE: DrivingLicenseDocument = {
  licenseNumber: 'MH02 20180094820',
  expiryDate: '2032-09-20',
  status: 'approved',
};

const INITIAL_VEHICLE: VehicleVerificationData = {
  vehicleType: 'scooter_ev',
  brandModel: 'Ather 450X Apex',
  plateNumber: 'MH 02 EV 4821',
  rcNumber: 'RC-MH02-2023-88492',
  insurancePolicyNumber: 'INS-POL-992014',
  insuranceExpiryDate: '2026-11-30',
  status: 'approved',
};

const INITIAL_REVIEW_STATUS: AccountReviewStatus = {
  step: 'review',
  overallReadinessPct: 100,
  isPhoneVerified: true,
  isEmailVerified: true,
  isIdentityVerified: true,
  isLicenseVerified: true,
  isVehicleVerified: true,
  isBackgroundCheckApproved: true,
  estimatedApprovalHours: 2,
  reviewerNotes: 'All identity papers verified. Approved for delivery duty.',
};

export const useRiderAuthStore = create<RiderAuthState>()(
  persist(
    (set, get) => ({
      currentStep: 'welcome',
      language: 'English',
      phone: '+91 98765 43210',
      isOtpSent: false,
      otpCode: '',
      isOtpVerified: true,
      isEmailVerified: true,

      registrationData: INITIAL_REGISTRATION,
      identityDoc: INITIAL_IDENTITY,
      licenseDoc: INITIAL_LICENSE,
      vehicleData: INITIAL_VEHICLE,
      reviewStatus: INITIAL_REVIEW_STATUS,
      sessions: [
        {
          sessionId: 'sess-1',
          deviceName: 'iPhone 15 Pro (Current Device)',
          ipAddress: '103.21.124.5',
          lastActive: 'Just now',
          isTrustedDevice: true,
          locationCity: 'Mumbai, IN',
        },
      ],
      isAuthenticated: true,

      login: ({ phone, password }) => {
        set({
          isAuthenticated: true,
          phone: phone || '+91 98765 43210',
          isOtpVerified: true,
          currentStep: 'approved',
        });
        return true;
      },

      loginWithOtp: (phone, otp) => {
        set({
          isAuthenticated: true,
          phone: phone || '+91 98765 43210',
          otpCode: otp,
          isOtpVerified: true,
          currentStep: 'approved',
        });
        return true;
      },

      logoutRider: () => {
        set({
          isAuthenticated: false,
        });
      },

      setCurrentStep: (currentStep) => set({ currentStep }),
      setLanguage: (language) => set({ language }),
      setPhone: (phone) => set({ phone, isOtpSent: true }),
      setOtpCode: (otpCode) => set({ otpCode }),

      verifyOtp: () => {
        set({ isOtpVerified: true });
        return true;
      },

      verifyEmail: () => set({ isEmailVerified: true }),

      updateRegistrationData: (data) =>
        set((state) => ({
          registrationData: { ...state.registrationData, ...data },
        })),

      updateIdentityDoc: (doc) =>
        set((state) => ({
          identityDoc: { ...state.identityDoc, ...doc, status: 'submitted' },
        })),

      updateLicenseDoc: (doc) =>
        set((state) => ({
          licenseDoc: { ...state.licenseDoc, ...doc, status: 'submitted' },
        })),

      updateVehicleData: (vehicle) =>
        set((state) => ({
          vehicleData: { ...state.vehicleData, ...vehicle, status: 'submitted' },
        })),

      submitForAccountReview: () =>
        set((state) => ({
          currentStep: 'review',
          reviewStatus: {
            ...state.reviewStatus,
            overallReadinessPct: 100,
            estimatedApprovalHours: 2,
          },
        })),

      revokeSession: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.sessionId !== sessionId),
        })),

      resetOnboarding: () =>
        set({
          currentStep: 'welcome',
          isOtpVerified: false,
          isEmailVerified: false,
        }),
    }),
    {
      name: 'feasto-rider-auth-store-d2',
    }
  )
);

export default useRiderAuthStore;
