import mongoose, { Schema, Document } from 'mongoose';
import { IAdminStaffAccess } from '../admin.types.js';
import { ADMIN_ROLES } from '../admin.constants.js';

export interface AdminStaffAccessDocument extends Omit<IAdminStaffAccess, '_id'>, Document {}

const AdminStaffAccessSchema = new Schema<AdminStaffAccessDocument>(
  {
    accessId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    role: {
      type: String,
      enum: ADMIN_ROLES,
      required: true,
      default: 'admin',
    },
    permissions: [
      {
        type: String,
      },
    ],
    isSuspended: {
      type: Boolean,
      default: false,
    },
    grantedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const AdminStaffAccessModel = mongoose.model<AdminStaffAccessDocument>(
  'AdminStaffAccess',
  AdminStaffAccessSchema
);
