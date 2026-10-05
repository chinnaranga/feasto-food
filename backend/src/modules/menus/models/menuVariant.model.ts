import { Schema, model, Document, Types } from 'mongoose';

export interface IMenuVariantDocument extends Document {
  itemId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  variantName: string;
  priceAdjustment: number;
  isDefault: boolean;
  availabilityStatus: 'available' | 'out_of_stock';
  createdAt: Date;
  updatedAt: Date;
}

const menuVariantSchema = new Schema<IMenuVariantDocument>(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true,
      index: true,
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    variantName: {
      type: String,
      required: [true, 'Variant name is required'],
      trim: true,
    },
    priceAdjustment: {
      type: Number,
      default: 0,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    availabilityStatus: {
      type: String,
      enum: ['available', 'out_of_stock'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

menuVariantSchema.index({ itemId: 1 });

export const MenuVariant = model<IMenuVariantDocument>(
  'MenuVariant',
  menuVariantSchema
);
