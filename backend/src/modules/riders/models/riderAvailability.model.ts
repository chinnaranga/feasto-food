import { Schema, model, Document, Types } from 'mongoose';

export interface IRiderAvailabilityDocument extends Document {
  riderId: Types.ObjectId;
  isOnline: boolean;
  breakMode: boolean;
  activeDeliveryId?: Types.ObjectId;
  updatedAt: Date;
}

const riderAvailabilitySchema = new Schema<IRiderAvailabilityDocument>(
  {
    riderId: {
      type: Schema.Types.ObjectId,
      ref: 'Rider',
      required: true,
      unique: true,
      index: true,
    },
    isOnline: { type: Boolean, default: false, index: true },
    breakMode: { type: Boolean, default: false },
    activeDeliveryId: { type: Schema.Types.ObjectId, ref: 'Order' },
  },
  {
    timestamps: true,
  }
);

export const RiderAvailability = model<IRiderAvailabilityDocument>(
  'RiderAvailability',
  riderAvailabilitySchema
);
