import { Schema, model, Document, Types } from 'mongoose';

export type RiderAccountStatus = 'active' | 'pending_verification' | 'suspended' | 'banned';
export type RiderVerificationStatus = 'unverified' | 'pending_review' | 'verified' | 'rejected';
export type RiderAvailabilityStatus = 'online' | 'offline' | 'on_delivery' | 'break';

export interface IRiderDocument extends Document {
  userId: Types.ObjectId;
  fullName: string;
  phone: string;
  email: string;
  profilePhoto?: string;
  accountStatus: RiderAccountStatus;
  verificationStatus: RiderVerificationStatus;
  availabilityStatus: RiderAvailabilityStatus;
  currentZone?: string;
  preferredZones: string[];
  lastKnownLocation?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  lastActiveAt?: Date;
  rating: number;
  profileCompleteness: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const riderSchema = new Schema<IRiderDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    profilePhoto: { type: String },
    accountStatus: {
      type: String,
      enum: ['active', 'pending_verification', 'suspended', 'banned'],
      default: 'pending_verification',
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending_review', 'verified', 'rejected'],
      default: 'unverified',
      index: true,
    },
    availabilityStatus: {
      type: String,
      enum: ['online', 'offline', 'on_delivery', 'break'],
      default: 'offline',
      index: true,
    },
    currentZone: { type: String, trim: true },
    preferredZones: [{ type: String, trim: true }],
    lastKnownLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: { type: [Number] },
    },
    lastActiveAt: { type: Date, default: Date.now },
    rating: { type: Number, default: 5.0, min: 1.0, max: 5.0 },
    profileCompleteness: { type: Number, default: 30, min: 0, max: 100 },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
  }
);

riderSchema.index({ lastKnownLocation: '2dsphere' });
riderSchema.index({ availabilityStatus: 1, verificationStatus: 1, isDeleted: 1 });

export const Rider = model<IRiderDocument>('Rider', riderSchema);
