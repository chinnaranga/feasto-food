import { AdminAuditLogModel, AdminAuditLogDocument } from './models/adminAuditLog.model.js';
import { AdminSettingModel, AdminSettingDocument } from './models/adminSetting.model.js';
import { AdminStaffAccessModel, AdminStaffAccessDocument } from './models/adminStaffAccess.model.js';
import { VerificationReviewModel, VerificationReviewDocument } from './models/verificationReview.model.js';
import { IAdminAuditLog, IAdminSetting, IAdminStaffAccess, IVerificationReview } from './admin.types.js';

export class AdminRepository {
  // AUDIT LOGS
  async createAuditLog(data: Partial<IAdminAuditLog>): Promise<AdminAuditLogDocument> {
    return AdminAuditLogModel.create(data);
  }

  async findAuditLogs(query: Record<string, any> = {}, limit = 50, skip = 0): Promise<AdminAuditLogDocument[]> {
    return AdminAuditLogModel.find(query).sort({ createdAt: -1 }).limit(limit).skip(skip);
  }

  // SETTINGS
  async upsertSetting(key: string, category: any, value: any, updatedBy: string, description?: string): Promise<AdminSettingDocument> {
    return AdminSettingModel.findOneAndUpdate(
      { key },
      { $set: { category, key, value, updatedBy, description } },
      { new: true, upsert: true }
    );
  }

  async findSettings(category?: string): Promise<AdminSettingDocument[]> {
    const query = category ? { category } : {};
    return AdminSettingModel.find(query);
  }

  // STAFF ACCESS
  async createStaffAccess(data: Partial<IAdminStaffAccess>): Promise<AdminStaffAccessDocument> {
    return AdminStaffAccessModel.create(data);
  }

  async findStaffAccessByUserId(userId: string): Promise<AdminStaffAccessDocument | null> {
    return AdminStaffAccessModel.findOne({ userId });
  }

  async findStaffList(limit = 50, skip = 0): Promise<AdminStaffAccessDocument[]> {
    return AdminStaffAccessModel.find({}).sort({ createdAt: -1 }).limit(limit).skip(skip);
  }

  async updateStaffAccess(userId: string, updateData: Partial<IAdminStaffAccess>): Promise<AdminStaffAccessDocument | null> {
    return AdminStaffAccessModel.findOneAndUpdate({ userId }, updateData, { new: true });
  }

  // VERIFICATION REVIEWS
  async createVerificationReview(data: Partial<IVerificationReview>): Promise<VerificationReviewDocument> {
    return VerificationReviewModel.create(data);
  }

  async findVerifications(query: Record<string, any> = {}, limit = 50, skip = 0): Promise<VerificationReviewDocument[]> {
    return VerificationReviewModel.find(query).sort({ createdAt: -1 }).limit(limit).skip(skip);
  }

  async findVerificationById(verificationId: string): Promise<VerificationReviewDocument | null> {
    return VerificationReviewModel.findOne({ verificationId });
  }

  async updateVerification(verificationId: string, updateData: Partial<IVerificationReview>): Promise<VerificationReviewDocument | null> {
    return VerificationReviewModel.findOneAndUpdate({ verificationId }, updateData, { new: true });
  }
}

export const adminRepository = new AdminRepository();
