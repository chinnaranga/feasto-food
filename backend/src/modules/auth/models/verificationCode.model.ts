import { Schema, model, Document, Types } from 'mongoose';

export type VerificationType =
  | 'email_verification'
  | 'phone_verification'
  | 'password_reset'
  | 'login_otp';

export interface IVerificationCodeDocument extends Document {
  userId?: Types.ObjectId;
  target: string;
  codeHash: string;
  type: VerificationType;
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
  isUsed: boolean;
  createdAt: Date;
}

const verificationCodeSchema = new Schema<IVerificationCodeDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    target: {
      type: String,
      required: true,
      index: true,
    },
    codeHash: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['email_verification', 'phone_verification', 'password_reset', 'login_otp'],
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL Index for auto-cleanup
    },
    attempts: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 5,
    },
    isUsed: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

verificationCodeSchema.index({ target: 1, type: 1, isUsed: 1 });

export const VerificationCode = model<IVerificationCodeDocument>(
  'VerificationCode',
  verificationCodeSchema
);
