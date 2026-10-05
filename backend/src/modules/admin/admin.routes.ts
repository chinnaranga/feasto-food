import { Router } from 'express';
import { adminController } from './admin.controller.js';
import { validateRequest } from '../../shared/validators/common.js';
import {
  suspendUserSchema,
  restoreUserSchema,
  verifyEntitySchema,
  rejectEntitySchema,
  cancelOrderSchema,
  overrideOrderSchema,
  updateSettingSchema,
  createStaffSchema,
} from './admin.validation.js';
import { authenticate, requireRoles } from '../../shared/middleware/authMiddleware.js';
import { requireAdminRole } from './admin.middleware.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import './admin.docs.js';

const router = Router();

router.use(authenticate);
router.use(requireAdminRole);

// Overview
router.get('/overview', catchAsync(adminController.getOverview));

// Users Administration
router.get('/users', catchAsync(adminController.listUsers));
router.get('/users/:userId', catchAsync(adminController.getUser));
router.post(
  '/users/:userId/suspend',
  validateRequest({ body: suspendUserSchema }),
  catchAsync(adminController.suspendUser)
);
router.post(
  '/users/:userId/restore',
  validateRequest({ body: restoreUserSchema }),
  catchAsync(adminController.restoreUser)
);

// Restaurants Administration
router.get('/restaurants', catchAsync(adminController.listRestaurants));
router.post(
  '/restaurants/:restaurantId/verify',
  validateRequest({ body: verifyEntitySchema }),
  catchAsync(adminController.verifyRestaurant)
);
router.post(
  '/restaurants/:restaurantId/suspend',
  validateRequest({ body: rejectEntitySchema }),
  catchAsync(adminController.suspendRestaurant)
);

// Riders Administration
router.get('/riders', catchAsync(adminController.listRiders));
router.post(
  '/riders/:riderId/verify',
  validateRequest({ body: verifyEntitySchema }),
  catchAsync(adminController.verifyRider)
);
router.post(
  '/riders/:riderId/suspend',
  validateRequest({ body: rejectEntitySchema }),
  catchAsync(adminController.suspendRider)
);

// Order Operations & Override
router.post(
  '/orders/:orderId/cancel',
  validateRequest({ body: cancelOrderSchema }),
  catchAsync(adminController.cancelOrder)
);
router.post(
  '/orders/:orderId/override',
  validateRequest({ body: overrideOrderSchema }),
  catchAsync(adminController.overrideOrder)
);

// Verification Center
router.get('/verifications', catchAsync(adminController.listVerifications));
router.post(
  '/verifications/:verificationId/approve',
  validateRequest({ body: verifyEntitySchema }),
  catchAsync(adminController.approveVerification)
);

// Settings
router.get('/settings', catchAsync(adminController.getSettings));
router.patch(
  '/settings',
  validateRequest({ body: updateSettingSchema }),
  catchAsync(adminController.updateSetting)
);

// Staff Administration
router.get('/staff', catchAsync(adminController.listStaff));
router.post(
  '/staff',
  validateRequest({ body: createStaffSchema }),
  catchAsync(adminController.createStaff)
);

// Audit Logs
router.get('/audit-logs', catchAsync(adminController.getAuditLogs));

export default router;
