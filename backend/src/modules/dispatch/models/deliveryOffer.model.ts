import mongoose, { Schema, Document } from 'mongoose';
import { IDeliveryOffer } from '../dispatch.types.js';
import { OFFER_STATUSES, REJECTION_REASONS } from '../dispatch.constants.js';

export interface DeliveryOfferDocument extends Omit<IDeliveryOffer, '_id'>, Document {}

const DeliveryOfferSchema = new Schema<DeliveryOfferDocument>(
  {
    offerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    orderId: {
      type: String,
      required: true,
      index: true,
    },
    riderId: {
      type: String,
      required: true,
      index: true,
    },
    restaurantId: {
      type: String,
      required: true,
      index: true,
    },
    branchId: {
      type: String,
      index: true,
    },
    status: {
      type: String,
      enum: OFFER_STATUSES,
      default: 'PENDING',
      index: true,
    },
    score: {
      type: Number,
      required: true,
    },
    distanceToRestaurantKm: {
      type: Number,
      required: true,
    },
    estimatedPickupTimeMinutes: {
      type: Number,
      default: 15,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    respondedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      enum: REJECTION_REASONS,
    },
  },
  { timestamps: true }
);

DeliveryOfferSchema.index({ riderId: 1, status: 1, expiresAt: 1 });
DeliveryOfferSchema.index({ orderId: 1, status: 1 });

export const DeliveryOfferModel = mongoose.model<DeliveryOfferDocument>('DeliveryOffer', DeliveryOfferSchema);
