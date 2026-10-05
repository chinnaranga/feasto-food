import { Router } from 'express';
import { ordersController } from '../orders.controller.js';
import { validateRequest } from '../../../shared/validators/common.js';
import { initializeCheckoutSchema, createOrderSchema } from '../orders.validation.js';
import { authenticate } from '../../../shared/middleware/authMiddleware.js';
import { catchAsync } from '../../../shared/utils/catchAsync.js';

const router = Router();

router.use(authenticate);

router.post(
  '/initialize',
  validateRequest({ body: initializeCheckoutSchema }),
  catchAsync(ordersController.initializeCheckout)
);

router.post(
  '/confirm',
  validateRequest({ body: createOrderSchema }),
  catchAsync(ordersController.confirmCheckout)
);

export default router;
