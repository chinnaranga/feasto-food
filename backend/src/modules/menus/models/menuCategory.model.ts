import { Schema, model, Document, Types } from 'mongoose';

export interface IMenuCategoryDocument extends Document {
  menuId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  categoryName: string;
  categoryDescription?: string;
  parentCategoryId?: Types.ObjectId;
  displayOrder: number;
  isFeatured: boolean;
  visibility: 'public' | 'hidden';
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const menuCategorySchema = new Schema<IMenuCategoryDocument>(
  {
    menuId: {
      type: Schema.Types.ObjectId,
      ref: 'Menu',
      required: true,
      index: true,
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    categoryName: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    categoryDescription: {
      type: String,
      maxlength: [300, 'Category description cannot exceed 300 characters'],
    },
    parentCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'MenuCategory',
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: String,
      enum: ['public', 'hidden'],
      default: 'public',
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

menuCategorySchema.index({ menuId: 1, displayOrder: 1, isDeleted: 1 });

export const MenuCategory = model<IMenuCategoryDocument>(
  'MenuCategory',
  menuCategorySchema
);
