import { Types } from 'mongoose';
import { restaurantsRepository, RestaurantsRepository } from './restaurants.repository.js';
import {
  CreateRestaurantDTO,
  UpdateRestaurantDTO,
  CreateBranchDTO,
  UpdateBranchDTO,
  UpdateHoursDTO,
  UpdateSettingsDTO,
  SubmitVerificationDTO,
  AddStaffAccessDTO,
  UpdateStaffAccessDTO,
  RestaurantSummaryResponse,
} from './restaurants.types.js';
import { calculateRestaurantCompleteness } from './restaurants.utils.js';
import { RESTAURANT_CONSTANTS, RESTAURANT_ERROR_CODES } from './restaurants.constants.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { BadRequestError } from '../../shared/errors/BadRequestError.js';
import { IRestaurantDocument } from './restaurants.model.js';
import { IRestaurantBranchDocument } from './models/restaurantBranch.model.js';
import { IRestaurantHoursDocument } from './models/restaurantHours.model.js';
import { IRestaurantSettingsDocument } from './models/restaurantSettings.model.js';
import { IRestaurantVerificationDocument } from './models/restaurantVerification.model.js';
import { IRestaurantStaffAccessDocument } from './models/restaurantStaffAccess.model.js';
import { logger } from '../../shared/utils/logger.js';

export class RestaurantsService {
  constructor(private repo: RestaurantsRepository = restaurantsRepository) {}

  async createRestaurant(ownerUserId: string, dto: CreateRestaurantDTO): Promise<IRestaurantDocument> {
    const restaurant = await this.repo.createRestaurant({
      ownerUserId: new Types.ObjectId(ownerUserId),
      ...dto,
      serviceModes: {
        dineIn: dto.serviceModes?.dineIn ?? true,
        takeaway: dto.serviceModes?.takeaway ?? true,
        delivery: dto.serviceModes?.delivery ?? true,
        pickup: dto.serviceModes?.pickup ?? true,
      },
    });

    const restaurantId = restaurant._id.toString();

    // Auto-create Main Branch
    await this.repo.createBranch({
      restaurantId: new Types.ObjectId(restaurantId),
      branchName: `${dto.restaurantName} (Main Branch)`,
      branchCode: 'MAIN-01',
      phone: dto.phone,
      email: dto.email,
      address: dto.address,
      city: dto.city,
      state: dto.state,
      country: dto.country || 'US',
      isMainBranch: true,
      status: 'active',
    });

    // Auto-initialize Default Hours & Settings & Verification
    await this.repo.upsertHours(restaurantId, { restaurantId: new Types.ObjectId(restaurantId) });
    await this.repo.upsertSettings(restaurantId, { restaurantId: new Types.ObjectId(restaurantId) });
    await this.repo.upsertVerification(restaurantId, { restaurantId: new Types.ObjectId(restaurantId), status: 'unverified' });

    // Recalculate Completeness
    const completeness = calculateRestaurantCompleteness(restaurant, 1, true, false);
    restaurant.profileCompleteness = completeness.score;
    await restaurant.save();

    logger.info({ restaurantId, ownerUserId }, '🏪 Restaurant workspace created successfully');
    return restaurant;
  }

  async getRestaurant(restaurantId: string): Promise<IRestaurantDocument> {
    const restaurant = await this.repo.findRestaurantById(restaurantId);
    if (!restaurant) {
      throw new NotFoundError('Restaurant not found', RESTAURANT_ERROR_CODES.RESTAURANT_NOT_FOUND);
    }
    return restaurant;
  }

  async listRestaurants(ownerUserId?: string, query: Record<string, unknown> = {}): Promise<IRestaurantDocument[]> {
    if (ownerUserId) {
      return this.repo.findRestaurantsByOwner(ownerUserId);
    }
    return this.repo.listRestaurants(query);
  }

  async updateRestaurant(restaurantId: string, dto: UpdateRestaurantDTO): Promise<IRestaurantDocument> {
    await this.getRestaurant(restaurantId);

    const updateData: Record<string, unknown> = { ...dto };
    if (dto.serviceModes) {
      delete updateData.serviceModes;
      if (dto.serviceModes.dineIn !== undefined) updateData['serviceModes.dineIn'] = dto.serviceModes.dineIn;
      if (dto.serviceModes.takeaway !== undefined) updateData['serviceModes.takeaway'] = dto.serviceModes.takeaway;
      if (dto.serviceModes.delivery !== undefined) updateData['serviceModes.delivery'] = dto.serviceModes.delivery;
      if (dto.serviceModes.pickup !== undefined) updateData['serviceModes.pickup'] = dto.serviceModes.pickup;
    }

    const updated = await this.repo.updateRestaurant(restaurantId, updateData as Partial<IRestaurantDocument>);
    if (!updated) {
      throw new NotFoundError('Failed to update restaurant', RESTAURANT_ERROR_CODES.RESTAURANT_NOT_FOUND);
    }

    const branchCount = await this.repo.countRestaurantBranches(restaurantId);
    const hours = await this.repo.getHours(restaurantId);
    const verification = await this.repo.getVerification(restaurantId);
    const isVerifiedSubmitted = verification?.status === 'pending_review' || verification?.status === 'verified';

    const completeness = calculateRestaurantCompleteness(updated, branchCount, !!hours, isVerifiedSubmitted);
    updated.profileCompleteness = completeness.score;
    await updated.save();

    logger.info({ restaurantId }, '✏️ Restaurant workspace updated');
    return updated;
  }

  async deleteRestaurant(restaurantId: string): Promise<{ success: boolean }> {
    const success = await this.repo.softDeleteRestaurant(restaurantId);
    if (!success) {
      throw new NotFoundError('Restaurant not found', RESTAURANT_ERROR_CODES.RESTAURANT_NOT_FOUND);
    }
    logger.info({ restaurantId }, '🗑️ Restaurant workspace soft-deleted');
    return { success: true };
  }

  async getSummary(restaurantId: string): Promise<RestaurantSummaryResponse> {
    const restaurant = await this.getRestaurant(restaurantId);
    const branchCount = await this.repo.countRestaurantBranches(restaurantId);
    const activeBranchCount = await this.repo.countActiveBranches(restaurantId);
    const activeStaffCount = await this.repo.countActiveStaff(restaurantId);
    const hours = await this.repo.getHours(restaurantId);
    const settings = await this.repo.getSettings(restaurantId);
    const verification = await this.repo.getVerification(restaurantId);

    const isVerifiedSubmitted = verification?.status === 'pending_review' || verification?.status === 'verified';
    const completeness = calculateRestaurantCompleteness(restaurant, branchCount, !!hours, isVerifiedSubmitted);

    let readinessStatus: RestaurantSummaryResponse['readinessStatus'] = 'ready';
    if (restaurant.verificationStatus === 'unverified' || restaurant.verificationStatus === 'rejected') {
      readinessStatus = 'pending_verification';
    } else if (completeness.score < 80 || activeBranchCount === 0) {
      readinessStatus = 'incomplete_setup';
    }

    return {
      restaurantId: restaurant._id.toString(),
      restaurantName: restaurant.restaurantName,
      verificationStatus: restaurant.verificationStatus,
      accountStatus: restaurant.accountStatus,
      operationalStatus: restaurant.operationalStatus,
      profileCompleteness: completeness.score,
      readinessStatus,
      stats: {
        totalBranchesCount: branchCount,
        activeBranchesCount: activeBranchCount,
        activeStaffCount,
        prepTimeMinutes: settings?.orderSettings?.prepTimeMinutes || RESTAURANT_CONSTANTS.DEFAULT_PREP_TIME_MINUTES,
      },
      missingSetupItems: completeness.missingItems,
      createdAt: restaurant.createdAt,
    };
  }

  // --- Branch Management ---
  async getBranches(restaurantId: string): Promise<IRestaurantBranchDocument[]> {
    return this.repo.getBranches(restaurantId);
  }

  async createBranch(restaurantId: string, dto: CreateBranchDTO): Promise<IRestaurantBranchDocument> {
    const branchCount = await this.repo.countRestaurantBranches(restaurantId);
    if (branchCount >= RESTAURANT_CONSTANTS.MAX_BRANCHES_PER_RESTAURANT) {
      throw new BadRequestError(
        `Maximum limit of ${RESTAURANT_CONSTANTS.MAX_BRANCHES_PER_RESTAURANT} branches reached`,
        RESTAURANT_ERROR_CODES.MAX_BRANCHES_EXCEEDED
      );
    }

    if (dto.isMainBranch) {
      await this.repo.unsetMainBranchFlags(restaurantId);
    }

    const branchData: Partial<IRestaurantBranchDocument> = {
      restaurantId: new Types.ObjectId(restaurantId),
      branchName: dto.branchName,
      branchCode: dto.branchCode.toUpperCase(),
      branchManagerId: dto.branchManagerId ? new Types.ObjectId(dto.branchManagerId) : undefined,
      phone: dto.phone,
      email: dto.email,
      address: dto.address,
      city: dto.city,
      state: dto.state,
      country: dto.country || 'US',
      isMainBranch: dto.isMainBranch || false,
      status: 'active',
    };

    if (dto.latitude !== undefined && dto.longitude !== undefined) {
      branchData.location = {
        type: 'Point',
        coordinates: [dto.longitude, dto.latitude],
      };
    }

    const branch = await this.repo.createBranch(branchData);
    logger.info({ restaurantId, branchId: branch._id.toString() }, '🏢 New branch created');
    return branch;
  }

  async updateBranch(branchId: string, restaurantId: string, dto: UpdateBranchDTO): Promise<IRestaurantBranchDocument> {
    const existing = await this.repo.findBranchById(branchId);
    if (!existing || existing.restaurantId.toString() !== restaurantId) {
      throw new NotFoundError('Branch not found', RESTAURANT_ERROR_CODES.BRANCH_NOT_FOUND);
    }

    if (dto.isMainBranch) {
      await this.repo.unsetMainBranchFlags(restaurantId);
    }

    const updateData: Record<string, unknown> = { ...dto };
    if (dto.branchManagerId) {
      updateData.branchManagerId = new Types.ObjectId(dto.branchManagerId);
    }
    if (dto.latitude !== undefined && dto.longitude !== undefined) {
      updateData.location = {
        type: 'Point',
        coordinates: [dto.longitude, dto.latitude],
      };
    }

    const updated = await this.repo.updateBranch(branchId, restaurantId, updateData as Partial<IRestaurantBranchDocument>);
    if (!updated) {
      throw new NotFoundError('Branch update failed', RESTAURANT_ERROR_CODES.BRANCH_NOT_FOUND);
    }
    return updated;
  }

  async deleteBranch(branchId: string, restaurantId: string): Promise<{ success: boolean }> {
    const success = await this.repo.softDeleteBranch(branchId, restaurantId);
    if (!success) {
      throw new NotFoundError('Branch not found', RESTAURANT_ERROR_CODES.BRANCH_NOT_FOUND);
    }
    return { success: true };
  }

  // --- Hours & Schedule Management ---
  async getHours(restaurantId: string): Promise<IRestaurantHoursDocument> {
    let hours = await this.repo.getHours(restaurantId);
    if (!hours) {
      hours = await this.repo.upsertHours(restaurantId, { restaurantId: new Types.ObjectId(restaurantId) });
    }
    return hours;
  }

  async updateHours(restaurantId: string, dto: UpdateHoursDTO): Promise<IRestaurantHoursDocument> {
    return this.repo.upsertHours(restaurantId, {
      restaurantId: new Types.ObjectId(restaurantId),
      ...dto,
    });
  }

  // --- Settings Management ---
  async getSettings(restaurantId: string): Promise<IRestaurantSettingsDocument> {
    let settings = await this.repo.getSettings(restaurantId);
    if (!settings) {
      settings = await this.repo.upsertSettings(restaurantId, { restaurantId: new Types.ObjectId(restaurantId) });
    }
    return settings;
  }

  async updateSettings(restaurantId: string, dto: UpdateSettingsDTO): Promise<IRestaurantSettingsDocument> {
    const updateData: Record<string, unknown> = {};
    if (dto.orderSettings) {
      if (dto.orderSettings.autoAcceptOrders !== undefined) updateData['orderSettings.autoAcceptOrders'] = dto.orderSettings.autoAcceptOrders;
      if (dto.orderSettings.prepTimeMinutes !== undefined) updateData['orderSettings.prepTimeMinutes'] = dto.orderSettings.prepTimeMinutes;
      if (dto.orderSettings.minOrderValue !== undefined) updateData['orderSettings.minOrderValue'] = dto.orderSettings.minOrderValue;
    }
    if (dto.notificationSettings) {
      if (dto.notificationSettings.newOrderEmail !== undefined) updateData['notificationSettings.newOrderEmail'] = dto.notificationSettings.newOrderEmail;
      if (dto.notificationSettings.newOrderPush !== undefined) updateData['notificationSettings.newOrderPush'] = dto.notificationSettings.newOrderPush;
      if (dto.notificationSettings.newOrderSms !== undefined) updateData['notificationSettings.newOrderSms'] = dto.notificationSettings.newOrderSms;
    }
    if (dto.serviceToggles) {
      if (dto.serviceToggles.allowDineIn !== undefined) updateData['serviceToggles.allowDineIn'] = dto.serviceToggles.allowDineIn;
      if (dto.serviceToggles.allowTakeaway !== undefined) updateData['serviceToggles.allowTakeaway'] = dto.serviceToggles.allowTakeaway;
      if (dto.serviceToggles.allowDelivery !== undefined) updateData['serviceToggles.allowDelivery'] = dto.serviceToggles.allowDelivery;
      if (dto.serviceToggles.allowPickup !== undefined) updateData['serviceToggles.allowPickup'] = dto.serviceToggles.allowPickup;
      if (dto.serviceToggles.pauseOrders !== undefined) updateData['serviceToggles.pauseOrders'] = dto.serviceToggles.pauseOrders;
    }

    return this.repo.upsertSettings(restaurantId, updateData as Partial<IRestaurantSettingsDocument>);
  }

  // --- Verification Management ---
  async getVerification(restaurantId: string): Promise<IRestaurantVerificationDocument> {
    let verification = await this.repo.getVerification(restaurantId);
    if (!verification) {
      verification = await this.repo.upsertVerification(restaurantId, {
        restaurantId: new Types.ObjectId(restaurantId),
        status: 'unverified',
      });
    }
    return verification;
  }

  async submitVerification(restaurantId: string, dto: SubmitVerificationDTO): Promise<IRestaurantVerificationDocument> {
    const verification = await this.repo.upsertVerification(restaurantId, {
      restaurantId: new Types.ObjectId(restaurantId),
      ...dto,
      status: 'pending_review',
      submittedAt: new Date(),
    });

    await this.repo.updateRestaurant(restaurantId, { verificationStatus: 'pending_review' });

    logger.info({ restaurantId }, '📄 Business verification documents submitted for admin review');
    return verification;
  }

  // --- Staff Access Control ---
  async getStaffAccessList(restaurantId: string): Promise<IRestaurantStaffAccessDocument[]> {
    return this.repo.getStaffAccessList(restaurantId);
  }

  async addStaffAccess(restaurantId: string, invitedByUserId: string, dto: AddStaffAccessDTO): Promise<IRestaurantStaffAccessDocument> {
    const existing = await this.repo.findStaffAccess(restaurantId, dto.userId);
    if (existing) {
      throw new BadRequestError('User already has active staff access for this restaurant', RESTAURANT_ERROR_CODES.STAFF_ALREADY_EXISTS);
    }

    return this.repo.createStaffAccess({
      restaurantId: new Types.ObjectId(restaurantId),
      userId: new Types.ObjectId(dto.userId),
      branchId: dto.branchId ? new Types.ObjectId(dto.branchId) : undefined,
      role: dto.role,
      assignedPermissions: dto.assignedPermissions || [],
      isActive: true,
      invitedBy: new Types.ObjectId(invitedByUserId),
    });
  }

  async updateStaffAccess(accessId: string, restaurantId: string, dto: UpdateStaffAccessDTO): Promise<IRestaurantStaffAccessDocument> {
    const updateData: Record<string, unknown> = { ...dto };
    if (dto.branchId) {
      updateData.branchId = new Types.ObjectId(dto.branchId);
    }

    const updated = await this.repo.updateStaffAccess(accessId, restaurantId, updateData as Partial<IRestaurantStaffAccessDocument>);
    if (!updated) {
      throw new NotFoundError('Staff access record not found', RESTAURANT_ERROR_CODES.STAFF_ACCESS_NOT_FOUND);
    }
    return updated;
  }

  async deleteStaffAccess(accessId: string, restaurantId: string): Promise<{ success: boolean }> {
    const success = await this.repo.deleteStaffAccess(accessId, restaurantId);
    if (!success) {
      throw new NotFoundError('Staff access record not found', RESTAURANT_ERROR_CODES.STAFF_ACCESS_NOT_FOUND);
    }
    return { success: true };
  }
}

export const restaurantsService = new RestaurantsService();
