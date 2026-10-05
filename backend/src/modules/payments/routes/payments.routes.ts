import { Router } from 'express';
import { paymentsController } from '../payments.controller.js';
import { validateRequest } from '../../../shared/validators/common.js';
import {
  initializePaymentSchema,
  confirmPaymentSchema,
  cancelPaymentSchema,
} from '../payments.validation.js';
import { authenticate, requireRoles } from '../../../shared/middleware/authMiddleware.js';
import { requirePaymentOwnership } from '../payments.middleware.js';
import { catchAsync } from '../../../shared/utils/catchAsync.js';

const router = Router();

router.use(authenticate);

router.post(
  '/initialize',
  validateRequest({ body: initializePaymentSchema }),
  catchAsync(paymentsController.initializePayment)
);

router.post(
  '/confirm',
  validateRequest({ body: confirmPaymentSchema }),
  catchAsync(paymentsController.confirmPayment)
);

router.get(
  '/summary',
  requireRoles('admin', 'restaurant_owner'),
  catchAsync(paymentsController.getSummary)
);

router.get('/', catchAsync(paymentsController.getPayments));

router.get(
  '/:paymentId',
  requirePaymentOwnership,
  catchAsync(paymentsController.getPayment)
);

router.post(
  '/:paymentId/cancel',
  requirePaymentOwnership,
  validateRequest({ body: cancelPaymentSchema }),
  catchAsync(paymentsController.cancelPayment)
);

export default router;
