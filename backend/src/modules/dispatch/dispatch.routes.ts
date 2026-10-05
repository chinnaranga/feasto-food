import { Router } from 'express';
import { dispatchController } from './dispatch.controller.js';
import { validateRequest } from '../../shared/validators/common.js';
import {
  triggerDispatchSchema,
  rejectOfferSchema,
  updateDispatchConfigSchema,
} from './dispatch.validation.js';
import { authenticate, requireRoles } from '../../shared/middleware/authMiddleware.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import './dispatch.docs.js';

const dispatchRouter = Router();
const riderOffersRouter = Router();
const riderAssignmentsRouter = Router();

// 1. DISPATCH SYSTEM ROUTES
dispatchRouter.use(authenticate);

dispatchRouter.post(
  '/orders/:orderId',
  validateRequest({ body: triggerDispatchSchema }),
  catchAsync(dispatchController.triggerDispatch)
);

dispatchRouter.get('/orders/:orderId', catchAsync(dispatchController.getDispatchStatus));
dispatchRouter.post('/orders/:orderId/retry', catchAsync(dispatchController.retryDispatch));
dispatchRouter.post('/orders/:orderId/cancel', catchAsync(dispatchController.cancelDispatch));
dispatchRouter.get('/orders/:orderId/attempts', catchAsync(dispatchController.getAttempts));

dispatchRouter.post(
  '/orders/:orderId/reassign',
  requireRoles('admin', 'restaurant_owner', 'restaurant_manager'),
  catchAsync(dispatchController.reassignOrder)
);

dispatchRouter.get('/config', requireRoles('admin'), catchAsync(dispatchController.getConfig));
dispatchRouter.patch(
  '/config',
  requireRoles('admin'),
  validateRequest({ body: updateDispatchConfigSchema }),
  catchAsync(dispatchController.updateConfig)
);

// 2. RIDER OFFERS ROUTES
riderOffersRouter.use(authenticate);
riderOffersRouter.get('/', catchAsync(dispatchController.getRiderOffers));
riderOffersRouter.get('/:offerId', catchAsync(dispatchController.getOffer));
riderOffersRouter.post('/:offerId/accept', catchAsync(dispatchController.acceptOffer));
riderOffersRouter.post(
  '/:offerId/reject',
  validateRequest({ body: rejectOfferSchema }),
  catchAsync(dispatchController.rejectOffer)
);

// 3. RIDER ASSIGNMENTS ROUTES
riderAssignmentsRouter.use(authenticate);
riderAssignmentsRouter.get('/', catchAsync(dispatchController.getRiderAssignments));
riderAssignmentsRouter.get('/:assignmentId', catchAsync(dispatchController.getAssignment));
riderAssignmentsRouter.post('/:assignmentId/start-pickup', catchAsync(dispatchController.startPickup));
riderAssignmentsRouter.post('/:assignmentId/confirm-pickup', catchAsync(dispatchController.confirmPickup));
riderAssignmentsRouter.post('/:assignmentId/start-delivery', catchAsync(dispatchController.startDelivery));
riderAssignmentsRouter.post('/:assignmentId/complete', catchAsync(dispatchController.completeDelivery));

export { dispatchRouter, riderOffersRouter, riderAssignmentsRouter };
