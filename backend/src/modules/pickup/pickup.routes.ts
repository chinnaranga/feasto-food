import { Router } from 'express';
import { pickupController } from './pickup.controller.js';
import { validateRequest } from '../../shared/validators/common.js';
import { startHandoffSchema, confirmHandoffSchema } from './pickup.validation.js';
import { authenticate } from '../../shared/middleware/authMiddleware.js';
import { requireRestaurantAccess } from '../restaurantOperations/restaurantOperations.middleware.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import './pickup.docs.js';

const router = Router({ mergeParams: true });

router.use(authenticate);
router.use(requireRestaurantAccess);

router.get('/orders/:orderId/handoff', catchAsync(pickupController.getHandoff));

router.post(
  '/orders/:orderId/handoff/start',
  validateRequest({ body: startHandoffSchema }),
  catchAsync(pickupController.startHandoff)
);

router.post(
  '/orders/:orderId/handoff/confirm',
  validateRequest({ body: confirmHandoffSchema }),
  catchAsync(pickupController.confirmHandoff)
);

export default router;
