import type { RiderRegistrationData, IdentityDocument, VehicleVerificationData } from '../types/auth';

export const riderAuthServices = {
  // Phone OTP Authentication
  async sendPhoneOtp(phone: string): Promise<{ success: boolean; sessionInfo: string }> {
    return { success: true, sessionInfo: `otp_sess_${Date.now()}` };
  },

  async verifyPhoneOtp(sessionInfo: string, otpCode: string): Promise<{ success: boolean; riderToken: string }> {
    return { success: true, riderToken: `rdr_token_${Date.now()}` };
  },

  // Email Verification
  async sendEmailVerificationLink(email: string): Promise<{ success: boolean }> {
    return { success: true };
  },

  // Identity & Document Upload (Firebase Storage Preparation)
  async uploadGovIdentityDocument(docData: Partial<IdentityDocument>): Promise<{ success: boolean; docId: string }> {
    return { success: true, docId: `doc_${Date.now()}` };
  },

  async uploadVehicleCertificate(vehicleData: Partial<VehicleVerificationData>): Promise<{ success: boolean }> {
    return { success: true };
  },

  // Firebase Integration Configuration Readiness
  getFirebaseAuthConfig() {
    return {
      provider: 'Phone & Custom Auth',
      recaptchaVerifier: 'invisible',
      tokenPersist: 'LOCAL_STORAGE',
      firestoreRiderCollection: 'rider_partners',
      storageBucketPath: 'gs://feasto-rider-documents',
    };
  },
};

export default riderAuthServices;
