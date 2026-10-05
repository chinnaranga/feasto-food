import mongoose, { Schema, Document } from 'mongoose';
import { IKitchenStation, IKitchenItem, IKitchenOrder } from './kitchen.types.js';
import { ITEM_PREPARATION_STATUSES, KITCHEN_ORDER_PRIORITIES } from './kitchen.constants.js';

export interface KitchenStationDocument extends Omit<IKitchenStation, '_id'>, Document {}
export interface KitchenItemDocument extends Omit<IKitchenItem, '_id'>, Document {}
export interface KitchenOrderDocument extends Omit<IKitchenOrder, '_id'>, Document {}

const KitchenStationSchema = new Schema<KitchenStationDocument>(
  {
    stationId: {
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
    branchId: {
      type: String,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'busy'],
      default: 'active',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    capacity: {
      type: Number,
      default: 10,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

KitchenStationSchema.index({ restaurantId: 1, branchId: 1, active: 1 });

export const KitchenStationModel = mongoose.model<KitchenStationDocument>(
  'KitchenStation',
  KitchenStationSchema
);

const KitchenItemSchema = new Schema<KitchenItemDocument>(
  {
    kitchenItemId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    kitchenOrderId: {
      type: String,
      required: true,
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
    itemId: {
      type: String,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    stationId: {
      type: String,
      index: true,
    },
    stationCode: {
      type: String,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    variantName: {
      type: String,
    },
    addons: [
      {
        name: { type: String },
        price: { type: Number },
      },
    ],
    specialInstructions: {
      type: String,
    },
    status: {
      type: String,
      enum: ITEM_PREPARATION_STATUSES,
      default: 'PENDING',
      index: true,
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

KitchenItemSchema.index({ orderId: 1, status: 1 });

export const KitchenItemModel = mongoose.model<KitchenItemDocument>('KitchenItem', KitchenItemSchema);

const KitchenOrderSchema = new Schema<KitchenOrderDocument>(
  {
    kitchenOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    orderNumber: {
      type: String,
      required: true,
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
    priority: {
      type: String,
      enum: KITCHEN_ORDER_PRIORITIES,
      default: 'NORMAL',
      index: true,
    },
    status: {
      type: String,
      enum: ['QUEUED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'],
      default: 'QUEUED',
      index: true,
    },
    itemCount: {
      type: Number,
      required: true,
      min: 1,
    },
    completedItemCount: {
      type: Number,
      default: 0,
    },
    estimatedPreparationTimeMinutes: {
      type: Number,
      default: 20,
    },
    actualPreparationTimeMinutes: {
      type: Number,
    },
    preparationStartedAt: {
      type: Date,
    },
    preparationCompletedAt: {
      type: Date,
    },
    expectedReadyAt: {
      type: Date,
      index: true,
    },
    delayMinutes: {
      type: Number,
      default: 0,
    },
    delayReason: {
      type: String,
    },
    specialInstructions: {
      type: String,
    },
  },
  { timestamps: true }
);

KitchenOrderSchema.index({ restaurantId: 1, status: 1, priority: 1, createdAt: 1 });

export const KitchenOrderModel = mongoose.model<KitchenOrderDocument>('KitchenOrder', KitchenOrderSchema);
