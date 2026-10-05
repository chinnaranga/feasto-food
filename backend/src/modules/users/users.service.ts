import { Types } from 'mongoose';
import { usersRepository, UsersRepository } from './users.repository.js';
import {
  UpdateProfileDTO,
  CreateAddressDTO,
  UpdateAddressDTO,
  AddFavoriteDTO,
  UpdatePreferencesDTO,
  UserSummaryResponse,
} from './users.types.js';
import { calculateProfileCompleteness } from './users.utils.js';
import { USER_CONSTANTS, USER_ERROR_CODES } from './users.constants.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { BadRequestError } from '../../shared/errors/BadRequestError.js';
import { ForbiddenError } from '../../shared/errors/ForbiddenError.js';
import { IUserDocument } from './user.model.js';
import { IAddressDocument } from './models/address.model.js';
import { IFavoriteDocument, FavoriteEntityType } from './models/favorite.model.js';
import { IUserPreferencesDocument } from './models/userPreferences.model.js';
import { Session } from '../auth/models/session.model.js';
import { UserRole } from '../../shared/constants/roles.js';
import { logger } from '../../shared/utils/logger.js';

export class UsersService {
  constructor(private repo: UsersRepository = usersRepository) {}

  async getProfile(userId: string): Promise<IUserDocument> {
    const user = await this.repo.findUserById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found', USER_ERROR_CODES.USER_NOT_FOUND);
    }
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDTO): Promise<IUserDocument> {
    const user = await this.repo.findUserById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found', USER_ERROR_CODES.USER_NOT_FOUND);
    }

    const updatedUser = await this.repo.updateUserProfile(userId, dto);
    if (!updatedUser) {
      throw new NotFoundError('Failed to update user profile', USER_ERROR_CODES.USER_NOT_FOUND);
    }

    // Recalculate profile completeness
    const addressCount = await this.repo.countUserAddresses(userId);
    const prefs = await this.repo.getUserPreferences(userId);
    const completeness = calculateProfileCompleteness(updatedUser, addressCount, !!prefs);

    updatedUser.profileCompleteness = completeness.score;
    await updatedUser.save();

    logger.info({ userId }, '👤 User profile updated successfully');
    return updatedUser;
  }

  async getUserSummary(userId: string): Promise<UserSummaryResponse> {
    const user = await this.getProfile(userId);
    const addressCount = await this.repo.countUserAddresses(userId);
    const favoritesCount = await this.repo.countUserFavorites(userId);
    const prefs = await this.repo.getUserPreferences(userId);

    const activeSessionsCount = await Session.countDocuments({
      userId: new Types.ObjectId(userId),
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    });

    const completeness = calculateProfileCompleteness(user, addressCount, !!prefs);

    let healthStatus: UserSummaryResponse['healthStatus'] = 'excellent';
    if (completeness.score < 50 || !user.verificationStatus.emailVerified) {
      healthStatus = 'action_required';
    } else if (completeness.score < 80) {
      healthStatus = 'good';
    }

    return {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      accountStatus: user.accountStatus,
      verificationStatus: user.verificationStatus,
      profileCompleteness: completeness.score,
      healthStatus,
      stats: {
        activeSessionsCount,
        savedAddressesCount: addressCount,
        favoritesCount,
        trustedDevicesCount: user.trustedDevices?.length || 0,
      },
      missingProfileFields: completeness.missingFields,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }

  async getUserById(targetUserId: string, requesterRole: UserRole, requesterId: string): Promise<IUserDocument> {
    if (requesterId !== targetUserId && requesterRole !== UserRole.ADMIN && requesterRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenError('You do not have permission to view this user profile', USER_ERROR_CODES.UNAUTHORIZED_USER_ACTION);
    }
    return this.getProfile(targetUserId);
  }

  async deleteUser(targetUserId: string, requesterRole: UserRole, requesterId: string): Promise<{ success: boolean }> {
    if (requesterId !== targetUserId && requesterRole !== UserRole.ADMIN && requesterRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenError('You do not have permission to delete this account', USER_ERROR_CODES.UNAUTHORIZED_USER_ACTION);
    }
    const success = await this.repo.softDeleteUser(targetUserId);
    if (!success) {
      throw new NotFoundError('User account not found', USER_ERROR_CODES.USER_NOT_FOUND);
    }
    logger.info({ targetUserId, requesterId }, '🗑️ User account soft-deleted');
    return { success: true };
  }

  // --- Address Management ---
  async getAddresses(userId: string): Promise<IAddressDocument[]> {
    return this.repo.getUserAddresses(userId);
  }

  async addAddress(userId: string, dto: CreateAddressDTO): Promise<IAddressDocument> {
    const addressCount = await this.repo.countUserAddresses(userId);
    if (addressCount >= USER_CONSTANTS.MAX_ADDRESSES_PER_USER) {
      throw new BadRequestError(
        `Maximum limit of ${USER_CONSTANTS.MAX_ADDRESSES_PER_USER} addresses reached`,
        USER_ERROR_CODES.MAX_ADDRESSES_EXCEEDED
      );
    }

    const isFirstAddress = addressCount === 0;
    const shouldBeDefault = dto.isDefault || isFirstAddress;

    if (shouldBeDefault) {
      await this.repo.unsetDefaultAddresses(userId);
    }

    const addressData: Partial<IAddressDocument> = {
      userId: new Types.ObjectId(userId),
      label: dto.label,
      street: dto.street,
      building: dto.building,
      floor: dto.floor,
      apartment: dto.apartment,
      city: dto.city,
      state: dto.state,
      zipCode: dto.zipCode,
      country: dto.country || 'US',
      isDefault: shouldBeDefault,
      deliveryInstructions: dto.deliveryInstructions,
    };

    if (dto.latitude !== undefined && dto.longitude !== undefined) {
      addressData.location = {
        type: 'Point',
        coordinates: [dto.longitude, dto.latitude],
      };
    }

    const newAddress = await this.repo.createAddress(addressData);
    logger.info({ userId, addressId: newAddress._id.toString() }, '📍 New address added');
    return newAddress;
  }

  async updateAddress(addressId: string, userId: string, dto: UpdateAddressDTO): Promise<IAddressDocument> {
    const existing = await this.repo.findAddressById(addressId);
    if (!existing || existing.userId.toString() !== userId) {
      throw new NotFoundError('Address not found', USER_ERROR_CODES.ADDRESS_NOT_FOUND);
    }

    if (dto.isDefault) {
      await this.repo.unsetDefaultAddresses(userId);
    }

    const updateData: Partial<IAddressDocument> = { ...dto };
    if (dto.latitude !== undefined && dto.longitude !== undefined) {
      updateData.location = {
        type: 'Point',
        coordinates: [dto.longitude, dto.latitude],
      };
    }

    const updated = await this.repo.updateAddress(addressId, userId, updateData);
    if (!updated) {
      throw new NotFoundError('Address update failed', USER_ERROR_CODES.ADDRESS_NOT_FOUND);
    }
    return updated;
  }

  async deleteAddress(addressId: string, userId: string): Promise<{ success: boolean }> {
    const success = await this.repo.softDeleteAddress(addressId, userId);
    if (!success) {
      throw new NotFoundError('Address not found', USER_ERROR_CODES.ADDRESS_NOT_FOUND);
    }
    logger.info({ userId, addressId }, '📍 Address deleted');
    return { success: true };
  }

  // --- Favorites Management ---
  async getFavorites(userId: string, entityType?: FavoriteEntityType): Promise<IFavoriteDocument[]> {
    return this.repo.getUserFavorites(userId, entityType);
  }

  async addFavorite(userId: string, dto: AddFavoriteDTO): Promise<IFavoriteDocument> {
    const count = await this.repo.countUserFavorites(userId);
    if (count >= USER_CONSTANTS.MAX_FAVORITES_PER_USER) {
      throw new BadRequestError(`Maximum limit of ${USER_CONSTANTS.MAX_FAVORITES_PER_USER} favorites reached`);
    }

    const existing = await this.repo.findFavorite(userId, dto.entityType, dto.entityId);
    if (existing) {
      throw new BadRequestError('Item is already in your favorites', USER_ERROR_CODES.FAVORITE_ALREADY_EXISTS);
    }

    return this.repo.addFavorite({
      userId: new Types.ObjectId(userId),
      entityType: dto.entityType,
      entityId: dto.entityId,
      metadata: dto.metadata,
    });
  }

  async removeFavorite(favoriteId: string, userId: string): Promise<{ success: boolean }> {
    const success = await this.repo.removeFavorite(favoriteId, userId);
    if (!success) {
      throw new NotFoundError('Favorite item not found', USER_ERROR_CODES.FAVORITE_NOT_FOUND);
    }
    return { success: true };
  }

  // --- Preferences Management ---
  async getPreferences(userId: string): Promise<IUserPreferencesDocument> {
    let prefs = await this.repo.getUserPreferences(userId);
    if (!prefs) {
      prefs = await this.repo.upsertUserPreferences(userId, {
        userId: new Types.ObjectId(userId),
        notifications: { email: true, push: true, sms: true, marketing: false },
        privacy: { showProfilePhoto: true, allowDataAnalytics: true },
        accessibility: { highContrast: false, screenReader: false },
        dietary: [],
      });
    }
    return prefs;
  }

  async updatePreferences(userId: string, dto: UpdatePreferencesDTO): Promise<IUserPreferencesDocument> {
    return this.repo.upsertUserPreferences(userId, {
      userId: new Types.ObjectId(userId),
      ...dto,
    });
  }

  // --- Device & Session Management ---
  async getUserDevices(userId: string) {
    const sessions = await Session.find({
      userId: new Types.ObjectId(userId),
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    })
      .sort({ lastActiveAt: -1 })
      .exec();

    return sessions.map((s) => ({
      deviceId: s.sessionId,
      deviceName: s.deviceName || 'Unknown Device',
      browser: s.browser || 'Unknown Browser',
      ipAddress: s.ipAddress,
      lastActiveAt: s.lastActiveAt,
      trustedDevice: s.trustedDevice,
    }));
  }

  async revokeDevice(userId: string, deviceId: string): Promise<{ success: boolean }> {
    const session = await Session.findOneAndUpdate(
      { sessionId: deviceId, userId: new Types.ObjectId(userId) },
      { $set: { isRevoked: true } }
    ).exec();

    if (!session) {
      throw new NotFoundError('Device session not found');
    }
    return { success: true };
  }
}

export const usersService = new UsersService();
