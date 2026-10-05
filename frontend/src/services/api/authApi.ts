import { apiClient } from './client';
import type {
  AuthUser,
  AuthSuccessResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  VerifyOtpRequest,
  SessionInfo,
} from '@/types/api/auth';

export const authApi = {
  /**
   * Register a new user account.
   * POST /auth/register
   */
  register(payload: RegisterRequest): Promise<AuthSuccessResponse> {
    return apiClient.post<AuthSuccessResponse>('/auth/register', payload, { skipAuth: true });
  },

  /**
   * Login with email/password or phone/OTP.
   * POST /auth/login
   */
  login(payload: LoginRequest): Promise<AuthSuccessResponse> {
    return apiClient.post<AuthSuccessResponse>('/auth/login', payload, { skipAuth: true });
  },

  /**
   * Refresh access token using refresh token from body.
   * POST /auth/refresh
   * NOTE: refreshToken is body-based (not HTTP-only cookie).
   */
  refresh(refreshToken: string): Promise<AuthSuccessResponse> {
    return apiClient.post<AuthSuccessResponse>('/auth/refresh', { refreshToken }, { skipAuth: true });
  },

  /**
   * Logout current session.
   * POST /auth/logout
   * Sends sessionId in body so backend can invalidate the specific session.
   */
  logout(sessionId?: string): Promise<void> {
    return apiClient.post<void>('/auth/logout', sessionId ? { sessionId } : {});
  },

  /**
   * Get current authenticated user profile.
   * GET /auth/me
   */
  getCurrentUser(): Promise<AuthUser> {
    return apiClient.get<AuthUser>('/auth/me');
  },

  /**
   * Request password reset OTP to be sent to email.
   * POST /auth/forgot-password
   */
  forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return apiClient.post<ForgotPasswordResponse>('/auth/forgot-password', { email } as ForgotPasswordRequest, { skipAuth: true });
  },

  /**
   * Reset password using OTP received via email.
   * POST /auth/reset-password
   */
  resetPassword(payload: ResetPasswordRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/reset-password', payload, { skipAuth: true });
  },

  /**
   * Verify OTP for email/phone verification or password reset.
   * POST /auth/verify-otp
   */
  verifyOtp(payload: VerifyOtpRequest): Promise<AuthSuccessResponse | { message: string }> {
    return apiClient.post<AuthSuccessResponse | { message: string }>('/auth/verify-otp', payload, { skipAuth: true });
  },

  /**
   * Resend email verification code.
   * POST /auth/resend-verification
   */
  resendVerification(email: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/resend-verification', { email }, { skipAuth: true });
  },

  /**
   * Get all active sessions for the current user.
   * GET /auth/sessions
   */
  getSessions(): Promise<SessionInfo[]> {
    return apiClient.get<SessionInfo[]>('/auth/sessions');
  },

  /**
   * Revoke a specific session.
   * DELETE /auth/sessions/:sessionId
   */
  revokeSession(sessionId: string): Promise<void> {
    return apiClient.delete<void>(`/auth/sessions/${sessionId}`);
  },
};
