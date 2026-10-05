import { DeliveryOfferModel, DeliveryOfferDocument } from '../models/deliveryOffer.model.js';
import { generateOfferId } from '../dispatch.utils.js';
import { IDeliveryOffer } from '../dispatch.types.js';
import { socketGateway } from '../../../config/socket.js';
import { notificationsService } from '../../notifications/notifications.service.js';

export class OfferService {
  async createOffer(data: {
    orderId: string;
    riderId: string;
    restaurantId: string;
    branchId?: string;
    score: number;
    distanceToRestaurantKm: number;
    offerTimeoutSeconds?: number;
  }): Promise<DeliveryOfferDocument> {
    const offerId = generateOfferId();
    const timeout = data.offerTimeoutSeconds || 45;
    const expiresAt = new Date(Date.now() + timeout * 1000);

    const offer = await DeliveryOfferModel.create({
      offerId,
      orderId: data.orderId,
      riderId: data.riderId,
      restaurantId: data.restaurantId,
      branchId: data.branchId,
      status: 'PENDING',
      score: data.score,
      distanceToRestaurantKm: data.distanceToRestaurantKm,
      estimatedPickupTimeMinutes: 15,
      expiresAt,
    });

    // Socket.IO Emission to Rider Room
    socketGateway.emitToRoom('/riders', `rider:${data.riderId}`, 'dispatch.offer.created', {
      offerId,
      orderId: data.orderId,
      restaurantId: data.restaurantId,
      expiresAt,
      distanceToRestaurantKm: data.distanceToRestaurantKm,
    });

    // Event-driven Phase 9 Notification
    await notificationsService.dispatchNotificationEvent({
      type: 'NEW_DELIVERY_OFFER',
      recipientUserId: data.riderId,
      entityType: 'order',
      entityId: data.orderId,
      payload: {
        offerId,
        orderId: data.orderId,
      },
    });

    return offer;
  }

  async findOfferById(offerId: string): Promise<DeliveryOfferDocument | null> {
    return DeliveryOfferModel.findOne({ offerId });
  }

  async findRiderOffers(riderId: string): Promise<DeliveryOfferDocument[]> {
    return DeliveryOfferModel.find({ riderId, status: 'PENDING', expiresAt: { $gt: new Date() } }).sort({
      createdAt: -1,
    });
  }

  async rejectOffer(offerId: string, riderId: string, reason?: any): Promise<DeliveryOfferDocument | null> {
    const offer = await DeliveryOfferModel.findOneAndUpdate(
      { offerId, riderId, status: 'PENDING' },
      { status: 'REJECTED', respondedAt: new Date(), rejectionReason: reason || 'OTHER' },
      { new: true }
    );

    if (offer) {
      socketGateway.emitToRoom('/riders', `rider:${riderId}`, 'rider.offer.rejected', { offerId });
    }

    return offer;
  }
}

export const offerService = new OfferService();
