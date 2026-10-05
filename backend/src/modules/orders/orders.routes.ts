import { Router } from 'express';
import { ordersController } from './orders.controller.js';
import { trackingController } from '../tracking/tracking.controller.js';
import { validateRequest } from '../../shared/validators/common.js';
import { cancelOrderSchema } from './orders.validation.js';
import { authenticate } from '../../shared/middleware/authMiddleware.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import './orders.docs.js';

const router = Router();

router.use(authenticate);

router.get('/', catchAsync(ordersController.listCustomerOrders));
router.get('/:orderId', catchAsync(ordersController.getOrder));
router.get('/:orderId/tracking', catchAsync(trackingController.getOrderTracking));

router.post(
  '/:orderId/cancel',
  validateRequest({ body: cancelOrderSchema }),
  catchAsync(ordersController.cancelOrder)
);

export default router;
