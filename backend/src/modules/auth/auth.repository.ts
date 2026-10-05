import { Types } from 'mongoose';
import { User, IUserDocument } from '../users/user.model.js';
import { Session, ISessionDocument } from './models/session.model.js';
import {
  VerificationCode,
  IVerificationCodeDocument,
  VerificationType,
} from './models/verificationCode.model.js';

export class AuthRepository {
  // --- User Repository Methods ---
  async findUserByEmail(email: string, includePassword = false): Promise<IUserDocument | null> {
    const query = User.findOne({ email: email.toLowerCase(), isDeleted: false });
    if (includePassword) {
      query.select('+passwordHash');
    }
    return query.exec();
  }

  async findUserByPhone(phone: string, includePassword = false): Promise<IUserDocument | null> {
    const query = User.findOne({ phone, isDeleted: false });
    if (includePassword) {
      query.select('+passwordHash');
    }
    return query.exec();
  }

  async findUserById(id: string | Types.ObjectId): Promise<IUserDocument | null> {
    return User.findOne({ _id: id, isDeleted: false }).exec();
  }

  async createUser(userData: Partial<IUserDocument>): Promise<IUserDocument> {
    const user = new User(userData);
    return user.save();
  }

  async updateUserLoginMetadata(userId: Types.ObjectId, ipAddress: string): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      $set: {
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
      },
    }).exec();
  }

  // --- Session Repository Methods ---
  async createSession(sessionData: Partial<ISessionDocument>): Promise<ISessionDocument> {
    const session = new Session(sessionData);
    const saved = await session.save();

    await User.findByIdAndUpdate(sessionData.userId, {
      $inc: { activeSessionsCount: 1 },
    });

    return saved;
  }

  async findSessionById(sessionId: string): Promise<ISessionDocument | null> {
    return Session.findOne({ sessionId, isRevoked: false }).exec();
  }

  async findSessionByRefreshHash(refreshTokenHash: string): Promise<ISessionDocument | null> {
    return Session.findOne({ refreshTokenHash, isRevoked: false }).exec();
  }

  async updateSessionRefreshHash(
    sessionId: string,
    newHash: string,
    expiresAt: Date
  ): Promise<void> {
    await Session.findOneAndUpdate(
      { sessionId },
      {
        $set: {
          refreshTokenHash: newHash,
          expiresAt,
          lastActiveAt: new Date(),
        },
      }
    ).exec();
  }

  async revokeSession(sessionId: string, userId?: Types.ObjectId): Promise<void> {
    const query: Record<string, unknown> = { sessionId };
    if (userId) query.userId = userId;

    const session = await Session.findOneAndUpdate(query, {
      $set: { isRevoked: true },
    }).exec();

    if (session) {
      await User.findByIdAndUpdate(session.userId, {
        $inc: { activeSessionsCount: -1 },
      });
    }
  }

  async revokeAllUserSessions(userId: Types.ObjectId): Promise<number> {
    const result = await Session.updateMany(
      { userId, isRevoked: false },
      { $set: { isRevoked: true } }
    ).exec();

    await User.findByIdAndUpdate(userId, {
      $set: { activeSessionsCount: 0 },
    });

    return result.modifiedCount;
  }

  async getUserActiveSessions(userId: Types.ObjectId): Promise<ISessionDocument[]> {
    return Session.find({ userId, isRevoked: false, expiresAt: { $gt: new Date() } })
      .sort({ lastActiveAt: -1 })
      .exec();
  }

  // --- Verification Code Repository Methods ---
  async createVerificationCode(
    codeData: Partial<IVerificationCodeDocument>
  ): Promise<IVerificationCodeDocument> {
    // Deactivate existing unused codes for the same target & type
    await VerificationCode.updateMany(
      { target: codeData.target, type: codeData.type, isUsed: false },
      { $set: { isUsed: true } }
    );

    const code = new VerificationCode(codeData);
    return code.save();
  }

  async findValidVerificationCode(
    target: string,
    type: VerificationType
  ): Promise<IVerificationCodeDocument | null> {
    return VerificationCode.findOne({
      target,
      type,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    })
      .sort({ createdAt: -1 })
      .exec();
  }

  async incrementVerificationAttempt(codeId: Types.ObjectId): Promise<void> {
    await VerificationCode.findByIdAndUpdate(codeId, {
      $inc: { attempts: 1 },
    });
  }

  async markCodeAsUsed(codeId: Types.ObjectId): Promise<void> {
    await VerificationCode.findByIdAndUpdate(codeId, {
      $set: { isUsed: true },
    });
  }
}

export const authRepository = new AuthRepository();
