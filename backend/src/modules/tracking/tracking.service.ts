import { Types } from 'mongoose';
import { trackingRepository, TrackingRepository } from './tracking.repository.js';
import {
  CreateTrackingSessionDTO,
  PushLocationDTO,
  UpdateRouteDTO,
  GeofenceEventDTO,
  UpdateEtaDTO,
  OrderTrackingViewResponse,
} from './tracking.types.js';
import { calculateEtaMinutes } from './tracking.utils.js';
import { TRACKING_ERROR_CODES } from './tracking.constants.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { IDeliveryTrackingSessionDocument, TrackingSessionStatus } from './tracking.model.js';
import { IRiderLocationHistoryDocument } from './models/riderLocationHistory.model.js';
import { IDeliveryRouteSnapshotDocument } from './models/deliveryRouteSnapshot.model.js';
import { IGeofenceEventDocument } from './models/geofenceEvent.model.js';
import { Order } from '../orders/orders.model.js';
import { Rider } from '../riders/riders.model.js';
import { socketGateway } from '../../config/socket.js';
import { logger } from '../../shared/utils/logger.js';

export class TrackingService {
  constructor(private repo: TrackingRepository = trackingRepository) {}

  // --- Tracking Sessions ---
  async createTrackingSession(dto: CreateTrackingSessionDTO): Promise<IDeliveryTrackingSessionDocument> {
    const existing = await this.repo.findActiveSessionByOrder(dto.orderId);
    if (existing) {
      return existing;
    }

    const sessionId = `trk_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    const session = await this.repo.createSession({
      sessionId,
      orderId: new Types.ObjectId(dto.orderId),
      riderId: new Types.ObjectId(dto.riderId),
      restaurantId: new Types.ObjectId(dto.restaurantId),
      branchId: new Types.ObjectId(dto.branchId),
      customerId: new Types.ObjectId(dto.customerId),
      status: 'active',
      etaMinutes: 20,
      distanceRemainingKm: 4.5,
    });

    logger.info({ sessionId, orderId: dto.orderId }, '📍 Live delivery tracking session created');
    return session;
  }

  async getSession(sessionId: string): Promise<IDeliveryTrackingSessionDocument> {
    const session = await this.repo.findSessionById(sessionId);
    if (!session) {
      throw new NotFoundError('Tracking session not found', TRACKING_ERROR_CODES.TRACKING_SESSION_NOT_FOUND);
    }
    return session;
  }

  async updateSessionStatus(sessionId: string, status: TrackingSessionStatus): Promise<IDeliveryTrackingSessionDocument> {
    const session = await this.getSession(sessionId);
    session.status = status;
    if (status === 'completed' || status === 'cancelled') {
      session.endedAt = new Date();
    }
    await session.save();
    return session;
  }

  // --- Live Location Pings ---
  async pushRiderLocation(sessionId: string, dto: PushLocationDTO): Promise<IDeliveryTrackingSessionDocument> {
    const session = await this.getSession(sessionId);
    if (session.status !== 'active') {
      throw new NotFoundError('Tracking session is no longer active', TRACKING_ERROR_CODES.TRACKING_SESSION_EXPIRED);
    }

    // Update session current location
    session.currentLocation = {
      latitude: dto.latitude,
      longitude: dto.longitude,
      heading: dto.heading,
      speed: dto.speed,
      accuracy: dto.accuracy,
      timestamp: new Date(),
    };

    // Calculate dynamic ETA based on speed & remaining distance
    const computedEta = calculateEtaMinutes(session.distanceRemainingKm, dto.speed);
    session.etaMinutes = computedEta;
    await session.save();

    // Log location trail to location history
    await this.repo.recordLocationPing({
      sessionId: session._id,
      riderId: session.riderId,
      orderId: session.orderId,
      location: {
        type: 'Point',
        coordinates: [dto.longitude, dto.latitude],
      },
      heading: dto.heading,
      speed: dto.speed,
      accuracy: dto.accuracy,
      timestamp: new Date(),
    });

    // Also update lastKnownLocation on Rider Model for 2DSphere queries
    await Rider.findByIdAndUpdate(session.riderId, {
      $set: {
        lastKnownLocation: { type: 'Point', coordinates: [dto.longitude, dto.latitude] },
        lastActiveAt: new Date(),
      },
    });

    // Realtime Socket.IO Broadcast to order room
    socketGateway.emitToRoom('/orders', `order:${session.orderId.toString()}`, 'order:location_updated', {
      orderId: session.orderId.toString(),
      latitude: dto.latitude,
      longitude: dto.longitude,
      heading: dto.heading,
      speed: dto.speed,
      etaMinutes: computedEta,
      updatedAt: new Date(),
    });

    return session;
  }

  async getLocationHistory(sessionId: string): Promise<IRiderLocationHistoryDocument[]> {
    const session = await this.getSession(sessionId);
    return this.repo.listLocationHistory(session._id);
  }

  // --- Order Tracking Visibility ---
  async getOrderTrackingView(orderId: string): Promise<OrderTrackingViewResponse> {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    let session = await this.repo.findActiveSessionByOrder(orderId);
    let riderInfo;

    if (order.riderId) {
      const rider = await Rider.findById(order.riderId);
      if (rider) {
        riderInfo = {
          riderId: rider._id.toString(),
          fullName: rider.fullName,
          phone: rider.phone,
          profilePhoto: rider.profilePhoto,
        };
      }
    }

    return {
      sessionId: session ? session.sessionId : '',
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      deliveryStatus: order.fulfillmentStatus,
      riderInfo,
      currentLocation: session?.currentLocation
        ? {
            latitude: session.currentLocation.latitude,
            longitude: session.currentLocation.longitude,
            heading: session.currentLocation.heading,
            speed: session.currentLocation.speed,
            updatedAt: session.currentLocation.timestamp,
          }
        : undefined,
      etaMinutes: session ? session.etaMinutes : 20,
      distanceRemainingKm: session ? session.distanceRemainingKm : 3.5,
      trackingStatus: session ? session.status : 'completed',
      updatedAt: order.updatedAt,
    };
  }

  // --- Route & Geofence ---
  async saveRouteSnapshot(sessionId: string, dto: UpdateRouteDTO): Promise<IDeliveryRouteSnapshotDocument> {
    const session = await this.getSession(sessionId);
    session.distanceRemainingKm = dto.totalDistanceKm;
    session.etaMinutes = dto.estimatedDurationMinutes;
    await session.save();

    return this.repo.saveRouteSnapshot({
      sessionId: session._id,
      orderId: session.orderId,
      waypoints: dto.waypoints,
      totalDistanceKm: dto.totalDistanceKm,
      estimatedDurationMinutes: dto.estimatedDurationMinutes,
    });
  }

  async getLatestRouteSnapshot(sessionId: string): Promise<IDeliveryRouteSnapshotDocument | null> {
    const session = await this.getSession(sessionId);
    return this.repo.getLatestRouteSnapshot(session._id);
  }

  async recordGeofenceEvent(sessionId: string, dto: GeofenceEventDTO): Promise<IGeofenceEventDocument> {
    const session = await this.getSession(sessionId);
    const event = await this.repo.recordGeofenceEvent({
      sessionId: session._id,
      orderId: session.orderId,
      riderId: session.riderId,
      geofenceType: dto.geofenceType,
      eventType: dto.eventType,
    });

    // Socket Broadcast geofence event
    socketGateway.emitToRoom('/orders', `order:${session.orderId.toString()}`, 'geofence:triggered', {
      orderId: session.orderId.toString(),
      geofenceType: dto.geofenceType,
      eventType: dto.eventType,
      timestamp: new Date(),
    });

    logger.info({ sessionId, geofenceType: dto.geofenceType, eventType: dto.eventType }, '⭕ Geofence event recorded');
    return event;
  }

  async updateEta(sessionId: string, dto: UpdateEtaDTO): Promise<IDeliveryTrackingSessionDocument> {
    const session = await this.getSession(sessionId);
    session.etaMinutes = dto.etaMinutes;
    session.distanceRemainingKm = dto.distanceRemainingKm;
    await session.save();

    socketGateway.emitToRoom('/orders', `order:${session.orderId.toString()}`, 'eta:updated', {
      orderId: session.orderId.toString(),
      etaMinutes: dto.etaMinutes,
      distanceRemainingKm: dto.distanceRemainingKm,
    });

    return session;
  }
}

export const trackingService = new TrackingService();
