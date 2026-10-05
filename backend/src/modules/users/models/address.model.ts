import { Schema, model, Document, Types } from 'mongoose';

export interface IAddressDocument extends Document {
  userId: Types.ObjectId;
  label: string;
  street: string;
  building?: string;
  floor?: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  isDefault: boolean;
  deliveryInstructions?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddressDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    label: {
      type: String,
      required: [true, 'Address label is required'],
      trim: true,
      default: 'Home',
    },
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
    },
    building: {
      type: String,
      trim: true,
    },
    floor: {
      type: String,
      trim: true,
    },
    apartment: {
      type: String,
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
    zipCode: {
      type: String,
      required: [true, 'Zip/Postal code is required'],
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
    isDefault: {
      type: Boolean,
      default: false,
      index: true,
    },
    deliveryInstructions: {
      type: String,
      maxlength: [300, 'Delivery instructions cannot exceed 300 characters'],
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
addressSchema.index({ userId: 1, isDeleted: 1 });
addressSchema.index({ location: '2dsphere' });

export const Address = model<IAddressDocument>('Address', addressSchema);
