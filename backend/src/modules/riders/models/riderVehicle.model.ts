import { Schema, model, Document, Types } from 'mongoose';

export type VehicleType = 'bicycle' | 'scooter' | 'motorcycle' | 'car';

export interface IRiderVehicleDocument extends Document {
  riderId: Types.ObjectId;
  vehicleType: VehicleType;
  vehicleBrand?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  vehicleNumber?: string;
  licenseNumber?: string;
  licenseExpiryDate?: Date;
  isPrimary: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const riderVehicleSchema = new Schema<IRiderVehicleDocument>(
  {
    riderId: {
      type: Schema.Types.ObjectId,
      ref: 'Rider',
      required: true,
      index: true,
    },
    vehicleType: {
      type: String,
      enum: ['bicycle', 'scooter', 'motorcycle', 'car'],
      required: true,
    },
    vehicleBrand: { type: String, trim: true },
    vehicleModel: { type: String, trim: true },
    vehicleColor: { type: String, trim: true },
    vehicleNumber: { type: String, trim: true, uppercase: true },
    licenseNumber: { type: String, trim: true },
    licenseExpiryDate: { type: Date },
    isPrimary: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

riderVehicleSchema.index({ riderId: 1, isPrimary: 1 });

export const RiderVehicle = model<IRiderVehicleDocument>(
  'RiderVehicle',
  riderVehicleSchema
);
