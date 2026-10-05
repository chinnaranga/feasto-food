import { Router } from 'express';
import { usersController } from './users.controller.js';
import { validateRequest, commonSchemas } from '../../shared/validators/common.js';
import {
  updateProfileSchema,
  createAddressSchema,
  updateAddressSchema,
  addFavoriteSchema,
  updatePreferencesSchema,
} from './users.validation.js';
import { authenticate, requirePermissions } from '../../shared/middleware/authMiddleware.js';
import { Permission } from '../../shared/constants/permissions.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import './users.docs.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Profile Management Endpoints
router.get('/me', catchAsync(usersController.getMe));

router.patch(
  '/me',
  validateRequest({ body: updateProfileSchema }),
  catchAsync(usersController.updateMe)
);

router.get('/me/summary', catchAsync(usersController.getSummary));

// Address Management Endpoints
router.get('/me/addresses', catchAsync(usersController.getAddresses));

router.post(
  '/me/addresses',
  validateRequest({ body: createAddressSchema }),
  catchAsync(usersController.addAddress)
);

router.patch(
  '/me/addresses/:addressId',
  validateRequest({ body: updateAddressSchema }),
  catchAsync(usersController.updateAddress)
);

router.delete('/me/addresses/:addressId', catchAsync(usersController.deleteAddress));

// Favorites Management Endpoints
router.get('/me/favorites', catchAsync(usersController.getFavorites));

router.post(
  '/me/favorites',
  validateRequest({ body: addFavoriteSchema }),
  catchAsync(usersController.addFavorite)
);

router.delete('/me/favorites/:favoriteId', catchAsync(usersController.removeFavorite));

// Preferences Management Endpoints
router.get('/me/preferences', catchAsync(usersController.getPreferences));

router.patch(
  '/me/preferences',
  validateRequest({ body: updatePreferencesSchema }),
  catchAsync(usersController.updatePreferences)
);

// Device Management Endpoints
router.get('/me/devices', catchAsync(usersController.getDevices));

router.delete('/me/devices/:deviceId', catchAsync(usersController.revokeDevice));

// Administrative User Management Endpoints
router.get(
  '/:userId',
  requirePermissions(Permission.USER_READ),
  catchAsync(usersController.getUserById)
);

router.patch(
  '/:userId',
  requirePermissions(Permission.USER_WRITE),
  validateRequest({ body: updateProfileSchema }),
  catchAsync(usersController.updateUserById)
);

router.delete(
  '/:userId',
  requirePermissions(Permission.USER_WRITE),
  catchAsync(usersController.deleteUser)
);

export default router;
