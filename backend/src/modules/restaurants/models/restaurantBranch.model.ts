import { Schema, model, Document, Types } from 'mongoose';

export type BranchStatus = 'active' | 'inactive' | 'temporarily_closed';

export interface IRestaurantBranchDocument extends Document {
  restaurantId: Types.ObjectId;
  branchName: string;
  branchCode: string;
  branchManagerId?: Types.ObjectId;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  status: BranchStatus;
  isMainBranch: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const restaurantBranchSchema = new Schema<IRestaurantBranchDocument>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    branchName: {
      type: String,
      required: [true, 'Branch name is required'],
      trim: true,
    },
    branchCode: {
      type: String,
      required: [true, 'Branch code is required'],
      trim: true,
      uppercase: true,
    },
    branchManagerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    phone: {
      type: String,
      required: [true, 'Branch phone is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Branch email is required'],
      lowercase: true,
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Branch address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
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
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'temporarily_closed'],
      default: 'active',
      index: true,
    },
    isMainBranch: {
      type: Boolean,
      default: false,
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

restaurantBranchSchema.index({ restaurantId: 1, isDeleted: 1 });
restaurantBranchSchema.index({ location: '2dsphere' });

export const RestaurantBranch = model<IRestaurantBranchDocument>(
  'RestaurantBranch',
  restaurantBranchSchema
);
