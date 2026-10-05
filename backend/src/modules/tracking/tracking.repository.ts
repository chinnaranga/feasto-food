import { Types } from 'mongoose';
import {
  DeliveryTrackingSession,
  IDeliveryTrackingSessionDocument,
} from './tracking.model.js';
import {
  RiderLocationHistory,
  IRiderLocationHistoryDocument,
} from './models/riderLocationHistory.model.js';
import {
  DeliveryRouteSnapshot,
  IDeliveryRouteSnapshotDocument,
} from './models/deliveryRouteSnapshot.model.js';
import { GeofenceEvent, IGeofenceEventDocument } from './models/geofenceEvent.model.js';

export class TrackingRepository {
  // --- Tracking Session Repository ---
  async createSession(
    data: Partial<IDeliveryTrackingSessionDocument>
  ): Promise<IDeliveryTrackingSessionDocument> {
    const session = new DeliveryTrackingSession(data);
    return session.save();
  }

  async findSessionById(sessionId: string): Promise<IDeliveryTrackingSessionDocument | null> {
    return DeliveryTrackingSession.findOne({ sessionId }).exec();
  }

  async findActiveSessionByOrder(
    orderId: string | Types.ObjectId
  ): Promise<IDeliveryTrackingSessionDocument | null> {
    return DeliveryTrackingSession.findOne({ orderId, status: 'active' }).exec();
  }

  async updateSession(
    sessionId: string,
    data: Partial<IDeliveryTrackingSessionDocument>
  ): Promise<IDeliveryTrackingSessionDocument | null> {
    return DeliveryTrackingSession.findOneAndUpdate(
      { sessionId },
      { $set: data },
      { new: true, runValidators: true }
    ).exec();
  }

  // --- Location History Repository ---
  async recordLocationPing(
    data: Partial<IRiderLocationHistoryDocument>
  ): Promise<IRiderLocationHistoryDocument> {
    const history = new RiderLocationHistory(data);
    return history.save();
  }

  async listLocationHistory(
    sessionId: string | Types.ObjectId
  ): Promise<IRiderLocationHistoryDocument[]> {
    return RiderLocationHistory.find({ sessionId }).sort({ timestamp: -1 }).limit(100).exec();
  }

  // --- Route Snapshot Repository ---
  async saveRouteSnapshot(
    data: Partial<IDeliveryRouteSnapshotDocument>
  ): Promise<IDeliveryRouteSnapshotDocument> {
    const route = new DeliveryRouteSnapshot(data);
    return route.save();
  }

  async getLatestRouteSnapshot(
    sessionId: string | Types.ObjectId
  ): Promise<IDeliveryRouteSnapshotDocument | null> {
    return DeliveryRouteSnapshot.findOne({ sessionId }).sort({ createdAt: -1 }).exec();
  }

  // --- Geofence Repository ---
  async recordGeofenceEvent(
    data: Partial<IGeofenceEventDocument>
  ): Promise<IGeofenceEventDocument> {
    const event = new GeofenceEvent(data);
    return event.save();
  }

  async listGeofenceEvents(
    sessionId: string | Types.ObjectId
  ): Promise<IGeofenceEventDocument[]> {
    return GeofenceEvent.find({ sessionId }).sort({ createdAt: -1 }).exec();
  }
}

export const trackingRepository = new TrackingRepository();
