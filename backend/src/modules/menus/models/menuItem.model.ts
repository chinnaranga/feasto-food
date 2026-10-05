import { Schema, model, Document, Types } from 'mongoose';
import { PublishState } from '../menus.model.js';

export type ItemAvailabilityStatus = 'available' | 'out_of_stock' | 'temporarily_unavailable';

export interface IMenuItemDocument extends Document {
  menuId: Types.ObjectId;
  categoryId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  itemName: string;
  itemDescription?: string;
  basePrice: number;
  discountedPrice?: number;
  currency: string;
  isVeg: boolean;
  dietaryTags: string[];
  publishState: PublishState;
  availabilityStatus: ItemAvailabilityStatus;
  media: {
    primaryImageUrl?: string;
    galleryUrls: string[];
  };
  nutrition: {
    calories?: number;
    proteinGrams?: number;
    carbsGrams?: number;
    fatGrams?: number;
    allergens: string[];
    ingredients: string[];
  };
  availability: {
    availableDays: string[];
    timeWindow?: {
      startTime: string; // HH:mm
      endTime: string;   // HH:mm
    };
    isAvailableAllDay: boolean;
  };
  displayOrder: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new Schema<IMenuItemDocument>(
  {
    menuId: {
      type: Schema.Types.ObjectId,
      ref: 'Menu',
      required: true,
      index: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'MenuCategory',
      required: true,
      index: true,
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: [120, 'Item name cannot exceed 120 characters'],
    },
    itemDescription: {
      type: String,
      maxlength: [500, 'Item description cannot exceed 500 characters'],
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountedPrice: {
      type: Number,
      min: [0, 'Discounted price cannot be negative'],
    },
    currency: {
      type: String,
      default: 'USD',
    },
    isVeg: {
      type: Boolean,
      default: true,
      index: true,
    },
    dietaryTags: [
      {
        type: String,
        trim: true,
      },
    ],
    publishState: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    availabilityStatus: {
      type: String,
      enum: ['available', 'out_of_stock', 'temporarily_unavailable'],
      default: 'available',
      index: true,
    },
    media: {
      primaryImageUrl: { type: String },
      galleryUrls: { type: [String], default: [] },
    },
    nutrition: {
      calories: { type: Number },
      proteinGrams: { type: Number },
      carbsGrams: { type: Number },
      fatGrams: { type: Number },
      allergens: { type: [String], default: [] },
      ingredients: { type: [String], default: [] },
    },
    availability: {
      availableDays: {
        type: [String],
        default: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      },
      timeWindow: {
        startTime: { type: String },
        endTime: { type: String },
      },
      isAvailableAllDay: { type: Boolean, default: true },
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
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

menuItemSchema.index({ categoryId: 1, displayOrder: 1, isDeleted: 1 });
menuItemSchema.index({ restaurantId: 1, publishState: 1, isDeleted: 1 });

export const MenuItem = model<IMenuItemDocument>('MenuItem', menuItemSchema);
