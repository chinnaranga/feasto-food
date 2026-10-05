import { UserRole } from '../../shared/constants/roles.js';
import { AccountStatus } from '../users/user.model.js';
import { Permission } from '../../shared/constants/permissions.js';

export interface RegisterDTO {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: UserRole;
  preferredLanguage?: string;
}

export interface LoginDTO {
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
}

export interface GoogleAuthDTO {
  email: string;
  name: string;
  googleId: string;
  photoUrl?: string;
}

export interface VerifyEmailDTO {
  email: string;
  token: string;
}

export interface VerifyOtpDTO {
  target: string;
  code: string;
  type: 'email_verification' | 'phone_verification' | 'password_reset' | 'login_otp';
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  target: string;
  code: string;
  newPassword: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface ClientMetadata {
  ipAddress: string;
  userAgent: string;
  deviceName?: string;
  browser?: string;
}

export interface SafeUserResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  permissions: Permission[];
  accountStatus: AccountStatus;
  verificationStatus: {
    emailVerified: boolean;
    phoneVerified: boolean;
  };
  lastLoginAt?: Date;
  profilePhoto?: string;
  preferredLanguage: string;
  createdAt: Date;
}

export interface AuthSuccessResponse {
  user: SafeUserResponse;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
  session: {
    sessionId: string;
    expiresAt: Date;
  };
}

export interface SessionInfo {
  sessionId: string;
  deviceName: string;
  browser: string;
  ipAddress?: string;
  lastActiveAt: Date;
  createdAt: Date;
  isCurrentSession: boolean;
}
