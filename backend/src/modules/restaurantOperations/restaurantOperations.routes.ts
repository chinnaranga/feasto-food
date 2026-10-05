import { Router } from 'express';
import { restaurantOperationsController } from './restaurantOperations.controller.js';
import { validateRequest } from '../../shared/validators/common.js';
import {
  acceptOrderSchema,
  rejectOrderSchema,
  delayOrderSchema,
  prepareOrderSchema,
  readyOrderSchema,
  updateOperationalStatusSchema,
  pauseRestaurantSchema,
} from './restaurantOperations.validation.js';
import { authenticate } from '../../shared/middleware/authMiddleware.js';
import { requireRestaurantAccess } from './restaurantOperations.middleware.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import './restaurantOperations.docs.js';

const router = Router({ mergeParams: true });

router.use(authenticate);
router.use(requireRestaurantAccess);

// Order Operations
router.get('/orders/incoming', catchAsync(restaurantOperationsController.getIncomingOrders));
router.get('/orders/active', catchAsync(restaurantOperationsController.getActiveOrders));
router.get('/orders/:orderId', catchAsync(restaurantOperationsController.getOrderDetails));
router.get('/orders/:orderId/timeline', catchAsync(restaurantOperationsController.getOrderTimeline));

router.post(
  '/orders/:orderId/accept',
  validateRequest({ body: acceptOrderSchema }),
  catchAsync(restaurantOperationsController.acceptOrder)
);

router.post(
  '/orders/:orderId/reject',
  validateRequest({ body: rejectOrderSchema }),
  catchAsync(restaurantOperationsController.rejectOrder)
);

router.post(
  '/orders/:orderId/prepare',
  validateRequest({ body: prepareOrderSchema }),
  catchAsync(restaurantOperationsController.prepareOrder)
);

router.post(
  '/orders/:orderId/ready',
  validateRequest({ body: readyOrderSchema }),
  catchAsync(restaurantOperationsController.readyOrder)
);

router.post(
  '/orders/:orderId/delay',
  validateRequest({ body: delayOrderSchema }),
  catchAsync(restaurantOperationsController.delayOrder)
);

// Operational Status
router.get('/operations/status', catchAsync(restaurantOperationsController.getOperationalStatus));

router.patch(
  '/operations/status',
  validateRequest({ body: updateOperationalStatusSchema }),
  catchAsync(restaurantOperationsController.updateOperationalStatus)
);

router.post(
  '/operations/pause',
  validateRequest({ body: pauseRestaurantSchema }),
  catchAsync(restaurantOperationsController.pauseRestaurant)
);

router.post('/operations/resume', catchAsync(restaurantOperationsController.resumeRestaurant));

export default router;
