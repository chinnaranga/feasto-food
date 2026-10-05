import { Schema, model, Document, Types } from 'mongoose';

export interface IAddonItem {
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface IMenuAddonDocument extends Document {
  itemId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  groupName: string;
  isRequired: boolean;
  minSelections: number;
  maxSelections: number;
  addonItems: IAddonItem[];
  createdAt: Date;
  updatedAt: Date;
}

const addonItemSchema = new Schema<IAddonItem>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false }
);

const menuAddonSchema = new Schema<IMenuAddonDocument>(
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
    groupName: {
      type: String,
      required: [true, 'Addon group name is required'],
      trim: true,
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    minSelections: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxSelections: {
      type: Number,
      default: 5,
      min: 1,
    },
    addonItems: {
      type: [addonItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

menuAddonSchema.index({ itemId: 1 });

export const MenuAddon = model<IMenuAddonDocument>(
  'MenuAddon',
  menuAddonSchema
);
