import { Schema, model, Document, Types } from 'mongoose';

export type VerificationStatus = 'unverified' | 'pending_review' | 'verified' | 'rejected';
export type OperationalStatus = 'open' | 'closed' | 'busy' | 'paused';
export type AccountStatus = 'active' | 'suspended';

export interface IRestaurantDocument extends Document {
  ownerUserId: Types.ObjectId;
  restaurantName: string;
  legalBusinessName: string;
  description?: string;
  cuisineTypes: string[];
  logoUrl?: string;
  coverImageUrl?: string;
  brandColor?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  timezone: string;
  currency: string;
  verificationStatus: VerificationStatus;
  accountStatus: AccountStatus;
  operationalStatus: OperationalStatus;
  serviceModes: {
    dineIn: boolean;
    takeaway: boolean;
    delivery: boolean;
    pickup: boolean;
  };
  profileCompleteness: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const restaurantSchema = new Schema<IRestaurantDocument>(
  {
    ownerUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner user ID is required'],
      index: true,
    },
    restaurantName: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
      maxlength: [100, 'Restaurant name cannot exceed 100 characters'],
      index: true,
    },
    legalBusinessName: {
      type: String,
      required: [true, 'Legal business name is required'],
      trim: true,
      maxlength: [150, 'Legal name cannot exceed 150 characters'],
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    cuisineTypes: [
      {
        type: String,
        trim: true,
      },
    ],
    logoUrl: { type: String },
    coverImageUrl: { type: String },
    brandColor: { type: String, default: '#FF5A5F' },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      default: 'US',
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    currency: {
      type: String,
      default: 'USD',
    },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending_review', 'verified', 'rejected'],
      default: 'unverified',
      index: true,
    },
    accountStatus: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
      index: true,
    },
    operationalStatus: {
      type: String,
      enum: ['open', 'closed', 'busy', 'paused'],
      default: 'closed',
      index: true,
    },
    serviceModes: {
      dineIn: { type: Boolean, default: true },
      takeaway: { type: Boolean, default: true },
      delivery: { type: Boolean, default: true },
      pickup: { type: Boolean, default: true },
    },
    profileCompleteness: {
      type: Number,
      default: 40,
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

restaurantSchema.index({ ownerUserId: 1, isDeleted: 1 });
restaurantSchema.index({ city: 1, verificationStatus: 1, isDeleted: 1 });

export const Restaurant = model<IRestaurantDocument>('Restaurant', restaurantSchema);
