import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  RiderPersonalInfo,
  RiderVehicleSetup,
  RiderDocumentAuditItem,
  RiderAvailabilitySetup,
  RiderServiceArea,
  RiderDeliveryPreferences,
  RiderPayoutSetup,
  RiderOperationalReadiness,
} from '../types/profile';

interface RiderProfileState {
  personalInfo: RiderPersonalInfo;
  vehicle: RiderVehicleSetup;
  documents: RiderDocumentAuditItem[];
  availability: RiderAvailabilitySetup;
  serviceArea: RiderServiceArea;
  deliveryPreferences: RiderDeliveryPreferences;
  payout: RiderPayoutSetup;
  readiness: RiderOperationalReadiness;
  hasUnsavedChanges: boolean;

  // Actions
  updatePersonalInfo: (data: Partial<RiderPersonalInfo>) => void;
  updateVehicle: (data: Partial<RiderVehicleSetup>) => void;
  updateDocumentStatus: (id: string, status: RiderDocumentAuditItem['status']) => void;
  updateAvailability: (data: Partial<RiderAvailabilitySetup>) => void;
  toggleBreakMode: () => void;
  updateServiceArea: (data: Partial<RiderServiceArea>) => void;
  updateDeliveryPreferences: (data: Partial<RiderDeliveryPreferences>) => void;
  updatePayout: (data: Partial<RiderPayoutSetup>) => void;

  saveChanges: () => void;
  recalculateReadinessScore: () => void;
}

const INITIAL_PERSONAL_INFO: RiderPersonalInfo = {
  fullName: 'Arjun Kumar',
  riderCode: 'RDR-8802',
  phone: '+91 98765 43210',
  email: 'arjun.rider@feasto.food',
  dateOfBirth: '1998-06-15',
  gender: 'male',
  emergencyContactName: 'Rajesh Kumar',
  emergencyContactRelationship: 'Father',
  emergencyContactPhone: '+91 98200 11223',
  streetAddress: 'Flat 402, Waterfield Road, Bandra West',
  city: 'Mumbai',
  state: 'Maharashtra',
  postalCode: '400050',
  preferredLanguage: 'English',
  communicationChannels: ['sms', 'push', 'whatsapp'],
};

const INITIAL_VEHICLE: RiderVehicleSetup = {
  vehicleType: 'scooter_ev',
  brandModel: 'Ather 450X Apex',
  vehicleColor: 'Stealth Black',
  plateNumber: 'MH 02 EV 4821',
  rcNumber: 'RC-MH02-2023-88492',
  fuelType: 'ev_battery',
  insurancePolicyNumber: 'INS-POL-992014',
  insuranceExpiryDate: '2026-11-30',
  rcExpiryDate: '2038-05-15',
  isRcVerified: true,
  isInsuranceVerified: true,
};

const INITIAL_DOCUMENTS: RiderDocumentAuditItem[] = [
  {
    id: 'doc-dl',
    docType: 'license',
    title: 'Driving License (Commercial)',
    docNumber: 'MH02 20180094820',
    expiryDate: '2032-09-20',
    status: 'approved',
    lastUpdated: '2026-01-10',
    isMandatory: true,
  },
  {
    id: 'doc-aadhaar',
    docType: 'aadhaar',
    title: 'Aadhaar Government Identity',
    docNumber: '5849 2014 9920',
    status: 'approved',
    lastUpdated: '2026-01-10',
    isMandatory: true,
  },
  {
    id: 'doc-pan',
    docType: 'pan',
    title: 'PAN Card (Tax Identification)',
    docNumber: 'ABCDE1234F',
    status: 'approved',
    lastUpdated: '2026-01-10',
    isMandatory: true,
  },
  {
    id: 'doc-rc',
    docType: 'rc',
    title: 'Vehicle Registration Certificate (RC)',
    docNumber: 'RC-MH02-2023-88492',
    expiryDate: '2038-05-15',
    status: 'approved',
    lastUpdated: '2026-01-12',
    isMandatory: true,
  },
  {
    id: 'doc-ins',
    docType: 'insurance',
    title: 'Commercial Third-Party Insurance',
    docNumber: 'INS-POL-992014',
    expiryDate: '2026-11-30',
    status: 'approved',
    lastUpdated: '2026-01-12',
    isMandatory: true,
  },
];

const INITIAL_AVAILABILITY: RiderAvailabilitySetup = {
  isDutyOnline: true,
  isBreakModeActive: false,
  defaultShiftWindow: 'evening',
  weekdaySlots: ['12:00 - 16:00', '18:00 - 23:00'],
  weekendSlots: ['11:00 - 23:00'],
  holidayAvailability: true,
  weeklyTargetHours: 35,
};

const INITIAL_SERVICE_AREA: RiderServiceArea = {
  primaryZone: 'Bandra West & Khar Zone',
  secondaryZones: ['Juhu & Vile Parle', 'Santacruz West'],
  preferNearHome: true,
  maxDeliveryRadiusKm: 8,
};

const INITIAL_DELIVERY_PREFERENCES: RiderDeliveryPreferences = {
  acceptFoodDelivery: true,
  acceptPickupHandoff: true,
  acceptPriorityOrders: true,
  acceptScheduledOrders: true,
  acceptLargeOrders: false,
  contactPreference: 'call_and_sms',
};

const INITIAL_PAYOUT: RiderPayoutSetup = {
  bankName: 'HDFC Bank',
  accountNumber: '••••••••4821',
  ifscCode: 'HDFC0000182',
  accountHolderName: 'Arjun Kumar',
  upiId: 'arjun@okhdfcbank',
  kycStatus: 'verified',
  taxStatus: 'compliant',
};

const INITIAL_READINESS: RiderOperationalReadiness = {
  overallScorePct: 100,
  profileCompletenessScorePct: 100,
  vehicleReadinessScorePct: 100,
  documentStatusScorePct: 100,
  availabilityScorePct: 100,
  payoutReadinessScorePct: 100,
  missingInfoFields: [],
};

export const useRiderProfileStore = create<RiderProfileState>()(
  persist(
    (set, get) => ({
      personalInfo: INITIAL_PERSONAL_INFO,
      vehicle: INITIAL_VEHICLE,
      documents: INITIAL_DOCUMENTS,
      availability: INITIAL_AVAILABILITY,
      serviceArea: INITIAL_SERVICE_AREA,
      deliveryPreferences: INITIAL_DELIVERY_PREFERENCES,
      payout: INITIAL_PAYOUT,
      readiness: INITIAL_READINESS,
      hasUnsavedChanges: false,

      updatePersonalInfo: (data) =>
        set((state) => ({
          personalInfo: { ...state.personalInfo, ...data },
          hasUnsavedChanges: true,
        })),

      updateVehicle: (data) =>
        set((state) => ({
          vehicle: { ...state.vehicle, ...data },
          hasUnsavedChanges: true,
        })),

      updateDocumentStatus: (id, status) =>
        set((state) => ({
          documents: state.documents.map((d) => (d.id === id ? { ...d, status } : d)),
          hasUnsavedChanges: true,
        })),

      updateAvailability: (data) =>
        set((state) => ({
          availability: { ...state.availability, ...data },
          hasUnsavedChanges: true,
        })),

      toggleBreakMode: () =>
        set((state) => ({
          availability: {
            ...state.availability,
            isBreakModeActive: !state.availability.isBreakModeActive,
          },
        })),

      updateServiceArea: (data) =>
        set((state) => ({
          serviceArea: { ...state.serviceArea, ...data },
          hasUnsavedChanges: true,
        })),

      updateDeliveryPreferences: (data) =>
        set((state) => ({
          deliveryPreferences: { ...state.deliveryPreferences, ...data },
          hasUnsavedChanges: true,
        })),

      updatePayout: (data) =>
        set((state) => ({
          payout: { ...state.payout, ...data },
          hasUnsavedChanges: true,
        })),

      saveChanges: () => {
        set({ hasUnsavedChanges: false });
        get().recalculateReadinessScore();
      },

      recalculateReadinessScore: () =>
        set((state) => {
          // Compute score percentages
          const hasMissingPersonalInfo = !state.personalInfo.fullName || !state.personalInfo.emergencyContactPhone;
          const hasMissingVehicle = !state.vehicle.plateNumber || !state.vehicle.brandModel;
          const unapprovedDocs = state.documents.filter((d) => d.status !== 'approved');

          const profileScore = hasMissingPersonalInfo ? 70 : 100;
          const vehicleScore = hasMissingVehicle ? 80 : 100;
          const docScore = unapprovedDocs.length === 0 ? 100 : Math.max(50, 100 - unapprovedDocs.length * 20);
          const availScore = state.availability.weekdaySlots.length > 0 ? 100 : 60;
          const payoutScore = state.payout.kycStatus === 'verified' ? 100 : 70;

          const overall = Math.round((profileScore + vehicleScore + docScore + availScore + payoutScore) / 5);

          return {
            readiness: {
              overallScorePct: overall,
              profileCompletenessScorePct: profileScore,
              vehicleReadinessScorePct: vehicleScore,
              documentStatusScorePct: docScore,
              availabilityScorePct: availScore,
              payoutReadinessScorePct: payoutScore,
              missingInfoFields: unapprovedDocs.map((d) => d.title),
            },
          };
        }),
    }),
    {
      name: 'feasto-rider-profile-store-d3',
    }
  )
);

export default useRiderProfileStore;
