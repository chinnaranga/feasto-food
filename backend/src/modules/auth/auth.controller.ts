import { Request, Response } from 'express';
import { authService, AuthService } from './auth.service.js';
import { parseClientMetadata } from './auth.utils.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { HttpStatus } from '../../shared/constants/httpStatusCodes.js';
import { UnauthorizedError } from '../../shared/errors/UnauthorizedError.js';
import { BadRequestError } from '../../shared/errors/BadRequestError.js';

export class AuthController {
  constructor(private service: AuthService = authService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const clientMeta = parseClientMetadata(req);
    const result = await this.service.register(req.body, clientMeta);
    sendSuccess(
      res,
      result,
      'Registration successful. Please verify your email with the code sent.',
      HttpStatus.CREATED
    );
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const clientMeta = parseClientMetadata(req);
    const result = await this.service.login(req.body, clientMeta);
    sendSuccess(res, result, 'Login successful');
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.body.refreshToken;
    const clientMeta = parseClientMetadata(req);
    const result = await this.service.refreshTokens(refreshToken, clientMeta);
    sendSuccess(res, result, 'Tokens refreshed successfully');
  };

  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.verifyOtp({
      target: req.body.email,
      code: req.body.token,
      type: 'email_verification',
    });
    sendSuccess(res, result, 'Email verified successfully');
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.verifyOtp(req.body);
    sendSuccess(res, result, 'OTP verified successfully');
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.forgotPassword(req.body);
    sendSuccess(res, result, result.message);
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.resetPassword(req.body);
    sendSuccess(res, result, result.message);
  };

  resendVerification = async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.forgotPassword({ email: req.body.email });
    sendSuccess(res, result, 'Verification code resent successfully');
  };

  getMe = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const user = await this.service.getCurrentUser(req.user.id);
    sendSuccess(res, user, 'User profile retrieved');
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    const rawSessionId = req.body.sessionId || req.headers['x-session-id'];
    const sessionId = Array.isArray(rawSessionId) ? rawSessionId[0] : rawSessionId;
    if (sessionId && typeof sessionId === 'string') {
      await this.service.logout(sessionId);
    }
    sendSuccess(res, null, 'Logout successful');
  };

  logoutAll = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const count = await this.service.logoutAll(req.user.id);
    sendSuccess(res, { revokedSessionsCount: count }, 'All sessions logged out successfully');
  };

  getSessions = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const rawSessionId = req.headers['x-session-id'];
    const currentSessionId = Array.isArray(rawSessionId) ? rawSessionId[0] : rawSessionId;
    const sessions = await this.service.getUserSessions(req.user.id, currentSessionId);
    sendSuccess(res, sessions, 'Active sessions retrieved');
  };

  revokeSession = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const rawSessionId = req.params.sessionId;
    const sessionId = Array.isArray(rawSessionId) ? rawSessionId[0] : rawSessionId;
    if (!sessionId) {
      throw new BadRequestError('Session ID parameter is required');
    }
    await this.service.logout(sessionId);
    sendSuccess(res, null, `Session ${sessionId} revoked successfully`);
  };
}

export const authController = new AuthController();
