import { Types } from 'mongoose';
import { User, IUserDocument } from './user.model.js';
import { Address, IAddressDocument } from './models/address.model.js';
import { Favorite, IFavoriteDocument, FavoriteEntityType } from './models/favorite.model.js';
import { UserPreferences, IUserPreferencesDocument } from './models/userPreferences.model.js';

export class UsersRepository {
  // --- User Profile Repository Methods ---
  async findUserById(userId: string | Types.ObjectId): Promise<IUserDocument | null> {
    return User.findOne({ _id: userId, isDeleted: false }).exec();
  }

  async updateUserProfile(
    userId: string | Types.ObjectId,
    updateData: Partial<IUserDocument>
  ): Promise<IUserDocument | null> {
    return User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  async softDeleteUser(userId: string | Types.ObjectId): Promise<boolean> {
    const result = await User.findByIdAndUpdate(userId, {
      $set: { isDeleted: true, accountStatus: 'suspended' },
    }).exec();
    return result !== null;
  }

  // --- Address Repository Methods ---
  async countUserAddresses(userId: string | Types.ObjectId): Promise<number> {
    return Address.countDocuments({ userId, isDeleted: false }).exec();
  }

  async getUserAddresses(userId: string | Types.ObjectId): Promise<IAddressDocument[]> {
    return Address.find({ userId, isDeleted: false }).sort({ isDefault: -1, createdAt: -1 }).exec();
  }

  async findAddressById(addressId: string | Types.ObjectId): Promise<IAddressDocument | null> {
    return Address.findOne({ _id: addressId, isDeleted: false }).exec();
  }

  async unsetDefaultAddresses(userId: string | Types.ObjectId): Promise<void> {
    await Address.updateMany({ userId, isDefault: true }, { $set: { isDefault: false } }).exec();
  }

  async createAddress(addressData: Partial<IAddressDocument>): Promise<IAddressDocument> {
    const address = new Address(addressData);
    return address.save();
  }

  async updateAddress(
    addressId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    updateData: Partial<IAddressDocument>
  ): Promise<IAddressDocument | null> {
    return Address.findOneAndUpdate(
      { _id: addressId, userId, isDeleted: false },
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }

  async softDeleteAddress(addressId: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<boolean> {
    const result = await Address.findOneAndUpdate(
      { _id: addressId, userId, isDeleted: false },
      { $set: { isDeleted: true, isDefault: false } }
    ).exec();
    return result !== null;
  }

  // --- Favorites Repository Methods ---
  async countUserFavorites(userId: string | Types.ObjectId): Promise<number> {
    return Favorite.countDocuments({ userId }).exec();
  }

  async getUserFavorites(
    userId: string | Types.ObjectId,
    entityType?: FavoriteEntityType
  ): Promise<IFavoriteDocument[]> {
    const query: Record<string, unknown> = { userId };
    if (entityType) query.entityType = entityType;
    return Favorite.find(query).sort({ createdAt: -1 }).exec();
  }

  async addFavorite(favoriteData: Partial<IFavoriteDocument>): Promise<IFavoriteDocument> {
    const favorite = new Favorite(favoriteData);
    return favorite.save();
  }

  async removeFavorite(
    favoriteId: string | Types.ObjectId,
    userId: string | Types.ObjectId
  ): Promise<boolean> {
    const result = await Favorite.findOneAndDelete({ _id: favoriteId, userId }).exec();
    return result !== null;
  }

  async findFavorite(
    userId: string | Types.ObjectId,
    entityType: FavoriteEntityType,
    entityId: string
  ): Promise<IFavoriteDocument | null> {
    return Favorite.findOne({ userId, entityType, entityId }).exec();
  }

  // --- User Preferences Repository Methods ---
  async getUserPreferences(userId: string | Types.ObjectId): Promise<IUserPreferencesDocument | null> {
    return UserPreferences.findOne({ userId }).exec();
  }

  async upsertUserPreferences(
    userId: string | Types.ObjectId,
    preferencesData: Partial<IUserPreferencesDocument>
  ): Promise<IUserPreferencesDocument> {
    return UserPreferences.findOneAndUpdate(
      { userId },
      { $set: preferencesData },
      { new: true, upsert: true, runValidators: true }
    ).exec();
  }
}

export const usersRepository = new UsersRepository();
