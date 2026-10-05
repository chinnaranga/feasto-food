import { Request, Response } from 'express';
import { trackingService, TrackingService } from './tracking.service.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { HttpStatus } from '../../shared/constants/httpStatusCodes.js';

const parseParam = (val: string | string[] | undefined): string => {
  if (!val) return '';
  return Array.isArray(val) ? val[0] : val;
};

export class TrackingController {
  constructor(private service: TrackingService = trackingService) {}

  // --- Session Handlers ---
  createSession = async (req: Request, res: Response): Promise<void> => {
    const session = await this.service.createTrackingSession(req.body);
    sendSuccess(res, session, 'Tracking session created', HttpStatus.CREATED);
  };

  getSession = async (req: Request, res: Response): Promise<void> => {
    const sessionId = parseParam(req.params.sessionId);
    const session = await this.service.getSession(sessionId);
    sendSuccess(res, session, 'Tracking session details');
  };

  updateSessionStatus = async (req: Request, res: Response): Promise<void> => {
    const sessionId = parseParam(req.params.sessionId);
    const updated = await this.service.updateSessionStatus(sessionId, req.body.status);
    sendSuccess(res, updated, 'Tracking session status updated');
  };

  deleteSession = async (req: Request, res: Response): Promise<void> => {
    const sessionId = parseParam(req.params.sessionId);
    const updated = await this.service.updateSessionStatus(sessionId, 'completed');
    sendSuccess(res, updated, 'Tracking session completed and ended');
  };

  // --- Location Handlers ---
  pushLocation = async (req: Request, res: Response): Promise<void> => {
    const sessionId = parseParam(req.params.sessionId);
    const session = await this.service.pushRiderLocation(sessionId, req.body);
    sendSuccess(res, session, 'Location ping processed');
  };

  getLocation = async (req: Request, res: Response): Promise<void> => {
    const sessionId = parseParam(req.params.sessionId);
    const session = await this.service.getSession(sessionId);
    sendSuccess(res, session.currentLocation, 'Current location snapshot');
  };

  getLocationHistory = async (req: Request, res: Response): Promise<void> => {
    const sessionId = parseParam(req.params.sessionId);
    const history = await this.service.getLocationHistory(sessionId);
    sendSuccess(res, history, 'Location trail history retrieved');
  };

  // --- Order Tracking Views ---
  getOrderTracking = async (req: Request, res: Response): Promise<void> => {
    const orderId = parseParam(req.params.orderId);
    const trackingView = await this.service.getOrderTrackingView(orderId);
    sendSuccess(res, trackingView, 'Order tracking view retrieved');
  };

  getRestaurantOrderTracking = async (req: Request, res: Response): Promise<void> => {
    const orderId = parseParam(req.params.orderId);
    const trackingView = await this.service.getOrderTrackingView(orderId);
    sendSuccess(res, trackingView, 'Restaurant order pickup tracking view');
  };

  getCustomerOrderTracking = async (req: Request, res: Response): Promise<void> => {
    const orderId = parseParam(req.params.orderId);
    const trackingView = await this.service.getOrderTrackingView(orderId);
    sendSuccess(res, trackingView, 'Customer order delivery tracking view');
  };

  // --- Route Handlers ---
  saveRoute = async (req: Request, res: Response): Promise<void> => {
    const sessionId = parseParam(req.params.sessionId);
    const route = await this.service.saveRouteSnapshot(sessionId, req.body);
    sendSuccess(res, route, 'Route snapshot saved', HttpStatus.CREATED);
  };

  getRoute = async (req: Request, res: Response): Promise<void> => {
    const sessionId = parseParam(req.params.sessionId);
    const route = await this.service.getLatestRouteSnapshot(sessionId);
    sendSuccess(res, route, 'Route snapshot retrieved');
  };

  // --- Geofence Handlers ---
  geofenceEnter = async (req: Request, res: Response): Promise<void> => {
    const sessionId = parseParam(req.params.sessionId);
    const event = await this.service.recordGeofenceEvent(sessionId, {
      geofenceType: req.body.geofenceType,
      eventType: 'enter',
    });
    sendSuccess(res, event, 'Geofence enter event recorded', HttpStatus.CREATED);
  };

  geofenceExit = async (req: Request, res: Response): Promise<void> => {
    const sessionId = parseParam(req.params.sessionId);
    const event = await this.service.recordGeofenceEvent(sessionId, {
      geofenceType: req.body.geofenceType,
      eventType: 'exit',
    });
    sendSuccess(res, event, 'Geofence exit event recorded', HttpStatus.CREATED);
  };

  // --- ETA Handlers ---
  getEta = async (req: Request, res: Response): Promise<void> => {
    const sessionId = parseParam(req.params.sessionId);
    const session = await this.service.getSession(sessionId);
    sendSuccess(
      res,
      { etaMinutes: session.etaMinutes, distanceRemainingKm: session.distanceRemainingKm },
      'Live ETA details'
    );
  };

  updateEta = async (req: Request, res: Response): Promise<void> => {
    const sessionId = parseParam(req.params.sessionId);
    const updated = await this.service.updateEta(sessionId, req.body);
    sendSuccess(res, updated, 'Live ETA updated');
  };
}

export const trackingController = new TrackingController();
