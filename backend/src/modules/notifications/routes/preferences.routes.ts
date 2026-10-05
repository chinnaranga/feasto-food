import { Router } from 'express';
import { notificationsController } from '../notifications.controller.js';
import { validateRequest } from '../../../shared/validators/common.js';
import { updatePreferencesSchema } from '../notifications.validation.js';
import { authenticate } from '../../../shared/middleware/authMiddleware.js';
import { catchAsync } from '../../../shared/utils/catchAsync.js';

const router = Router();

router.use(authenticate);

router.get('/', catchAsync(notificationsController.getPreferences));

router.patch(
  '/',
  validateRequest({ body: updatePreferencesSchema }),
  catchAsync(notificationsController.updatePreferences)
);

export default router;
