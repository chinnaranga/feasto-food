import { Router } from 'express';
import { kitchenController } from './kitchen.controller.js';
import { validateRequest } from '../../shared/validators/common.js';
import {
  createStationSchema,
  updateStationSchema,
  updateKitchenOrderSchema,
  updateKitchenItemSchema,
} from './kitchen.validation.js';
import { authenticate } from '../../shared/middleware/authMiddleware.js';
import { requireRestaurantAccess } from '../restaurantOperations/restaurantOperations.middleware.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import './kitchen.docs.js';

const router = Router({ mergeParams: true });

router.use(authenticate);
router.use(requireRestaurantAccess);

// Kitchen Queue & Orders
router.get('/kitchen/queue', catchAsync(kitchenController.getQueue));
router.get('/kitchen/orders/:orderId', catchAsync(kitchenController.getOrder));

router.patch(
  '/kitchen/orders/:orderId',
  validateRequest({ body: updateKitchenOrderSchema }),
  catchAsync(kitchenController.updateOrder)
);

router.post('/kitchen/orders/:orderId/start', catchAsync(kitchenController.startOrder));

// Kitchen Stations
router.get('/kitchen/stations', catchAsync(kitchenController.getStations));

router.post(
  '/kitchen/stations',
  validateRequest({ body: createStationSchema }),
  catchAsync(kitchenController.createStation)
);

router.patch(
  '/kitchen/stations/:stationId',
  validateRequest({ body: updateStationSchema }),
  catchAsync(kitchenController.updateStation)
);

router.delete('/kitchen/stations/:stationId', catchAsync(kitchenController.deleteStation));

// Item Preparation
router.get('/orders/:orderId/items', catchAsync(kitchenController.getOrderItems));

router.patch(
  '/orders/:orderId/items/:itemId',
  validateRequest({ body: updateKitchenItemSchema }),
  catchAsync(kitchenController.startItem)
);

router.post('/orders/:orderId/items/:itemId/start', catchAsync(kitchenController.startItem));
router.post('/orders/:orderId/items/:itemId/complete', catchAsync(kitchenController.completeItem));

export default router;
