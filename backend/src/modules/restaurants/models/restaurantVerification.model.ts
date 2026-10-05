import { Schema, model, Document, Types } from 'mongoose';
import { VerificationStatus } from '../restaurants.model.js';

export interface IRestaurantVerificationDocument extends Document {
  restaurantId: Types.ObjectId;
  status: VerificationStatus;
  businessLicenseNumber?: string;
  taxId?: string;
  ownerIdentityDocumentUrl?: string;
  proofOfAddressUrl?: string;
  rejectionReason?: string;
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const restaurantVerificationSchema = new Schema<IRestaurantVerificationDocument>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['unverified', 'pending_review', 'verified', 'rejected'],
      default: 'unverified',
      index: true,
    },
    businessLicenseNumber: { type: String, trim: true },
    taxId: { type: String, trim: true },
    ownerIdentityDocumentUrl: { type: String },
    proofOfAddressUrl: { type: String },
    rejectionReason: { type: String },
    submittedAt: { type: Date },
    reviewedAt: { type: Date },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

export const RestaurantVerification = model<IRestaurantVerificationDocument>(
  'RestaurantVerification',
  restaurantVerificationSchema
);
