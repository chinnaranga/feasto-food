import mongoose, { Schema, Document } from 'mongoose';
import { IDispatchConfig } from '../dispatch.types.js';
import { DEFAULT_DISPATCH_CONFIG } from '../dispatch.constants.js';

export interface DispatchConfigDocument extends Omit<IDispatchConfig, '_id'>, Document {}

const DispatchConfigSchema = new Schema<DispatchConfigDocument>(
  {
    configKey: {
      type: String,
      required: true,
      unique: true,
      default: 'default',
      index: true,
    },
    maxDispatchRadiusKm: {
      type: Number,
      default: DEFAULT_DISPATCH_CONFIG.maxDispatchRadiusKm,
    },
    offerTimeoutSeconds: {
      type: Number,
      default: DEFAULT_DISPATCH_CONFIG.offerTimeoutSeconds,
    },
    maxAssignmentAttempts: {
      type: Number,
      default: DEFAULT_DISPATCH_CONFIG.maxAssignmentAttempts,
    },
    maxActiveDeliveriesPerRider: {
      type: Number,
      default: DEFAULT_DISPATCH_CONFIG.maxActiveDeliveriesPerRider,
    },
    locationFreshnessThresholdSeconds: {
      type: Number,
      default: DEFAULT_DISPATCH_CONFIG.locationFreshnessThresholdSeconds,
    },
    minimumRiderScore: {
      type: Number,
      default: DEFAULT_DISPATCH_CONFIG.minimumRiderScore,
    },
    retryDelaySeconds: {
      type: Number,
      default: DEFAULT_DISPATCH_CONFIG.retryDelaySeconds,
    },
    priorityMultiplier: {
      type: Number,
      default: DEFAULT_DISPATCH_CONFIG.priorityMultiplier,
    },
  },
  { timestamps: true }
);

export const DispatchConfigModel = mongoose.model<DispatchConfigDocument>(
  'DispatchConfig',
  DispatchConfigSchema
);
