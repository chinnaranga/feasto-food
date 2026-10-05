import { Schema, model, Document, Types } from 'mongoose';

export type OrderType = 'delivery' | 'pickup' | 'dine_in';
export type OrderStatus =
  | 'pending'
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'rejected';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type FulfillmentStatus = 'unassigned' | 'assigned' | 'arrived' | 'picked_up' | 'delivered';

export interface IOrderItemSnapshot {
  itemId: Types.ObjectId;
  itemName: string;
  variantId?: string;
  variantName?: string;
  basePrice: number;
  quantity: number;
  addons: Array<{
    addonId?: string;
    name: string;
    price: number;
  }>;
  itemTotal: number;
}

export interface IDeliveryAddressSnapshot {
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
    coordinates: [number, number];
  };
}

export interface IOrderPricingSnapshot {
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  packagingFee: number;
  discountAmount: number;
  tipAmount: number;
  totalAmount: number;
  currency: string;
}

export interface IOrderDocument extends Document {
  orderNumber: string;
  customerId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  branchId: Types.ObjectId;
  riderId?: Types.ObjectId;
  orderType: OrderType;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  items: IOrderItemSnapshot[];
  deliveryAddressSnapshot?: IDeliveryAddressSnapshot;
  pricing: IOrderPricingSnapshot;
  specialInstructions?: string;
  estimatedPrepTimeMinutes: number;
  estimatedDeliveryTime?: Date;
  acceptedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSnapshotSchema = new Schema<IOrderItemSnapshot>(
  {
    itemId: { type: Schema.Types.ObjectId, required: true },
    itemName: { type: String, required: true },
    variantId: { type: String },
    variantName: { type: String },
    basePrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    addons: [
      {
        addonId: { type: String },
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    itemTotal: { type: Number, required: true },
  },
  { _id: false }
);

const deliveryAddressSnapshotSchema = new Schema<IDeliveryAddressSnapshot>(
  {
    label: { type: String, required: true },
    street: { type: String, required: true },
    building: { type: String },
    floor: { type: String },
    apartment: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true, default: 'US' },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number] },
    },
  },
  { _id: false }
);

const orderPricingSnapshotSchema = new Schema<IOrderPricingSnapshot>(
  {
    subtotal: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    packagingFee: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    tipAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: 'RestaurantBranch',
      required: true,
      index: true,
    },
    riderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    orderType: {
      type: String,
      enum: ['delivery', 'pickup', 'dine_in'],
      default: 'delivery',
    },
    orderStatus: {
      type: String,
      enum: [
        'pending',
        'placed',
        'accepted',
        'preparing',
        'ready',
        'out_for_delivery',
        'delivered',
        'cancelled',
        'rejected',
      ],
      default: 'placed',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    fulfillmentStatus: {
      type: String,
      enum: ['unassigned', 'assigned', 'arrived', 'picked_up', 'delivered'],
      default: 'unassigned',
      index: true,
    },
    items: {
      type: [orderItemSnapshotSchema],
      required: true,
    },
    deliveryAddressSnapshot: {
      type: deliveryAddressSnapshotSchema,
    },
    pricing: {
      type: orderPricingSnapshotSchema,
      required: true,
    },
    specialInstructions: {
      type: String,
      maxlength: [300, 'Special instructions cannot exceed 300 characters'],
    },
    estimatedPrepTimeMinutes: {
      type: Number,
      default: 20,
    },
    estimatedDeliveryTime: { type: Date },
    acceptedAt: { type: Date },
    cancelledAt: { type: Date },
    cancellationReason: { type: String },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ restaurantId: 1, orderStatus: 1, createdAt: -1 });

export const Order = model<IOrderDocument>('Order', orderSchema);
