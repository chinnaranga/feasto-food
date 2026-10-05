import { Router } from 'express';
import { paymentsController } from '../payments.controller.js';
import { validateRequest } from '../../../shared/validators/common.js';
import {
  walletCreditDebitSchema,
  walletUpdateSchema,
} from '../payments.validation.js';
import { authenticate, requireRoles } from '../../../shared/middleware/authMiddleware.js';
import { requireWalletOwnership } from '../payments.middleware.js';
import { catchAsync } from '../../../shared/utils/catchAsync.js';

const router = Router();

router.use(authenticate);

router.get('/', catchAsync(paymentsController.getWallets));

router.get(
  '/:walletId',
  requireWalletOwnership,
  catchAsync(paymentsController.getWallet)
);

router.patch(
  '/:walletId',
  requireRoles('admin'),
  validateRequest({ body: walletUpdateSchema }),
  catchAsync(paymentsController.updateWallet)
);

router.post(
  '/:walletId/credit',
  requireRoles('admin'),
  validateRequest({ body: walletCreditDebitSchema }),
  catchAsync(paymentsController.creditWallet)
);

router.post(
  '/:walletId/debit',
  requireWalletOwnership,
  validateRequest({ body: walletCreditDebitSchema }),
  catchAsync(paymentsController.debitWallet)
);

router.get(
  '/:walletId/history',
  requireWalletOwnership,
  catchAsync(paymentsController.getWalletHistory)
);

export default router;
