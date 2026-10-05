import { Schema, model, Document, Types } from 'mongoose';

export interface ISessionDocument extends Document {
  sessionId: string;
  userId: Types.ObjectId;
  refreshTokenHash: string;
  deviceName?: string;
  browser?: string;
  ipAddress?: string;
  userAgent?: string;
  isRevoked: boolean;
  trustedDevice: boolean;
  lastActiveAt: Date;
  expiresAt: Date;
  createdAt: Date;
}

const sessionSchema = new Schema<ISessionDocument>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    refreshTokenHash: {
      type: String,
      required: true,
      index: true,
    },
    deviceName: {
      type: String,
      default: 'Unknown Device',
    },
    browser: {
      type: String,
      default: 'Unknown Browser',
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },
    trustedDevice: {
      type: Boolean,
      default: false,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL Index automatically removes expired session docs
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

sessionSchema.index({ userId: 1, isRevoked: 1 });

export const Session = model<ISessionDocument>('Session', sessionSchema);
