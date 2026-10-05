import crypto from 'crypto';
import { Types } from 'mongoose';
import { authRepository, AuthRepository } from './auth.repository.js';
import {
  RegisterDTO,
  LoginDTO,
  GoogleAuthDTO,
  VerifyEmailDTO,
  VerifyOtpDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  ClientMetadata,
  AuthSuccessResponse,
  SafeUserResponse,
  SessionInfo,
} from './auth.types.js';
import { BadRequestError } from '../../shared/errors/BadRequestError.js';
import { UnauthorizedError } from '../../shared/errors/UnauthorizedError.js';
import { ForbiddenError } from '../../shared/errors/ForbiddenError.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { hashPassword, comparePassword } from '../../shared/utils/password.js';
import { generateAuthTokenPair, verifyRefreshToken } from '../../shared/utils/jwt.js';
import { generateNumericOTP, hashCode } from './auth.utils.js';
import { AUTH_CONSTANTS, AUTH_ERROR_CODES } from './auth.constants.js';
import { UserRole } from '../../shared/constants/roles.js';
import { ROLE_PERMISSIONS } from '../../shared/constants/permissions.js';
import { logger } from '../../shared/utils/logger.js';
import { IUserDocument } from '../users/user.model.js';

export class AuthService {
  constructor(private repo: AuthRepository = authRepository) {}

  private formatSafeUser(user: IUserDocument): SafeUserResponse {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      permissions: user.permissions || ROLE_PERMISSIONS[user.role] || [],
      accountStatus: user.accountStatus,
      verificationStatus: user.verificationStatus,
      lastLoginAt: user.lastLoginAt,
      profilePhoto: user.profilePhoto,
      preferredLanguage: user.preferredLanguage || 'en',
      createdAt: user.createdAt,
    };
  }

  async register(dto: RegisterDTO, clientMeta: ClientMetadata): Promise<{ user: SafeUserResponse; otpSent: boolean }> {
    const existingEmail = await this.repo.findUserByEmail(dto.email);
    if (existingEmail) {
      throw new BadRequestError('User with this email address already exists', AUTH_ERROR_CODES.USER_ALREADY_EXISTS);
    }

    if (dto.phone) {
      const existingPhone = await this.repo.findUserByPhone(dto.phone);
      if (existingPhone) {
        throw new BadRequestError('User with this phone number already exists', AUTH_ERROR_CODES.USER_ALREADY_EXISTS);
      }
    }

    const hashedPassword = await hashPassword(dto.password);
    const role = dto.role || UserRole.CUSTOMER;
    const permissions = ROLE_PERMISSIONS[role] || [];

    const newUser = await this.repo.createUser({
      name: dto.name,
      email: dto.email.toLowerCase(),
      phone: dto.phone,
      passwordHash: hashedPassword,
      role,
      permissions,
      accountStatus: 'pending_verification',
      verificationStatus: { emailVerified: false, phoneVerified: false },
      preferredLanguage: dto.preferredLanguage || 'en',
    });

    // Generate 6-digit Email Verification OTP
    const otp = generateNumericOTP(AUTH_CONSTANTS.OTP_LENGTH);
    const codeHash = hashCode(otp);
    const expiresAt = new Date(Date.now() + AUTH_CONSTANTS.OTP_EXPIRY_MINUTES * 60 * 1000);

    await this.repo.createVerificationCode({
      userId: newUser._id,
      target: newUser.email,
      codeHash,
      type: 'email_verification',
      expiresAt,
    });

    logger.info({ userId: newUser._id.toString(), email: newUser.email }, `🔑 Account registered. Verification OTP generated.`);

    return {
      user: this.formatSafeUser(newUser),
      otpSent: true,
    };
  }

  async login(dto: LoginDTO, clientMeta: ClientMetadata): Promise<AuthSuccessResponse> {
    let user: IUserDocument | null = null;

    if (dto.email) {
      user = await this.repo.findUserByEmail(dto.email, true);
    } else if (dto.phone) {
      user = await this.repo.findUserByPhone(dto.phone, true);
    }

    if (!user) {
      throw new UnauthorizedError('Invalid credentials provided', AUTH_ERROR_CODES.INVALID_CREDENTIALS);
    }

    if (user.accountStatus === 'banned' || user.accountStatus === 'suspended') {
      throw new ForbiddenError(`Account is ${user.accountStatus}. Please contact support.`, AUTH_ERROR_CODES.ACCOUNT_BLOCKED);
    }

    if (dto.password) {
      const isPasswordValid = await comparePassword(dto.password, user.passwordHash);
      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid credentials provided', AUTH_ERROR_CODES.INVALID_CREDENTIALS);
      }
    } else if (dto.otp) {
      const target = user.email;
      const validCode = await this.repo.findValidVerificationCode(target, 'login_otp');
      if (!validCode || hashCode(dto.otp) !== validCode.codeHash) {
        throw new UnauthorizedError('Invalid or expired login OTP', AUTH_ERROR_CODES.OTP_INVALID);
      }
      await this.repo.markCodeAsUsed(validCode._id);
    } else {
      throw new BadRequestError('Password or OTP code required for login');
    }

    // Update login metadata
    await this.repo.updateUserLoginMetadata(user._id, clientMeta.ipAddress);

    // Generate Tokens
    const tokens = generateAuthTokenPair({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const sessionId = generateNumericOTP(12) + '-' + user._id.toString().substring(0, 6);
    const refreshTokenHash = hashCode(tokens.refreshToken);
    const expiresAt = new Date(Date.now() + AUTH_CONSTANTS.SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    const session = await this.repo.createSession({
      sessionId,
      userId: user._id,
      refreshTokenHash,
      deviceName: clientMeta.deviceName,
      browser: clientMeta.browser,
      ipAddress: clientMeta.ipAddress,
      userAgent: clientMeta.userAgent,
      expiresAt,
    });

    logger.info({ userId: user._id.toString(), sessionId }, '🔓 Login successful. New session created.');

    return {
      user: this.formatSafeUser(user),
      tokens,
      session: {
        sessionId: session.sessionId,
        expiresAt: session.expiresAt,
      },
    };
  }

  async verifyOtp(dto: VerifyOtpDTO): Promise<{ success: boolean; message: string }> {
    const validCode = await this.repo.findValidVerificationCode(dto.target, dto.type);

    if (!validCode) {
      throw new BadRequestError('Verification code expired or invalid', AUTH_ERROR_CODES.OTP_EXPIRED);
    }

    if (validCode.attempts >= validCode.maxAttempts) {
      throw new BadRequestError('Maximum verification attempts exceeded. Please request a new code.', AUTH_ERROR_CODES.TOO_MANY_ATTEMPTS);
    }

    const inputHash = hashCode(dto.code);
    if (inputHash !== validCode.codeHash) {
      await this.repo.incrementVerificationAttempt(validCode._id);
      throw new BadRequestError('Invalid verification code provided', AUTH_ERROR_CODES.OTP_INVALID);
    }

    await this.repo.markCodeAsUsed(validCode._id);

    // Update user status
    if (dto.type === 'email_verification') {
      const user = await this.repo.findUserByEmail(dto.target);
      if (user) {
        user.verificationStatus.emailVerified = true;
        if (user.accountStatus === 'pending_verification') {
          user.accountStatus = 'active';
        }
        await user.save();
      }
    } else if (dto.type === 'phone_verification') {
      const user = await this.repo.findUserByPhone(dto.target);
      if (user) {
        user.verificationStatus.phoneVerified = true;
        await user.save();
      }
    }

    return { success: true, message: 'Verification successful' };
  }

  async forgotPassword(dto: ForgotPasswordDTO): Promise<{ message: string }> {
    const user = await this.repo.findUserByEmail(dto.email);
    
    // Always return generic success message to prevent user enumeration
    const genericResponse = { message: 'If an account exists with this email, a password reset code has been sent.' };

    if (!user) {
      return genericResponse;
    }

    const otp = generateNumericOTP(AUTH_CONSTANTS.OTP_LENGTH);
    const codeHash = hashCode(otp);
    const expiresAt = new Date(Date.now() + AUTH_CONSTANTS.OTP_EXPIRY_MINUTES * 60 * 1000);

    await this.repo.createVerificationCode({
      userId: user._id,
      target: user.email,
      codeHash,
      type: 'password_reset',
      expiresAt,
    });

    logger.info({ email: dto.email }, '🔑 Password reset OTP requested');

    return genericResponse;
  }

  async resetPassword(dto: ResetPasswordDTO): Promise<{ message: string }> {
    const validCode = await this.repo.findValidVerificationCode(dto.target, 'password_reset');

    if (!validCode || hashCode(dto.code) !== validCode.codeHash) {
      throw new BadRequestError('Invalid or expired password reset code', AUTH_ERROR_CODES.OTP_INVALID);
    }

    const user = await this.repo.findUserByEmail(dto.target, true);
    if (!user) {
      throw new NotFoundError('Account not found', AUTH_ERROR_CODES.ACCOUNT_NOT_FOUND);
    }

    const newPasswordHash = await hashPassword(dto.newPassword);
    user.passwordHash = newPasswordHash;
    await user.save();

    await this.repo.markCodeAsUsed(validCode._id);
    await this.repo.revokeAllUserSessions(user._id);

    logger.info({ userId: user._id.toString() }, '🔒 Password reset successful. All active sessions revoked.');

    return { message: 'Password reset successfully. Please login with your new password.' };
  }

  async refreshTokens(refreshTokenStr: string, clientMeta: ClientMetadata): Promise<AuthSuccessResponse> {
    const decoded = verifyRefreshToken(refreshTokenStr);
    const currentHash = hashCode(refreshTokenStr);

    const session = await this.repo.findSessionByRefreshHash(currentHash);
    if (!session || session.isRevoked) {
      throw new UnauthorizedError('Session expired or revoked', AUTH_ERROR_CODES.TOKEN_INVALID);
    }

    const user = await this.repo.findUserById(decoded.sub);
    if (!user || user.accountStatus === 'banned' || user.accountStatus === 'suspended') {
      throw new ForbiddenError('User account is inactive or blocked', AUTH_ERROR_CODES.ACCOUNT_BLOCKED);
    }

    // Issue New Tokens
    const newTokens = generateAuthTokenPair({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const newRefreshHash = hashCode(newTokens.refreshToken);
    const expiresAt = new Date(Date.now() + AUTH_CONSTANTS.SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    // Refresh Token Rotation: Update session with new hash & expiry
    await this.repo.updateSessionRefreshHash(session.sessionId, newRefreshHash, expiresAt);

    return {
      user: this.formatSafeUser(user),
      tokens: newTokens,
      session: {
        sessionId: session.sessionId,
        expiresAt,
      },
    };
  }

  async logout(sessionId: string): Promise<void> {
    await this.repo.revokeSession(sessionId);
  }

  async logoutAll(userId: string): Promise<number> {
    return this.repo.revokeAllUserSessions(userId as unknown as Types.ObjectId);
  }

  async getUserSessions(userId: string, currentSessionId?: string): Promise<SessionInfo[]> {
    const sessions = await this.repo.getUserActiveSessions(userId as unknown as Types.ObjectId);
    return sessions.map((s) => ({
      sessionId: s.sessionId,
      deviceName: s.deviceName || 'Unknown Device',
      browser: s.browser || 'Unknown Browser',
      ipAddress: s.ipAddress,
      lastActiveAt: s.lastActiveAt,
      createdAt: s.createdAt,
      isCurrentSession: s.sessionId === currentSessionId,
    }));
  }

  async getCurrentUser(userId: string): Promise<SafeUserResponse> {
    const user = await this.repo.findUserById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found', AUTH_ERROR_CODES.ACCOUNT_NOT_FOUND);
    }
    return this.formatSafeUser(user);
  }
}

export const authService = new AuthService();
