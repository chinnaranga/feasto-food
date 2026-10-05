import { Router } from 'express';
import { paymentsController } from '../payments.controller.js';
import { validateRequest } from '../../../shared/validators/common.js';
import { reconcileTransactionSchema } from '../payments.validation.js';
import { authenticate, requireRoles } from '../../../shared/middleware/authMiddleware.js';
import { catchAsync } from '../../../shared/utils/catchAsync.js';

const router = Router();

router.use(authenticate);

router.get('/', catchAsync(paymentsController.getTransactions));
router.get('/:transactionId', catchAsync(paymentsController.getTransaction));

router.post(
  '/:transactionId/reconcile',
  requireRoles('admin'),
  validateRequest({ body: reconcileTransactionSchema }),
  catchAsync(paymentsController.reconcileTransaction)
);

export default router;
