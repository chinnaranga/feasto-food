import { Schema, model, Document, Types } from 'mongoose';
import { OrderStatus } from '../orders.model.js';

export interface IOrderStatusHistoryDocument extends Document {
  orderId: Types.ObjectId;
  status: OrderStatus;
  changedBy: Types.ObjectId;
  role: string;
  note?: string;
  createdAt: Date;
}

const orderStatusHistorySchema = new Schema<IOrderStatusHistoryDocument>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    status: {
      type: String,
      required: true,
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

orderStatusHistorySchema.index({ orderId: 1, createdAt: 1 });

export const OrderStatusHistory = model<IOrderStatusHistoryDocument>(
  'OrderStatusHistory',
  orderStatusHistorySchema
);
