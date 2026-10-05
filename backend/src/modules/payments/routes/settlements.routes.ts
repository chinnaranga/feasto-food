import { Router } from 'express';
import { paymentsController } from '../payments.controller.js';
import { validateRequest } from '../../../shared/validators/common.js';
import { reconcileSettlementSchema } from '../payments.validation.js';
import { authenticate, requireRoles } from '../../../shared/middleware/authMiddleware.js';
import { catchAsync } from '../../../shared/utils/catchAsync.js';

const router = Router();

router.use(authenticate);

router.get('/', catchAsync(paymentsController.getSettlements));

router.get('/:settlementId', catchAsync(paymentsController.getSettlement));

router.post(
  '/:settlementId/reconcile',
  requireRoles('admin'),
  validateRequest({ body: reconcileSettlementSchema }),
  catchAsync(paymentsController.reconcileSettlement)
);

export default router;
