import { Router } from 'express';
import { ridersController } from './riders.controller.js';
import { validateRequest } from '../../shared/validators/common.js';
import {
  createRiderSchema,
  updateRiderSchema,
  addVehicleSchema,
  updateVehicleSchema,
  uploadDocumentSchema,
  updateDocumentStatusSchema,
  updateAvailabilitySchema,
  updateZonesSchema,
  updateDeliveryStatusSchema,
} from './riders.validation.js';
import { authenticate } from '../../shared/middleware/authMiddleware.js';
import { requireRiderAccess } from './riders.middleware.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import './riders.docs.ts';

const router = Router();

router.use(authenticate);

// Profile endpoints
router.post(
  '/',
  validateRequest({ body: createRiderSchema }),
  catchAsync(ridersController.createRiderProfile)
);

router.get('/me', catchAsync(ridersController.getRiderMe));
router.get('/', catchAsync(ridersController.listRiders));

router.get('/:riderId', requireRiderAccess, catchAsync(ridersController.getRider));

router.patch(
  '/:riderId',
  requireRiderAccess,
  validateRequest({ body: updateRiderSchema }),
  catchAsync(ridersController.updateRider)
);

router.delete('/:riderId', requireRiderAccess, catchAsync(ridersController.deleteRider));

router.get('/:riderId/summary', requireRiderAccess, catchAsync(ridersController.getRiderSummary));
router.get('/:riderId/readiness', requireRiderAccess, catchAsync(ridersController.getRiderReadiness));

// Vehicle endpoints
router.get('/:riderId/vehicles', requireRiderAccess, catchAsync(ridersController.listVehicles));

router.post(
  '/:riderId/vehicles',
  requireRiderAccess,
  validateRequest({ body: addVehicleSchema }),
  catchAsync(ridersController.addVehicle)
);

router.patch(
  '/:riderId/vehicles/:vehicleId',
  requireRiderAccess,
  validateRequest({ body: updateVehicleSchema }),
  catchAsync(ridersController.updateVehicle)
);

router.delete(
  '/:riderId/vehicles/:vehicleId',
  requireRiderAccess,
  catchAsync(ridersController.deleteVehicle)
);

// Document endpoints
router.get('/:riderId/documents', requireRiderAccess, catchAsync(ridersController.listDocuments));

router.post(
  '/:riderId/documents',
  requireRiderAccess,
  validateRequest({ body: uploadDocumentSchema }),
  catchAsync(ridersController.uploadDocument)
);

router.patch(
  '/:riderId/documents/:documentId',
  requireRiderAccess,
  validateRequest({ body: updateDocumentStatusSchema }),
  catchAsync(ridersController.updateDocumentStatus)
);

router.delete(
  '/:riderId/documents/:documentId',
  requireRiderAccess,
  catchAsync(ridersController.deleteDocument)
);

// Availability & Zones
router.get('/:riderId/availability', requireRiderAccess, catchAsync(ridersController.getAvailability));

router.patch(
  '/:riderId/availability',
  requireRiderAccess,
  validateRequest({ body: updateAvailabilitySchema }),
  catchAsync(ridersController.updateAvailability)
);

router.get('/:riderId/zones', requireRiderAccess, catchAsync(ridersController.getZones));

router.patch(
  '/:riderId/zones',
  requireRiderAccess,
  validateRequest({ body: updateZonesSchema }),
  catchAsync(ridersController.updateZones)
);

// Assignments & Deliveries
router.get('/:riderId/assignments', requireRiderAccess, catchAsync(ridersController.listAssignments));

router.patch(
  '/:riderId/deliveries/:deliveryId',
  requireRiderAccess,
  validateRequest({ body: updateDeliveryStatusSchema }),
  catchAsync(ridersController.updateDeliveryStatus)
);

export default router;
