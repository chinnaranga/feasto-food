import mongoose, { Schema, Document } from 'mongoose';
import {
  IRestaurantOperations,
  IOrderPreparationEvent,
  IOrderDelay,
  IRestaurantOperationalEvent,
} from './restaurantOperations.types.js';
import {
  RESTAURANT_OPERATIONAL_STATUSES,
  RESTAURANT_SUB_STATES,
  DELAY_REASONS,
} from './restaurantOperations.constants.js';

export interface RestaurantOperationsDocument extends Omit<IRestaurantOperations, '_id'>, Document {}
export interface OrderPreparationEventDocument extends Omit<IOrderPreparationEvent, '_id'>, Document {}
export interface OrderDelayDocument extends Omit<IOrderDelay, '_id'>, Document {}
export interface RestaurantOperationalEventDocument extends Omit<IRestaurantOperationalEvent, '_id'>, Document {}

const RestaurantOperationsSchema = new Schema<RestaurantOperationsDocument>(
  {
    restaurantId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    branchId: {
      type: String,
      index: true,
    },
    status: {
      type: String,
      enum: RESTAURANT_OPERATIONAL_STATUSES,
      required: true,
      default: 'OPEN',
      index: true,
    },
    isPaused: {
      type: Boolean,
      default: false,
      index: true,
    },
    pauseReason: {
      type: String,
    },
    pausedUntil: {
      type: Date,
    },
    avgPreparationTimeMinutes: {
      type: Number,
      default: 20,
    },
    activeOrderCount: {
      type: Number,
      default: 0,
    },
    lastStatusChangedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

RestaurantOperationsSchema.index({ restaurantId: 1, branchId: 1 });

export const RestaurantOperationsModel = mongoose.model<RestaurantOperationsDocument>(
  'RestaurantOperations',
  RestaurantOperationsSchema
);

const OrderPreparationEventSchema = new Schema<OrderPreparationEventDocument>(
  {
    eventId: {
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
    restaurantId: {
      type: String,
      required: true,
      index: true,
    },
    previousSubState: {
      type: String,
      enum: RESTAURANT_SUB_STATES,
    },
    newSubState: {
      type: String,
      enum: RESTAURANT_SUB_STATES,
      required: true,
    },
    actorId: {
      type: String,
      required: true,
    },
    actorRole: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

OrderPreparationEventSchema.index({ orderId: 1, createdAt: -1 });

export const OrderPreparationEventModel = mongoose.model<OrderPreparationEventDocument>(
  'OrderPreparationEvent',
  OrderPreparationEventSchema
);

const OrderDelaySchema = new Schema<OrderDelayDocument>(
  {
    delayId: {
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
    restaurantId: {
      type: String,
      required: true,
      index: true,
    },
    reason: {
      type: String,
      enum: DELAY_REASONS,
      required: true,
    },
    delayMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    notes: {
      type: String,
    },
    createdBy: {
      type: String,
      required: true,
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

OrderDelaySchema.index({ orderId: 1, isResolved: 1 });

export const OrderDelayModel = mongoose.model<OrderDelayDocument>('OrderDelay', OrderDelaySchema);

const RestaurantOperationalEventSchema = new Schema<RestaurantOperationalEventDocument>(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    restaurantId: {
      type: String,
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    details: {
      type: Schema.Types.Mixed,
    },
    actorId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

RestaurantOperationalEventSchema.index({ restaurantId: 1, createdAt: -1 });

export const RestaurantOperationalEventModel = mongoose.model<RestaurantOperationalEventDocument>(
  'RestaurantOperationalEvent',
  RestaurantOperationalEventSchema
);
