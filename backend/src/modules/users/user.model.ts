import { Schema, model, Document } from 'mongoose';
import { UserRole, ALL_ROLES } from '../../shared/constants/roles.js';
import { Permission } from '../../shared/constants/permissions.js';

export type AccountStatus = 'active' | 'pending_verification' | 'suspended' | 'banned';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  permissions: Permission[];
  accountStatus: AccountStatus;
  verificationStatus: {
    emailVerified: boolean;
    phoneVerified: boolean;
  };
  lastLoginAt?: Date;
  lastLoginIp?: string;
  lastActiveAt?: Date;
  trustedDevices: string[];
  activeSessionsCount: number;
  deviceCount: number;
  profilePhoto?: string;
  preferredLanguage: string;
  preferredCurrency: string;
  timezone: string;
  bio?: string;
  profileCompleteness: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      sparse: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false,
    },
    role: {
      type: String,
      enum: ALL_ROLES,
      default: UserRole.CUSTOMER,
      index: true,
    },
    permissions: [
      {
        type: String,
      },
    ],
    accountStatus: {
      type: String,
      enum: ['active', 'pending_verification', 'suspended', 'banned'],
      default: 'pending_verification',
      index: true,
    },
    verificationStatus: {
      emailVerified: { type: Boolean, default: false },
      phoneVerified: { type: Boolean, default: false },
    },
    lastLoginAt: {
      type: Date,
    },
    lastLoginIp: {
      type: String,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
    trustedDevices: [
      {
        type: String,
      },
    ],
    activeSessionsCount: {
      type: Number,
      default: 0,
    },
    deviceCount: {
      type: Number,
      default: 0,
    },
    profilePhoto: {
      type: String,
    },
    preferredLanguage: {
      type: String,
      default: 'en',
    },
    preferredCurrency: {
      type: String,
      default: 'USD',
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    profileCompleteness: {
      type: Number,
      default: 30,
      min: 0,
      max: 100,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1, isDeleted: 1 });
userSchema.index({ phone: 1, isDeleted: 1 });

export const User = model<IUserDocument>('User', userSchema);
