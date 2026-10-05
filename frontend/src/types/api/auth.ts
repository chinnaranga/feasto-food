/**
 * F1 — Auth API Types
 * Aligned exactly with backend SafeUserResponse and AuthSuccessResponse.
 */

export type UserRole =
  | 'customer'
  | 'restaurant_owner'
  | 'restaurant_manager'
  | 'kitchen_staff'
  | 'rider'
  | 'rider_operations'
  | 'finance_admin'
  | 'support_admin'
  | 'compliance_admin'
  | 'admin'
  | 'super_admin';

export type AccountStatus = 'active' | 'suspended' | 'banned' | 'pending_verification' | 'deactivated';

export interface VerificationStatus {
  emailVerified: boolean;
  phoneVerified: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  permissions: string[];
  accountStatus: AccountStatus;
  verificationStatus: VerificationStatus;
  lastLoginAt?: string;
  profilePhoto?: string;
  preferredLanguage: string;
  createdAt: string;
  uid?: string;
  displayName?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface AuthSession {
  sessionId: string;
  expiresAt: string;
}

export interface AuthSuccessResponse {
  user: AuthUser;
  tokens: AuthTokens;
  session: AuthSession;
}

// Alias used by some services
export type LoginResponse = AuthSuccessResponse;

export interface LoginRequest {
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: UserRole;
  preferredLanguage?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  target: string;       // email or phone
  code: string;         // 6-digit OTP
  newPassword: string;
}

export interface VerifyOtpRequest {
  target: string;
  code: string;
  type: 'email_verification' | 'phone_verification' | 'password_reset' | 'login_otp';
}

export interface RegisterPayload extends RegisterRequest {}

export interface SessionInfo {
  sessionId: string;
  deviceName: string;
  browser: string;
  ipAddress?: string;
  lastActiveAt: string;
  createdAt: string;
  isCurrentSession: boolean;
}
