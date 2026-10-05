import { Router } from 'express';
import { paymentsController } from '../payments.controller.js';
import { validateRequest } from '../../../shared/validators/common.js';
import {
  payoutCreateSchema,
  payoutUpdateSchema,
} from '../payments.validation.js';
import { authenticate, requireRoles } from '../../../shared/middleware/authMiddleware.js';
import { catchAsync } from '../../../shared/utils/catchAsync.js';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  requireRoles('admin', 'restaurant_owner', 'rider'),
  validateRequest({ body: payoutCreateSchema }),
  catchAsync(paymentsController.createPayout)
);

router.get('/', catchAsync(paymentsController.getPayouts));

router.get('/:payoutId', catchAsync(paymentsController.getPayout));

router.patch(
  '/:payoutId',
  requireRoles('admin'),
  validateRequest({ body: payoutUpdateSchema }),
  catchAsync(paymentsController.updatePayout)
);

router.post(
  '/:payoutId/retry',
  requireRoles('admin'),
  catchAsync(paymentsController.retryPayout)
);

router.post(
  '/:payoutId/cancel',
  catchAsync(paymentsController.cancelPayout)
);

export default router;
