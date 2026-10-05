import mongoose, { Schema, Document } from 'mongoose';
import { IAdminAuditLog } from '../admin.types.js';

export interface AdminAuditLogDocument extends Omit<IAdminAuditLog, '_id'>, Document {}

const AdminAuditLogSchema = new Schema<AdminAuditLogDocument>(
  {
    auditId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    actorUserId: {
      type: String,
      required: true,
      index: true,
    },
    actorRole: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      required: true,
      index: true,
    },
    entityId: {
      type: String,
      required: true,
      index: true,
    },
    previousState: {
      type: Schema.Types.Mixed,
    },
    newState: {
      type: Schema.Types.Mixed,
    },
    reason: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    requestId: {
      type: String,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AdminAuditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

export const AdminAuditLogModel = mongoose.model<AdminAuditLogDocument>(
  'AdminAuditLog',
  AdminAuditLogSchema
);
