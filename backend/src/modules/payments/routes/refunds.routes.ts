import { Router } from 'express';
import { paymentsController } from '../payments.controller.js';
import { validateRequest } from '../../../shared/validators/common.js';
import {
  refundCreateSchema,
  refundUpdateSchema,
  refundApproveRejectSchema,
} from '../payments.validation.js';
import { authenticate, requireRoles } from '../../../shared/middleware/authMiddleware.js';
import { catchAsync } from '../../../shared/utils/catchAsync.js';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  validateRequest({ body: refundCreateSchema }),
  catchAsync(paymentsController.createRefund)
);

router.get('/', catchAsync(paymentsController.getRefunds));

router.get('/:refundId', catchAsync(paymentsController.getRefund));

router.patch(
  '/:refundId',
  requireRoles('admin'),
  validateRequest({ body: refundUpdateSchema }),
  catchAsync(paymentsController.updateRefund)
);

router.post(
  '/:refundId/approve',
  requireRoles('admin'),
  validateRequest({ body: refundApproveRejectSchema }),
  catchAsync(paymentsController.approveRefund)
);

router.post(
  '/:refundId/reject',
  requireRoles('admin'),
  validateRequest({ body: refundApproveRejectSchema }),
  catchAsync(paymentsController.rejectRefund)
);

export default router;
