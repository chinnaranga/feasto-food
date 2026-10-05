import { Schema, model, Document, Types } from 'mongoose';

export type RestaurantStaffRole =
  | 'restaurant_owner'
  | 'restaurant_manager'
  | 'kitchen_staff'
  | 'cashier'
  | 'inventory_manager';

export interface IRestaurantStaffAccessDocument extends Document {
  restaurantId: Types.ObjectId;
  branchId?: Types.ObjectId;
  userId: Types.ObjectId;
  role: RestaurantStaffRole;
  assignedPermissions: string[];
  isActive: boolean;
  invitedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const restaurantStaffAccessSchema = new Schema<IRestaurantStaffAccessDocument>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: 'RestaurantBranch',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: [
        'restaurant_owner',
        'restaurant_manager',
        'kitchen_staff',
        'cashier',
        'inventory_manager',
      ],
      required: true,
    },
    assignedPermissions: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

restaurantStaffAccessSchema.index({ restaurantId: 1, userId: 1 }, { unique: true });

export const RestaurantStaffAccess = model<IRestaurantStaffAccessDocument>(
  'RestaurantStaffAccess',
  restaurantStaffAccessSchema
);
