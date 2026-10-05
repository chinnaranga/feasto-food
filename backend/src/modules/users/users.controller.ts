import { Request, Response } from 'express';
import { usersService, UsersService } from './users.service.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { UnauthorizedError } from '../../shared/errors/UnauthorizedError.js';
import { FavoriteEntityType } from './models/favorite.model.js';

export class UsersController {
  constructor(private service: UsersService = usersService) {}

  getMe = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const profile = await this.service.getProfile(req.user.id);
    sendSuccess(res, profile, 'Profile retrieved successfully');
  };

  updateMe = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const updated = await this.service.updateProfile(req.user.id, req.body);
    sendSuccess(res, updated, 'Profile updated successfully');
  };

  getSummary = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const summary = await this.service.getUserSummary(req.user.id);
    sendSuccess(res, summary, 'User summary retrieved successfully');
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const { userId } = req.params;
    const user = await this.service.getUserById(userId, req.user.role, req.user.id);
    sendSuccess(res, user, 'User details retrieved');
  };

  updateUserById = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const { userId } = req.params;
    await this.service.getUserById(userId, req.user.role, req.user.id); // Guard check
    const updated = await this.service.updateProfile(userId, req.body);
    sendSuccess(res, updated, 'User profile updated');
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const { userId } = req.params;
    const result = await this.service.deleteUser(userId, req.user.role, req.user.id);
    sendSuccess(res, result, 'User account deleted');
  };

  // --- Address Handlers ---
  getAddresses = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const addresses = await this.service.getAddresses(req.user.id);
    sendSuccess(res, addresses, 'Addresses retrieved');
  };

  addAddress = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const newAddress = await this.service.addAddress(req.user.id, req.body);
    sendSuccess(res, newAddress, 'Address added successfully');
  };

  updateAddress = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const { addressId } = req.params;
    const updated = await this.service.updateAddress(addressId, req.user.id, req.body);
    sendSuccess(res, updated, 'Address updated successfully');
  };

  deleteAddress = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const { addressId } = req.params;
    const result = await this.service.deleteAddress(addressId, req.user.id);
    sendSuccess(res, result, 'Address deleted successfully');
  };

  // --- Favorites Handlers ---
  getFavorites = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const entityType = req.query.type as FavoriteEntityType | undefined;
    const favorites = await this.service.getFavorites(req.user.id, entityType);
    sendSuccess(res, favorites, 'Favorites retrieved');
  };

  addFavorite = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const favorite = await this.service.addFavorite(req.user.id, req.body);
    sendSuccess(res, favorite, 'Added to favorites');
  };

  removeFavorite = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const { favoriteId } = req.params;
    const result = await this.service.removeFavorite(favoriteId, req.user.id);
    sendSuccess(res, result, 'Removed from favorites');
  };

  // --- Preferences Handlers ---
  getPreferences = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const prefs = await this.service.getPreferences(req.user.id);
    sendSuccess(res, prefs, 'Preferences retrieved');
  };

  updatePreferences = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const updated = await this.service.updatePreferences(req.user.id, req.body);
    sendSuccess(res, updated, 'Preferences updated successfully');
  };

  // --- Device Handlers ---
  getDevices = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const devices = await this.service.getUserDevices(req.user.id);
    sendSuccess(res, devices, 'Active devices retrieved');
  };

  revokeDevice = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const { deviceId } = req.params;
    const result = await this.service.revokeDevice(req.user.id, deviceId);
    sendSuccess(res, result, 'Device session revoked');
  };
}

export const usersController = new UsersController();
