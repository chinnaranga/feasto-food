import mongoose, { Schema, Document } from 'mongoose';
import { INotification } from '../notifications.types.js';
import {
  NOTIFICATION_CHANNELS,
  NOTIFICATION_PRIORITIES,
  NOTIFICATION_STATUSES,
  NOTIFICATION_CATEGORIES,
} from '../notifications.constants.js';

export interface NotificationDocument extends Omit<INotification, '_id'>, Document {}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    notificationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    recipientUserId: {
      type: String,
      required: true,
      index: true,
    },
    actorUserId: {
      type: String,
      index: true,
    },
    type: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: NOTIFICATION_CATEGORIES,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
    },
    channel: {
      type: String,
      enum: NOTIFICATION_CHANNELS,
      required: true,
      default: 'IN_APP',
    },
    priority: {
      type: String,
      enum: NOTIFICATION_PRIORITIES,
      required: true,
      default: 'NORMAL',
    },
    status: {
      type: String,
      enum: NOTIFICATION_STATUSES,
      required: true,
      default: 'QUEUED',
      index: true,
    },
    readAt: {
      type: Date,
      index: true,
    },
    sentAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    failedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      index: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    templateId: {
      type: String,
    },
    templateVersion: {
      type: String,
    },
    entityType: {
      type: String,
      index: true,
    },
    entityId: {
      type: String,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ recipientUserId: 1, isArchived: 1, createdAt: -1 });
NotificationSchema.index({ recipientUserId: 1, readAt: 1 });

export const NotificationModel = mongoose.model<NotificationDocument>('Notification', NotificationSchema);
