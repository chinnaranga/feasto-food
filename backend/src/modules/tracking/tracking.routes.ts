import { Router } from 'express';
import { trackingController } from './tracking.controller.js';
import { validateRequest } from '../../shared/validators/common.js';
import {
  createTrackingSessionSchema,
  pushLocationSchema,
  updateRouteSchema,
  geofenceEventSchema,
  updateEtaSchema,
} from './tracking.validation.js';
import { authenticate } from '../../shared/middleware/authMiddleware.js';
import { requireOrderTrackingAccess } from './tracking.middleware.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import './tracking.docs.ts';

const router = Router();

router.use(authenticate);

// Session endpoints
router.post(
  '/sessions',
  validateRequest({ body: createTrackingSessionSchema }),
  catchAsync(trackingController.createSession)
);

router.get('/sessions/:sessionId', catchAsync(trackingController.getSession));
router.patch('/sessions/:sessionId', catchAsync(trackingController.updateSessionStatus));
router.delete('/sessions/:sessionId', catchAsync(trackingController.deleteSession));

// Location endpoints
router.post(
  '/sessions/:sessionId/location',
  validateRequest({ body: pushLocationSchema }),
  catchAsync(trackingController.pushLocation)
);

router.get('/sessions/:sessionId/location', catchAsync(trackingController.getLocation));
router.get('/sessions/:sessionId/history', catchAsync(trackingController.getLocationHistory));

// Route endpoints
router.post(
  '/sessions/:sessionId/route',
  validateRequest({ body: updateRouteSchema }),
  catchAsync(trackingController.saveRoute)
);

router.get('/sessions/:sessionId/route', catchAsync(trackingController.getRoute));
router.patch(
  '/sessions/:sessionId/route',
  validateRequest({ body: updateRouteSchema }),
  catchAsync(trackingController.saveRoute)
);

// Geofence endpoints
router.post(
  '/sessions/:sessionId/geofence/enter',
  validateRequest({ body: geofenceEventSchema }),
  catchAsync(trackingController.geofenceEnter)
);

router.post(
  '/sessions/:sessionId/geofence/exit',
  validateRequest({ body: geofenceEventSchema }),
  catchAsync(trackingController.geofenceExit)
);

// ETA endpoints
router.get('/sessions/:sessionId/eta', catchAsync(trackingController.getEta));
router.patch(
  '/sessions/:sessionId/eta',
  validateRequest({ body: updateEtaSchema }),
  catchAsync(trackingController.updateEta)
);

export default router;
