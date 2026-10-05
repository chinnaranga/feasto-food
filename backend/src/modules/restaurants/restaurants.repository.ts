import { Types } from 'mongoose';
import { Restaurant, IRestaurantDocument } from './restaurants.model.js';
import { RestaurantBranch, IRestaurantBranchDocument } from './models/restaurantBranch.model.js';
import { RestaurantHours, IRestaurantHoursDocument } from './models/restaurantHours.model.js';
import { RestaurantSettings, IRestaurantSettingsDocument } from './models/restaurantSettings.model.js';
import { RestaurantVerification, IRestaurantVerificationDocument } from './models/restaurantVerification.model.js';
import { RestaurantStaffAccess, IRestaurantStaffAccessDocument } from './models/restaurantStaffAccess.model.js';

export class RestaurantsRepository {
  // --- Restaurant Workspace Repository ---
  async createRestaurant(restaurantData: Partial<IRestaurantDocument>): Promise<IRestaurantDocument> {
    const restaurant = new Restaurant(restaurantData);
    return restaurant.save();
  }

  async findRestaurantById(restaurantId: string | Types.ObjectId): Promise<IRestaurantDocument | null> {
    return Restaurant.findOne({ _id: restaurantId, isDeleted: false }).exec();
  }

  async findRestaurantsByOwner(ownerUserId: string | Types.ObjectId): Promise<IRestaurantDocument[]> {
    return Restaurant.find({ ownerUserId, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async listRestaurants(query: Record<string, unknown> = {}): Promise<IRestaurantDocument[]> {
    return Restaurant.find({ ...query, isDeleted: false }).sort({ createdAt: -1 }).exec();
  }

  async updateRestaurant(
    restaurantId: string | Types.ObjectId,
    updateData: Partial<IRestaurantDocument>
  ): Promise<IRestaurantDocument | null> {
    return Restaurant.findOneAndUpdate(
      { _id: restaurantId, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  async softDeleteRestaurant(restaurantId: string | Types.ObjectId): Promise<boolean> {
    const result = await Restaurant.findOneAndUpdate(
      { _id: restaurantId, isDeleted: false },
      { $set: { isDeleted: true, accountStatus: 'suspended' } }
    ).exec();
    return result !== null;
  }

  // --- Branch Repository ---
  async countRestaurantBranches(restaurantId: string | Types.ObjectId): Promise<number> {
    return RestaurantBranch.countDocuments({ restaurantId, isDeleted: false }).exec();
  }

  async countActiveBranches(restaurantId: string | Types.ObjectId): Promise<number> {
    return RestaurantBranch.countDocuments({ restaurantId, status: 'active', isDeleted: false }).exec();
  }

  async getBranches(restaurantId: string | Types.ObjectId): Promise<IRestaurantBranchDocument[]> {
    return RestaurantBranch.find({ restaurantId, isDeleted: false }).sort({ isMainBranch: -1, createdAt: -1 }).exec();
  }

  async findBranchById(branchId: string | Types.ObjectId): Promise<IRestaurantBranchDocument | null> {
    return RestaurantBranch.findOne({ _id: branchId, isDeleted: false }).exec();
  }

  async unsetMainBranchFlags(restaurantId: string | Types.ObjectId): Promise<void> {
    await RestaurantBranch.updateMany({ restaurantId, isMainBranch: true }, { $set: { isMainBranch: false } }).exec();
  }

  async createBranch(branchData: Partial<IRestaurantBranchDocument>): Promise<IRestaurantBranchDocument> {
    const branch = new RestaurantBranch(branchData);
    return branch.save();
  }

  async updateBranch(
    branchId: string | Types.ObjectId,
    restaurantId: string | Types.ObjectId,
    updateData: Partial<IRestaurantBranchDocument>
  ): Promise<IRestaurantBranchDocument | null> {
    return RestaurantBranch.findOneAndUpdate(
      { _id: branchId, restaurantId, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  async softDeleteBranch(branchId: string | Types.ObjectId, restaurantId: string | Types.ObjectId): Promise<boolean> {
    const result = await RestaurantBranch.findOneAndUpdate(
      { _id: branchId, restaurantId, isDeleted: false },
      { $set: { isDeleted: true, status: 'inactive' } }
    ).exec();
    return result !== null;
  }

  // --- Hours Repository ---
  async getHours(restaurantId: string | Types.ObjectId): Promise<IRestaurantHoursDocument | null> {
    return RestaurantHours.findOne({ restaurantId }).exec();
  }

  async upsertHours(
    restaurantId: string | Types.ObjectId,
    hoursData: Partial<IRestaurantHoursDocument>
  ): Promise<IRestaurantHoursDocument> {
    return RestaurantHours.findOneAndUpdate(
      { restaurantId },
      { $set: hoursData },
      { new: true, upsert: true, runValidators: true }
    ).exec();
  }

  // --- Settings Repository ---
  async getSettings(restaurantId: string | Types.ObjectId): Promise<IRestaurantSettingsDocument | null> {
    return RestaurantSettings.findOne({ restaurantId }).exec();
  }

  async upsertSettings(
    restaurantId: string | Types.ObjectId,
    settingsData: Partial<IRestaurantSettingsDocument>
  ): Promise<IRestaurantSettingsDocument> {
    return RestaurantSettings.findOneAndUpdate(
      { restaurantId },
      { $set: settingsData },
      { new: true, upsert: true, runValidators: true }
    ).exec();
  }

  // --- Verification Repository ---
  async getVerification(restaurantId: string | Types.ObjectId): Promise<IRestaurantVerificationDocument | null> {
    return RestaurantVerification.findOne({ restaurantId }).exec();
  }

  async upsertVerification(
    restaurantId: string | Types.ObjectId,
    verificationData: Partial<IRestaurantVerificationDocument>
  ): Promise<IRestaurantVerificationDocument> {
    return RestaurantVerification.findOneAndUpdate(
      { restaurantId },
      { $set: verificationData },
      { new: true, upsert: true, runValidators: true }
    ).exec();
  }

  // --- Staff Access Repository ---
  async countActiveStaff(restaurantId: string | Types.ObjectId): Promise<number> {
    return RestaurantStaffAccess.countDocuments({ restaurantId, isActive: true }).exec();
  }

  async getStaffAccessList(restaurantId: string | Types.ObjectId): Promise<IRestaurantStaffAccessDocument[]> {
    return RestaurantStaffAccess.find({ restaurantId, isActive: true })
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findStaffAccess(
    restaurantId: string | Types.ObjectId,
    userId: string | Types.ObjectId
  ): Promise<IRestaurantStaffAccessDocument | null> {
    return RestaurantStaffAccess.findOne({ restaurantId, userId, isActive: true }).exec();
  }

  async createStaffAccess(staffData: Partial<IRestaurantStaffAccessDocument>): Promise<IRestaurantStaffAccessDocument> {
    const staff = new RestaurantStaffAccess(staffData);
    return staff.save();
  }

  async updateStaffAccess(
    accessId: string | Types.ObjectId,
    restaurantId: string | Types.ObjectId,
    updateData: Partial<IRestaurantStaffAccessDocument>
  ): Promise<IRestaurantStaffAccessDocument | null> {
    return RestaurantStaffAccess.findOneAndUpdate(
      { _id: accessId, restaurantId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  async deleteStaffAccess(
    accessId: string | Types.ObjectId,
    restaurantId: string | Types.ObjectId
  ): Promise<boolean> {
    const result = await RestaurantStaffAccess.findOneAndUpdate(
      { _id: accessId, restaurantId },
      { $set: { isActive: false } }
    ).exec();
    return result !== null;
  }
}

export const restaurantsRepository = new RestaurantsRepository();
