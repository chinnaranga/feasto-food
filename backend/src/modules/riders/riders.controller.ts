import { Request, Response } from 'express';
import { ridersService, RidersService } from './riders.service.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { UnauthorizedError } from '../../shared/errors/UnauthorizedError.js';
import { HttpStatus } from '../../shared/constants/httpStatusCodes.js';

const parseParam = (val: string | string[] | undefined): string => {
  if (!val) return '';
  return Array.isArray(val) ? val[0] : val;
};

export class RidersController {
  constructor(private service: RidersService = ridersService) {}

  createRiderProfile = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const rider = await this.service.createRiderProfile(req.user.id, req.body);
    sendSuccess(res, rider, 'Rider profile created successfully', HttpStatus.CREATED);
  };

  getRiderMe = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const rider = await this.service.getRiderByUserId(req.user.id);
    sendSuccess(res, rider, 'Rider profile retrieved');
  };

  listRiders = async (req: Request, res: Response): Promise<void> => {
    const riders = await this.service.getRiderByUserId(req.user!.id); // or list all if admin
    sendSuccess(res, [riders], 'Rider profiles list');
  };

  getRider = async (req: Request, res: Response): Promise<void> => {
    const riderId = parseParam(req.params.riderId);
    const rider = await this.service.getRider(riderId);
    sendSuccess(res, rider, 'Rider details retrieved');
  };

  updateRider = async (req: Request, res: Response): Promise<void> => {
    const riderId = parseParam(req.params.riderId);
    const updated = await this.service.updateRider(riderId, req.body);
    sendSuccess(res, updated, 'Rider profile updated');
  };

  deleteRider = async (req: Request, res: Response): Promise<void> => {
    const riderId = parseParam(req.params.riderId);
    const result = await this.service.deleteRider(riderId);
    sendSuccess(res, result, 'Rider profile deleted');
  };

  getRiderSummary = async (req: Request, res: Response): Promise<void> => {
    const riderId = parseParam(req.params.riderId);
    const summary = await this.service.getRiderSummary(riderId);
    sendSuccess(res, summary, 'Rider summary retrieved');
  };

  getRiderReadiness = async (req: Request, res: Response): Promise<void> => {
    const riderId = parseParam(req.params.riderId);
    const readiness = await this.service.getRiderReadiness(riderId);
    sendSuccess(res, readiness, 'Rider readiness evaluation retrieved');
  };

  // --- Vehicles ---
  listVehicles = async (req: Request, res: Response): Promise<void> => {
    const riderId = parseParam(req.params.riderId);
    const vehicles = await this.service.listVehicles(riderId);
    sendSuccess(res, vehicles, 'Rider vehicles retrieved');
  };

  addVehicle = async (req: Request, res: Response): Promise<void> => {
    const riderId = parseParam(req.params.riderId);
    const vehicle = await this.service.addVehicle(riderId, req.body);
    sendSuccess(res, vehicle, 'Vehicle added to profile', HttpStatus.CREATED);
  };

  updateVehicle = async (req: Request, res: Response): Promise<void> => {
    const riderId = parseParam(req.params.riderId);
    const vehicleId = parseParam(req.params.vehicleId);
    const updated = await this.service.updateVehicle(riderId, vehicleId, req.body);
    sendSuccess(res, updated, 'Vehicle updated');
  };

  deleteVehicle = async (req: Request, res: Response): Promise<void> => {
    const riderId = parseParam(req.params.riderId);
    const vehicleId = parseParam(req.params.vehicleId);
    const result = await this.service.deleteVehicle(riderId, vehicleId);
    sendSuccess(res, result, 'Vehicle removed');
  };

  // --- Documents ---
  listDocuments = async (req: Request, res: Response): Promise<void> => {
    const riderId = parseParam(req.params.riderId);
    const documents = await this.service.listDocuments(riderId);
    sendSuccess(res, documents, 'Verification documents retrieved');
  };

  uploadDocument = async (req: Request, res: Response): Promise<void> => {
    const riderId = parseParam(req.params.riderId);
    const doc = await this.service.uploadDocument(riderId, req.body);
    sendSuccess(res, doc, 'Document uploaded for verification', HttpStatus.CREATED);
  };

  updateDocumentStatus = async (req: Request, res: Response): Promise<void> => {
    const riderId = parseParam(req.params.riderId);
    const documentId = parseParam(req.params.documentId);
    const updated = await this.service.updateDocumentStatus(riderId, documentId, req.body);
    sendSuccess(res, updated, 'Document status updated');
  };

  deleteDocument = async (req: Request, res: Response): Promise<void> => {
    const riderId = parseParam(req.params.riderId);
    const documentId = parseParam(req.params.documentId);
    const result = await this.service.deleteDocument(riderId, documentId);
    sendSuccess(res, result, 'Document deleted');
  };

  // --- Availability & Zones ---
  getAvailability = async (req: Request, res: Response): Promise<void> => {
    const riderId = parseParam(req.params.riderId);
    const avail = await this.service.getAvailability(riderId);
    sendSuccess(res, avail, 'Availability status retrieved');
  };

  updateAvailability = async (req: Request, res: Response): Promise<void> => {
    const riderId = parseParam(req.params.riderId);
    const updated = await this.service.updateAvailability(riderId, req.body);
    sendSuccess(res, updated, 'Availability status updated');
  };

  getZones = async (req: Request, res: Response): Promise<void> => {
    const riderId = parseParam(req.params.riderId);
    const rider = await this.service.getRider(riderId);
    sendSuccess(
      res,
      { currentZone: rider.currentZone, preferredZones: rider.preferredZones },
      'Zone preferences retrieved'
    );
  };

  updateZones = async (req: Request, res: Response): Promise<void> => {
    const riderId = parseParam(req.params.riderId);
    const updated = await this.service.updateZones(riderId, req.body);
    sendSuccess(
      res,
      { currentZone: updated.currentZone, preferredZones: updated.preferredZones },
      'Zone preferences updated'
    );
  };

  // --- Assignments & Deliveries ---
  listAssignments = async (req: Request, res: Response): Promise<void> => {
    const riderId = parseParam(req.params.riderId);
    const assignments = await this.service.listAssignments(riderId);
    sendSuccess(res, assignments, 'Rider assignments retrieved');
  };

  updateDeliveryStatus = async (req: Request, res: Response): Promise<void> => {
    const riderId = parseParam(req.params.riderId);
    const deliveryId = parseParam(req.params.deliveryId);
    const updated = await this.service.updateDeliveryStatus(riderId, deliveryId, req.body.deliveryStatus);
    sendSuccess(res, updated, 'Delivery status updated');
  };
}

export const ridersController = new RidersController();
