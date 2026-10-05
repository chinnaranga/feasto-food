import { Router } from 'express';
import { ordersController } from '../orders.controller.js';
import { authenticate } from '../../../shared/middleware/authMiddleware.js';
import { requireRestaurantAccess } from '../../restaurants/restaurants.middleware.js';
import { catchAsync } from '../../../shared/utils/catchAsync.js';

const router = Router({ mergeParams: true });

router.use(authenticate, requireRestaurantAccess);

router.get('/', catchAsync(ordersController.listRestaurantOrders));
router.get('/queue-summary', catchAsync(ordersController.getQueueSummary));

router.post('/:orderId/accept', catchAsync(ordersController.acceptOrder));
router.post('/:orderId/reject', catchAsync(ordersController.rejectOrder));
router.post('/:orderId/prepare', catchAsync(ordersController.markPreparing));
router.post('/:orderId/ready', catchAsync(ordersController.markReady));

export default router;
