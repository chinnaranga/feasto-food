import { Router } from 'express';
import { paymentsController } from '../payments.controller.js';
import { validateRequest } from '../../../shared/validators/common.js';
import { webhookPayloadSchema } from '../payments.validation.js';
import { verifyWebhookHeader } from '../payments.middleware.js';
import { catchAsync } from '../../../shared/utils/catchAsync.js';

const router = Router();

router.post(
  '/payments',
  verifyWebhookHeader,
  validateRequest({ body: webhookPayloadSchema }),
  catchAsync(paymentsController.handlePaymentWebhook)
);

router.post(
  '/payouts',
  verifyWebhookHeader,
  validateRequest({ body: webhookPayloadSchema }),
  catchAsync(paymentsController.handlePayoutWebhook)
);

export default router;
