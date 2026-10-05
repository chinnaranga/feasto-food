import { Request, Response } from 'express';
import { restaurantsService, RestaurantsService } from './restaurants.service.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { UnauthorizedError } from '../../shared/errors/UnauthorizedError.js';
import { HttpStatus } from '../../shared/constants/httpStatusCodes.js';

const parseParam = (val: string | string[] | undefined): string => {
  if (!val) return '';
  return Array.isArray(val) ? val[0] : val;
};

export class RestaurantsController {
  constructor(private service: RestaurantsService = restaurantsService) {}

  listRestaurants = async (req: Request, res: Response): Promise<void> => {
    const ownerUserId = req.query.ownerUserId ? parseParam(req.query.ownerUserId as string) : undefined;
    const restaurants = await this.service.listRestaurants(ownerUserId);
    sendSuccess(res, restaurants, 'Restaurants retrieved successfully');
  };

  createRestaurant = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const restaurant = await this.service.createRestaurant(req.user.id, req.body);
    sendSuccess(res, restaurant, 'Restaurant workspace created successfully', HttpStatus.CREATED);
  };

  getRestaurant = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const restaurant = await this.service.getRestaurant(restaurantId);
    sendSuccess(res, restaurant, 'Restaurant profile retrieved');
  };

  updateRestaurant = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const updated = await this.service.updateRestaurant(restaurantId, req.body);
    sendSuccess(res, updated, 'Restaurant workspace updated');
  };

  deleteRestaurant = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const result = await this.service.deleteRestaurant(restaurantId);
    sendSuccess(res, result, 'Restaurant workspace soft-deleted');
  };

  getSummary = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const summary = await this.service.getSummary(restaurantId);
    sendSuccess(res, summary, 'Restaurant workspace summary retrieved');
  };

  // --- Branch Handlers ---
  getBranches = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const branches = await this.service.getBranches(restaurantId);
    sendSuccess(res, branches, 'Branches retrieved');
  };

  createBranch = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const branch = await this.service.createBranch(restaurantId, req.body);
    sendSuccess(res, branch, 'Branch created successfully', HttpStatus.CREATED);
  };

  getBranchById = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const branchId = parseParam(req.params.branchId);
    const branches = await this.service.getBranches(restaurantId);
    const target = branches.find((b) => b._id.toString() === branchId);
    sendSuccess(res, target || null, 'Branch details retrieved');
  };

  updateBranch = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const branchId = parseParam(req.params.branchId);
    const updated = await this.service.updateBranch(branchId, restaurantId, req.body);
    sendSuccess(res, updated, 'Branch updated successfully');
  };

  deleteBranch = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const branchId = parseParam(req.params.branchId);
    const result = await this.service.deleteBranch(branchId, restaurantId);
    sendSuccess(res, result, 'Branch deactivated successfully');
  };

  // --- Hours Handlers ---
  getHours = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const hours = await this.service.getHours(restaurantId);
    sendSuccess(res, hours, 'Operating hours retrieved');
  };

  updateHours = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const updated = await this.service.updateHours(restaurantId, req.body);
    sendSuccess(res, updated, 'Operating hours updated');
  };

  // --- Settings Handlers ---
  getSettings = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const settings = await this.service.getSettings(restaurantId);
    sendSuccess(res, settings, 'Operational settings retrieved');
  };

  updateSettings = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const updated = await this.service.updateSettings(restaurantId, req.body);
    sendSuccess(res, updated, 'Operational settings updated');
  };

  // --- Verification Handlers ---
  getVerification = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const verification = await this.service.getVerification(restaurantId);
    sendSuccess(res, verification, 'Verification details retrieved');
  };

  submitVerification = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const result = await this.service.submitVerification(restaurantId, req.body);
    sendSuccess(res, result, 'Business verification documents submitted for admin review');
  };

  // --- Staff Access Handlers ---
  getStaffAccess = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const staffList = await this.service.getStaffAccessList(restaurantId);
    sendSuccess(res, staffList, 'Staff access list retrieved');
  };

  addStaffAccess = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const restaurantId = parseParam(req.params.restaurantId);
    const staff = await this.service.addStaffAccess(restaurantId, req.user.id, req.body);
    sendSuccess(res, staff, 'Staff access granted successfully', HttpStatus.CREATED);
  };

  updateStaffAccess = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const accessId = parseParam(req.params.accessId);
    const updated = await this.service.updateStaffAccess(accessId, restaurantId, req.body);
    sendSuccess(res, updated, 'Staff access updated');
  };

  deleteStaffAccess = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const accessId = parseParam(req.params.accessId);
    const result = await this.service.deleteStaffAccess(accessId, restaurantId);
    sendSuccess(res, result, 'Staff access revoked');
  };
}

export const restaurantsController = new RestaurantsController();
