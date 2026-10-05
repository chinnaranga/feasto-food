import { UserRole } from '../constants/roles.js';

export interface TokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface AuthSession {
  userId: string;
  role: UserRole;
  deviceInfo?: string;
  ipAddress?: string;
  createdAt: string;
}
