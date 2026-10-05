import { Schema, model, Document, Types } from 'mongoose';

export type MenuType = 'regular' | 'breakfast' | 'lunch' | 'dinner' | 'special';
export type MenuStatus = 'active' | 'inactive' | 'archived';
export type MenuVisibility = 'public' | 'hidden' | 'private';
export type PublishState = 'draft' | 'published' | 'archived';

export interface IMenuDocument extends Document {
  restaurantId: Types.ObjectId;
  branchId?: Types.ObjectId;
  menuName: string;
  menuDescription?: string;
  menuType: MenuType;
  status: MenuStatus;
  visibility: MenuVisibility;
  publishState: PublishState;
  currency: string;
  profileCompleteness: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const menuSchema = new Schema<IMenuDocument>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant ID is required'],
      index: true,
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: 'RestaurantBranch',
    },
    menuName: {
      type: String,
      required: [true, 'Menu name is required'],
      trim: true,
      maxlength: [100, 'Menu name cannot exceed 100 characters'],
    },
    menuDescription: {
      type: String,
      maxlength: [500, 'Menu description cannot exceed 500 characters'],
    },
    menuType: {
      type: String,
      enum: ['regular', 'breakfast', 'lunch', 'dinner', 'special'],
      default: 'regular',
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived'],
      default: 'active',
      index: true,
    },
    visibility: {
      type: String,
      enum: ['public', 'hidden', 'private'],
      default: 'public',
    },
    publishState: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    profileCompleteness: {
      type: Number,
      default: 30,
      min: 0,
      max: 100,
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

menuSchema.index({ restaurantId: 1, isDeleted: 1 });
menuSchema.index({ restaurantId: 1, publishState: 1, isDeleted: 1 });

export const Menu = model<IMenuDocument>('Menu', menuSchema);
