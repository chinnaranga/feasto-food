import type {
  RiderPersonalInfo,
  RiderVehicleSetup,
  RiderAvailabilitySetup,
  RiderServiceArea,
  RiderDeliveryPreferences,
  RiderPayoutSetup,
} from '../types/profile';

export const riderProfileServices = {
  async fetchProfile(): Promise<Partial<RiderPersonalInfo>> {
    return {
      fullName: 'Arjun Kumar',
      riderCode: 'RDR-8802',
    };
  },

  async updatePersonalInfo(data: Partial<RiderPersonalInfo>): Promise<{ success: boolean }> {
    return { success: true };
  },

  async updateVehicleInfo(data: Partial<RiderVehicleSetup>): Promise<{ success: boolean }> {
    return { success: true };
  },

  async updateAvailability(data: Partial<RiderAvailabilitySetup>): Promise<{ success: boolean }> {
    return { success: true };
  },

  async updateServiceArea(data: Partial<RiderServiceArea>): Promise<{ success: boolean }> {
    return { success: true };
  },

  async updateDeliveryPreferences(data: Partial<RiderDeliveryPreferences>): Promise<{ success: boolean }> {
    return { success: true };
  },

  async updatePayoutInfo(data: Partial<RiderPayoutSetup>): Promise<{ success: boolean }> {
    return { success: true };
  },

  getFirestoreRiderConfig() {
    return {
      firestoreRiderCollection: 'rider_profiles',
      documentStorageBucket: 'gs://feasto-rider-documents',
      payoutKycValidationRule: 'ENFORCE_PAN_AADHAAR',
    };
  },
};

export default riderProfileServices;
