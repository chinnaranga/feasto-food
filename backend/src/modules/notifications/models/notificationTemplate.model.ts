import mongoose, { Schema, Document } from 'mongoose';
import { INotificationTemplate } from '../notifications.types.js';

export interface NotificationTemplateDocument extends Omit<INotificationTemplate, '_id'>, Document {}

const NotificationTemplateSchema = new Schema<NotificationTemplateDocument>(
  {
    templateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      index: true,
    },
    version: {
      type: String,
      required: true,
      default: '1.0',
    },
    locale: {
      type: String,
      required: true,
      default: 'en-IN',
      index: true,
    },
    titleTemplate: {
      type: String,
      required: true,
    },
    bodyTemplate: {
      type: String,
      required: true,
    },
    emailSubjectTemplate: {
      type: String,
    },
    emailHtmlTemplate: {
      type: String,
    },
    smsTextTemplate: {
      type: String,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

NotificationTemplateSchema.index({ type: 1, locale: 1 }, { unique: true });

export const NotificationTemplateModel = mongoose.model<NotificationTemplateDocument>(
  'NotificationTemplate',
  NotificationTemplateSchema
);
