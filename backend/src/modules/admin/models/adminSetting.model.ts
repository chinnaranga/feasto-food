import mongoose, { Schema, Document } from 'mongoose';
import { IAdminSetting } from '../admin.types.js';
import { SETTING_CATEGORIES } from '../admin.constants.js';

export interface AdminSettingDocument extends Omit<IAdminSetting, '_id'>, Document {}

const AdminSettingSchema = new Schema<AdminSettingDocument>(
  {
    settingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    category: {
      type: String,
      enum: SETTING_CATEGORIES,
      required: true,
      index: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    description: {
      type: String,
    },
    updatedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const AdminSettingModel = mongoose.model<AdminSettingDocument>('AdminSetting', AdminSettingSchema);
