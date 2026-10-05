import { DispatchJobModel, DispatchJobDocument } from './models/dispatchJob.model.js';
import { DeliveryOfferModel, DeliveryOfferDocument } from './models/deliveryOffer.model.js';
import { DeliveryAssignmentModel, DeliveryAssignmentDocument } from './models/deliveryAssignment.model.js';
import { DispatchAttemptModel, DispatchAttemptDocument } from './models/dispatchAttempt.model.js';
import { DispatchConfigModel, DispatchConfigDocument } from './models/dispatchConfig.model.js';
import { DispatchEventModel, DispatchEventDocument } from './models/dispatchEvent.model.js';
import { DEFAULT_DISPATCH_CONFIG } from './dispatch.constants.js';
import {
  IDispatchJob,
  IDispatchAttempt,
  IDispatchConfig,
  IDispatchEvent,
} from './dispatch.types.js';

export class DispatchRepository {
  // JOBS
  async findJobByOrderId(orderId: string): Promise<DispatchJobDocument | null> {
    return DispatchJobModel.findOne({ orderId });
  }

  async createDispatchJob(data: Partial<IDispatchJob>): Promise<DispatchJobDocument> {
    return DispatchJobModel.create(data);
  }

  async updateDispatchJob(jobId: string, updateData: Partial<IDispatchJob>): Promise<DispatchJobDocument | null> {
    return DispatchJobModel.findOneAndUpdate({ jobId }, updateData, { new: true });
  }

  async updateJobStatus(jobId: string, status: string, extraData: Record<string, any> = {}): Promise<DispatchJobDocument | null> {
    return DispatchJobModel.findOneAndUpdate(
      { jobId },
      { status, ...extraData },
      { new: true }
    );
  }

  // ATTEMPTS
  async createAttempt(data: Partial<IDispatchAttempt>): Promise<DispatchAttemptDocument> {
    return DispatchAttemptModel.create(data);
  }

  async recordAttempt(data: Partial<IDispatchAttempt>): Promise<DispatchAttemptDocument> {
    return DispatchAttemptModel.create(data);
  }

  async findAttemptsByOrderId(orderId: string): Promise<DispatchAttemptDocument[]> {
    return DispatchAttemptModel.find({ orderId }).sort({ createdAt: -1 });
  }

  // CONFIG
  async getDispatchConfig(): Promise<DispatchConfigDocument> {
    let config = await DispatchConfigModel.findOne({ configKey: 'default' });
    if (!config) {
      config = await DispatchConfigModel.create({
        configKey: 'default',
        ...DEFAULT_DISPATCH_CONFIG,
      });
    }
    return config;
  }

  async updateDispatchConfig(updateData: Partial<IDispatchConfig>): Promise<DispatchConfigDocument> {
    return DispatchConfigModel.findOneAndUpdate(
      { configKey: 'default' },
      { $set: updateData },
      { new: true, upsert: true }
    );
  }

  // AUDIT EVENTS
  async logDispatchEvent(data: Partial<IDispatchEvent>): Promise<DispatchEventDocument> {
    return DispatchEventModel.create(data);
  }
}

export const dispatchRepository = new DispatchRepository();
