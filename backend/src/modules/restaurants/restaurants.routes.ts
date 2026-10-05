import { Router } from 'express';
import { restaurantsController } from './restaurants.controller.js';
import { validateRequest } from '../../shared/validators/common.js';
import {
  createRestaurantSchema,
  updateRestaurantSchema,
  createBranchSchema,
  updateBranchSchema,
  updateHoursSchema,
  updateSettingsSchema,
  submitVerificationSchema,
  addStaffAccessSchema,
  updateStaffAccessSchema,
} from './restaurants.validation.js';
import { authenticate } from '../../shared/middleware/authMiddleware.js';
import { requireRestaurantAccess } from './restaurants.middleware.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import './restaurants.docs.js';

const router = Router();

// Public / Filtered Endpoint
router.get('/', catchAsync(restaurantsController.listRestaurants));

// Protected Creation Endpoint
router.post(
  '/',
  authenticate,
  validateRequest({ body: createRestaurantSchema }),
  catchAsync(restaurantsController.createRestaurant)
);

// Restaurant Workspace Endpoints (Protected with RBAC & Access Middleware)
router.get(
  '/:restaurantId',
  authenticate,
  catchAsync(restaurantsController.getRestaurant)
);

router.patch(
  '/:restaurantId',
  authenticate,
  requireRestaurantAccess,
  validateRequest({ body: updateRestaurantSchema }),
  catchAsync(restaurantsController.updateRestaurant)
);

router.delete(
  '/:restaurantId',
  authenticate,
  requireRestaurantAccess,
  catchAsync(restaurantsController.deleteRestaurant)
);

router.get(
  '/:restaurantId/summary',
  authenticate,
  requireRestaurantAccess,
  catchAsync(restaurantsController.getSummary)
);

// Branch Management Endpoints
router.get(
  '/:restaurantId/branches',
  authenticate,
  requireRestaurantAccess,
  catchAsync(restaurantsController.getBranches)
);

router.post(
  '/:restaurantId/branches',
  authenticate,
  requireRestaurantAccess,
  validateRequest({ body: createBranchSchema }),
  catchAsync(restaurantsController.createBranch)
);

router.get(
  '/:restaurantId/branches/:branchId',
  authenticate,
  requireRestaurantAccess,
  catchAsync(restaurantsController.getBranchById)
);

router.patch(
  '/:restaurantId/branches/:branchId',
  authenticate,
  requireRestaurantAccess,
  validateRequest({ body: updateBranchSchema }),
  catchAsync(restaurantsController.updateBranch)
);

router.delete(
  '/:restaurantId/branches/:branchId',
  authenticate,
  requireRestaurantAccess,
  catchAsync(restaurantsController.deleteBranch)
);

// Hours Management Endpoints
router.get(
  '/:restaurantId/hours',
  authenticate,
  catchAsync(restaurantsController.getHours)
);

router.patch(
  '/:restaurantId/hours',
  authenticate,
  requireRestaurantAccess,
  validateRequest({ body: updateHoursSchema }),
  catchAsync(restaurantsController.updateHours)
);

// Settings Management Endpoints
router.get(
  '/:restaurantId/settings',
  authenticate,
  requireRestaurantAccess,
  catchAsync(restaurantsController.getSettings)
);

router.patch(
  '/:restaurantId/settings',
  authenticate,
  requireRestaurantAccess,
  validateRequest({ body: updateSettingsSchema }),
  catchAsync(restaurantsController.updateSettings)
);

// Verification Management Endpoints
router.get(
  '/:restaurantId/verification',
  authenticate,
  requireRestaurantAccess,
  catchAsync(restaurantsController.getVerification)
);

router.post(
  '/:restaurantId/verification/submit',
  authenticate,
  requireRestaurantAccess,
  validateRequest({ body: submitVerificationSchema }),
  catchAsync(restaurantsController.submitVerification)
);

// Staff Access Management Endpoints
router.get(
  '/:restaurantId/staff-access',
  authenticate,
  requireRestaurantAccess,
  catchAsync(restaurantsController.getStaffAccess)
);

router.post(
  '/:restaurantId/staff-access',
  authenticate,
  requireRestaurantAccess,
  validateRequest({ body: addStaffAccessSchema }),
  catchAsync(restaurantsController.addStaffAccess)
);

router.patch(
  '/:restaurantId/staff-access/:accessId',
  authenticate,
  requireRestaurantAccess,
  validateRequest({ body: updateStaffAccessSchema }),
  catchAsync(restaurantsController.updateStaffAccess)
);

router.delete(
  '/:restaurantId/staff-access/:accessId',
  authenticate,
  requireRestaurantAccess,
  catchAsync(restaurantsController.deleteStaffAccess)
);

import menusRouter from '../menus/menus.routes.js';
import restaurantOrdersRouter from '../orders/routes/restaurantOrders.routes.js';

router.use('/:restaurantId/menus', menusRouter);
router.use('/:restaurantId/orders', restaurantOrdersRouter);

export default router;
