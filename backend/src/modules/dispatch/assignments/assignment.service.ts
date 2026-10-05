import { DeliveryAssignmentModel, DeliveryAssignmentDocument } from '../models/deliveryAssignment.model.js';
import { DeliveryOfferModel } from '../models/deliveryOffer.model.js';
import { Order } from '../../orders/orders.model.js';
import { generateAssignmentId } from '../dispatch.utils.js';
import { IDeliveryAssignment } from '../dispatch.types.js';
import { socketGateway } from '../../../config/socket.js';
import { notificationsService } from '../../notifications/notifications.service.js';
import { NotFoundError } from '../../../shared/errors/NotFoundError.js';
import { BadRequestError } from '../../../shared/errors/BadRequestError.js';
import { ConflictError } from '../../../shared/errors/ConflictError.js';

export class AssignmentService {
  async acceptOfferAndAssign(offerId: string, riderId: string): Promise<DeliveryAssignmentDocument> {
    const offer = await DeliveryOfferModel.findOne({ offerId, riderId, status: 'PENDING' });
    if (!offer) {
      throw new NotFoundError(`Active offer ${offerId} not found or expired`);
    }

    if (new Date() > offer.expiresAt) {
      offer.status = 'EXPIRED';
      await offer.save();
      throw new BadRequestError('Offer has expired');
    }

    // Atomic update to mark offer accepted
    const updatedOffer = await DeliveryOfferModel.findOneAndUpdate(
      { offerId, status: 'PENDING' },
      { status: 'ACCEPTED', respondedAt: new Date() },
      { new: true }
    );

    if (!updatedOffer) {
      throw new ConflictError('Offer was already responded to or accepted by another transaction');
    }

    const assignmentId = generateAssignmentId();
    const assignment = await DeliveryAssignmentModel.create({
      assignmentId,
      orderId: offer.orderId,
      riderId,
      restaurantId: offer.restaurantId,
      branchId: offer.branchId,
      offerId: offer.offerId,
      assignmentStatus: 'ACCEPTED',
      assignmentVersion: 1,
      assignedAt: new Date(),
      acceptedAt: new Date(),
    });

    // Update canonical Order model
    const order = await Order.findById(offer.orderId);
    if (order) {
      order.fulfillmentStatus = 'assigned';
      await order.save();

      await notificationsService.dispatchNotificationEvent({
        type: 'RIDER_ASSIGNED',
        recipientUserId: order.customerId.toString(),
        entityType: 'order',
        entityId: offer.orderId,
        payload: {
          orderNumber: order.orderNumber,
          riderId,
        },
      });
    }

    // Real-time socket emissions
    socketGateway.emitToRoom('/riders', `rider:${riderId}`, 'rider.offer.accepted', { assignmentId });
    socketGateway.emitToRoom('/restaurants', `restaurant:${offer.restaurantId}`, 'restaurant.rider_assigned', {
      orderId: offer.orderId,
      riderId,
    });
    socketGateway.emitToRoom('/orders', `order:${offer.orderId}`, 'delivery.assigned', { riderId });

    return assignment;
  }

  async findRiderAssignments(riderId: string): Promise<DeliveryAssignmentDocument[]> {
    return DeliveryAssignmentModel.find({ riderId }).sort({ createdAt: -1 });
  }

  async findAssignmentById(assignmentId: string): Promise<DeliveryAssignmentDocument | null> {
    return DeliveryAssignmentModel.findOne({ assignmentId });
  }

  async startPickup(assignmentId: string, riderId: string): Promise<DeliveryAssignmentDocument> {
    const assignment = await DeliveryAssignmentModel.findOneAndUpdate(
      { assignmentId, riderId, assignmentStatus: 'ACCEPTED' },
      { assignmentStatus: 'PICKUP_PENDING', pickupStartedAt: new Date() },
      { new: true }
    );
    if (!assignment) throw new NotFoundError(`Assignment ${assignmentId} not found or invalid state`);
    return assignment;
  }

  async confirmPickup(assignmentId: string, riderId: string): Promise<DeliveryAssignmentDocument> {
    const assignment = await DeliveryAssignmentModel.findOneAndUpdate(
      { assignmentId, riderId, assignmentStatus: { $in: ['ACCEPTED', 'PICKUP_PENDING'] } },
      { assignmentStatus: 'PICKED_UP', pickupCompletedAt: new Date() },
      { new: true }
    );
    if (!assignment) throw new NotFoundError(`Assignment ${assignmentId} not found or invalid state`);

    const order = await Order.findById(assignment.orderId);
    if (order) {
      order.orderStatus = 'out_for_delivery';
      order.fulfillmentStatus = 'picked_up';
      await order.save();
    }

    return assignment;
  }

  async startDelivery(assignmentId: string, riderId: string): Promise<DeliveryAssignmentDocument> {
    const assignment = await DeliveryAssignmentModel.findOneAndUpdate(
      { assignmentId, riderId },
      { assignmentStatus: 'OUT_FOR_DELIVERY', deliveryStartedAt: new Date() },
      { new: true }
    );
    if (!assignment) throw new NotFoundError(`Assignment ${assignmentId} not found`);
    return assignment;
  }

  async completeDelivery(assignmentId: string, riderId: string): Promise<DeliveryAssignmentDocument> {
    const assignment = await DeliveryAssignmentModel.findOneAndUpdate(
      { assignmentId, riderId },
      { assignmentStatus: 'COMPLETED', completedAt: new Date() },
      { new: true }
    );
    if (!assignment) throw new NotFoundError(`Assignment ${assignmentId} not found`);

    const order = await Order.findById(assignment.orderId);
    if (order) {
      order.orderStatus = 'delivered';
      order.fulfillmentStatus = 'delivered';
      await order.save();

      await notificationsService.dispatchNotificationEvent({
        type: 'ORDER_DELIVERED',
        recipientUserId: order.customerId.toString(),
        entityType: 'order',
        entityId: assignment.orderId,
        payload: { orderNumber: order.orderNumber },
      });
    }

    return assignment;
  }

  async reassignOrder(orderId: string, _reason?: string): Promise<DeliveryAssignmentDocument | null> {
    const active = await DeliveryAssignmentModel.findOne({
      orderId,
      assignmentStatus: { $in: ['ACCEPTED', 'PICKUP_PENDING', 'PICKED_UP', 'OUT_FOR_DELIVERY'] },
    });

    if (active) {
      active.assignmentStatus = 'REASSIGNMENT_REQUIRED';
      active.cancelledAt = new Date();
      await active.save();
    }

    const order = await Order.findById(orderId);
    if (order) {
      order.fulfillmentStatus = 'unassigned';
      await order.save();
    }

    socketGateway.emitToRoom('/orders', `order:${orderId}`, 'delivery.reassignment_required', { orderId });
    return active;
  }
}

export const assignmentService = new AssignmentService();
