import { Router } from 'express';
import { notificationsController } from '../notifications.controller.js';
import { validateRequest } from '../../../shared/validators/common.js';
import { registerDeviceSchema, updateDeviceSchema } from '../notifications.validation.js';
import { authenticate } from '../../../shared/middleware/authMiddleware.js';
import { catchAsync } from '../../../shared/utils/catchAsync.js';

const router = Router();

router.use(authenticate);

router.get('/', catchAsync(notificationsController.getDevices));

router.post(
  '/',
  validateRequest({ body: registerDeviceSchema }),
  catchAsync(notificationsController.registerDevice)
);

router.patch(
  '/:deviceId',
  validateRequest({ body: updateDeviceSchema }),
  catchAsync(notificationsController.updateDevice)
);

router.delete('/:deviceId', catchAsync(notificationsController.removeDevice));

export default router;
