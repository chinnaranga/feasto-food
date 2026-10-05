import { Types } from 'mongoose';
import { ridersRepository, RidersRepository } from './riders.repository.js';
import {
  CreateRiderDTO,
  UpdateRiderDTO,
  AddVehicleDTO,
  UpdateVehicleDTO,
  UploadDocumentDTO,
  UpdateDocumentStatusDTO,
  UpdateAvailabilityDTO,
  UpdateZonesDTO,
  RiderReadinessResponse,
  RiderSummaryResponse,
} from './riders.types.js';
import { calculateRiderCompleteness, evaluateRiderReadiness } from './riders.utils.js';
import { RIDER_ERROR_CODES, RIDER_DELIVERY_TRANSITIONS } from './riders.constants.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { BadRequestError } from '../../shared/errors/BadRequestError.js';
import { IRiderDocument } from './riders.model.js';
import { IRiderVehicleDocument } from './models/riderVehicle.model.js';
import { IRiderDocumentDocument } from './models/riderDocument.model.js';
import { IRiderAvailabilityDocument } from './models/riderAvailability.model.js';
import { IRiderAssignmentDocument, RiderDeliveryStatus } from './models/riderAssignment.model.js';
import { Order } from '../orders/orders.model.js';
import { socketGateway } from '../../config/socket.js';
import { logger } from '../../shared/utils/logger.js';

export class RidersService {
  constructor(private repo: RidersRepository = ridersRepository) {}

  // --- Rider Profile Service ---
  async createRiderProfile(userId: string, dto: CreateRiderDTO): Promise<IRiderDocument> {
    let existing = await this.repo.findRiderByUserId(userId);
    if (existing) {
      return existing;
    }

    const rider = await this.repo.createRider({
      userId: new Types.ObjectId(userId),
      fullName: dto.fullName,
      phone: dto.phone,
      email: dto.email.toLowerCase(),
      profilePhoto: dto.profilePhoto,
      preferredZones: dto.preferredZones || [],
      profileCompleteness: 50,
    });

    // Initialize Availability Document
    await this.repo.upsertAvailability(rider._id, { isOnline: false, breakMode: false });

    logger.info({ riderId: rider._id.toString(), userId }, '🏍️ Rider profile created');
    return rider;
  }

  async getRider(riderId: string): Promise<IRiderDocument> {
    const rider = await this.repo.findRiderById(riderId);
    if (!rider) {
      throw new NotFoundError('Rider profile not found', RIDER_ERROR_CODES.RIDER_NOT_FOUND);
    }
    return rider;
  }

  async getRiderByUserId(userId: string): Promise<IRiderDocument> {
    const rider = await this.repo.findRiderByUserId(userId);
    if (!rider) {
      throw new NotFoundError('Rider profile not found for user', RIDER_ERROR_CODES.RIDER_NOT_FOUND);
    }
    return rider;
  }

  async updateRider(riderId: string, dto: UpdateRiderDTO): Promise<IRiderDocument> {
    const rider = await this.repo.updateRider(riderId, dto);
    if (!rider) {
      throw new NotFoundError('Rider profile not found', RIDER_ERROR_CODES.RIDER_NOT_FOUND);
    }
    logger.info({ riderId }, '🏍️ Rider profile updated');
    return rider;
  }

  async deleteRider(riderId: string): Promise<{ success: boolean }> {
    const rider = await this.repo.updateRider(riderId, { isDeleted: true });
    if (!rider) {
      throw new NotFoundError('Rider profile not found', RIDER_ERROR_CODES.RIDER_NOT_FOUND);
    }
    return { success: true };
  }

  async getRiderSummary(riderId: string): Promise<RiderSummaryResponse> {
    const rider = await this.getRider(riderId);
    const vehicles = await this.repo.listVehicles(riderId);
    const documents = await this.repo.listDocuments(riderId);
    const activeDeliveriesCount = await this.repo.countActiveAssignments(riderId);
    const completedDeliveriesCount = await this.repo.countCompletedAssignments(riderId);

    const approvedDocsCount = documents.filter((d) => d.status === 'approved').length;

    return {
      riderId: rider._id.toString(),
      fullName: rider.fullName,
      email: rider.email,
      phone: rider.phone,
      accountStatus: rider.accountStatus,
      verificationStatus: rider.verificationStatus,
      availabilityStatus: rider.availabilityStatus,
      profileCompleteness: rider.profileCompleteness,
      rating: rider.rating,
      stats: {
        activeDeliveriesCount,
        completedDeliveriesCount,
        vehiclesCount: vehicles.length,
        approvedDocumentsCount: approvedDocsCount,
      },
      createdAt: rider.createdAt,
    };
  }

  async getRiderReadiness(riderId: string): Promise<RiderReadinessResponse> {
    const rider = await this.getRider(riderId);
    const vehicles = await this.repo.listVehicles(riderId);
    const documents = await this.repo.listDocuments(riderId);

    return evaluateRiderReadiness(rider, vehicles, documents);
  }

  // --- Vehicle Management ---
  async addVehicle(riderId: string, dto: AddVehicleDTO): Promise<IRiderVehicleDocument> {
    await this.getRider(riderId);

    if (dto.isPrimary) {
      const existingVehicles = await this.repo.listVehicles(riderId);
      for (const v of existingVehicles) {
        if (v.isPrimary) {
          await this.repo.updateVehicle(v._id, { isPrimary: false });
        }
      }
    }

    const vehicle = await this.repo.createVehicle({
      riderId: new Types.ObjectId(riderId),
      vehicleType: dto.vehicleType,
      vehicleBrand: dto.vehicleBrand,
      vehicleModel: dto.vehicleModel,
      vehicleColor: dto.vehicleColor,
      vehicleNumber: dto.vehicleNumber,
      licenseNumber: dto.licenseNumber,
      licenseExpiryDate: dto.licenseExpiryDate ? new Date(dto.licenseExpiryDate) : undefined,
      isPrimary: dto.isPrimary ?? true,
    });

    await this.recalculateCompleteness(riderId);
    logger.info({ riderId, vehicleId: vehicle._id.toString() }, '🚗 Vehicle added to rider profile');
    return vehicle;
  }

  async listVehicles(riderId: string): Promise<IRiderVehicleDocument[]> {
    return this.repo.listVehicles(riderId);
  }

  async updateVehicle(
    riderId: string,
    vehicleId: string,
    dto: UpdateVehicleDTO
  ): Promise<IRiderVehicleDocument> {
    const vehicle = await this.repo.findVehicleById(vehicleId);
    if (!vehicle || vehicle.riderId.toString() !== riderId) {
      throw new NotFoundError('Vehicle not found', RIDER_ERROR_CODES.VEHICLE_NOT_FOUND);
    }

    if (dto.isPrimary) {
      const existingVehicles = await this.repo.listVehicles(riderId);
      for (const v of existingVehicles) {
        if (v._id.toString() !== vehicleId && v.isPrimary) {
          await this.repo.updateVehicle(v._id, { isPrimary: false });
        }
      }
    }

    const updated = await this.repo.updateVehicle(vehicleId, {
      ...dto,
      licenseExpiryDate: dto.licenseExpiryDate ? new Date(dto.licenseExpiryDate) : vehicle.licenseExpiryDate,
    });
    return updated!;
  }

  async deleteVehicle(riderId: string, vehicleId: string): Promise<{ success: boolean }> {
    const vehicle = await this.repo.findVehicleById(vehicleId);
    if (!vehicle || vehicle.riderId.toString() !== riderId) {
      throw new NotFoundError('Vehicle not found', RIDER_ERROR_CODES.VEHICLE_NOT_FOUND);
    }
    await this.repo.deleteVehicle(vehicleId);
    await this.recalculateCompleteness(riderId);
    return { success: true };
  }

  // --- Document Management ---
  async uploadDocument(riderId: string, dto: UploadDocumentDTO): Promise<IRiderDocumentDocument> {
    await this.getRider(riderId);

    const doc = await this.repo.createDocument({
      riderId: new Types.ObjectId(riderId),
      documentType: dto.documentType,
      documentNumber: dto.documentNumber,
      documentUrl: dto.documentUrl,
      expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
      status: 'pending_review',
    });

    await this.repo.updateRider(riderId, { verificationStatus: 'pending_review' });
    await this.recalculateCompleteness(riderId);
    logger.info({ riderId, documentId: doc._id.toString() }, '📄 Verification document uploaded');
    return doc;
  }

  async listDocuments(riderId: string): Promise<IRiderDocumentDocument[]> {
    return this.repo.listDocuments(riderId);
  }

  async updateDocumentStatus(
    riderId: string,
    documentId: string,
    dto: UpdateDocumentStatusDTO
  ): Promise<IRiderDocumentDocument> {
    const doc = await this.repo.findDocumentById(documentId);
    if (!doc || doc.riderId.toString() !== riderId) {
      throw new NotFoundError('Document not found', RIDER_ERROR_CODES.DOCUMENT_NOT_FOUND);
    }

    const updated = await this.repo.updateDocument(documentId, dto);

    // If all required documents are approved, promote rider to verified status
    const allDocs = await this.repo.listDocuments(riderId);
    const approvedCount = allDocs.filter((d) => d.status === 'approved').length;
    if (approvedCount >= 2) {
      await this.repo.updateRider(riderId, { verificationStatus: 'verified', accountStatus: 'active' });
    }

    await this.recalculateCompleteness(riderId);
    return updated!;
  }

  async deleteDocument(riderId: string, documentId: string): Promise<{ success: boolean }> {
    const doc = await this.repo.findDocumentById(documentId);
    if (!doc || doc.riderId.toString() !== riderId) {
      throw new NotFoundError('Document not found', RIDER_ERROR_CODES.DOCUMENT_NOT_FOUND);
    }
    await this.repo.deleteDocument(documentId);
    await this.recalculateCompleteness(riderId);
    return { success: true };
  }

  // --- Shift Availability & Zones ---
  async getAvailability(riderId: string): Promise<IRiderAvailabilityDocument> {
    let avail = await this.repo.getAvailability(riderId);
    if (!avail) {
      avail = await this.repo.upsertAvailability(riderId, { isOnline: false, breakMode: false });
    }
    return avail;
  }

  async updateAvailability(riderId: string, dto: UpdateAvailabilityDTO): Promise<IRiderAvailabilityDocument> {
    const readiness = await this.getRiderReadiness(riderId);
    if (dto.isOnline && !readiness.isEligibleForDispatch) {
      throw new BadRequestError(
        `Cannot go online: missing verification requirements (${readiness.missingRequirements.join(', ')})`,
        RIDER_ERROR_CODES.RIDER_NOT_ELIGIBLE_FOR_DISPATCH
      );
    }

    const avail = await this.repo.upsertAvailability(riderId, dto);
    const newStatus = dto.isOnline ? (dto.breakMode ? 'break' : 'online') : 'offline';

    await this.repo.updateRider(riderId, { availabilityStatus: newStatus, lastActiveAt: new Date() });

    // Emit Realtime socket broadcast to riders namespace
    socketGateway.emitToRoom('/riders', `rider:${riderId}`, 'rider:availability_changed', {
      riderId,
      isOnline: dto.isOnline,
      status: newStatus,
    });

    logger.info({ riderId, isOnline: dto.isOnline, newStatus }, '🟢 Rider availability updated');
    return avail;
  }

  async updateZones(riderId: string, dto: UpdateZonesDTO): Promise<IRiderDocument> {
    const updated = await this.repo.updateRider(riderId, dto);
    if (!updated) {
      throw new NotFoundError('Rider profile not found', RIDER_ERROR_CODES.RIDER_NOT_FOUND);
    }
    return updated;
  }

  // --- Assignments & Delivery Lifecycle ---
  async listAssignments(riderId: string): Promise<IRiderAssignmentDocument[]> {
    return this.repo.listAssignments(riderId);
  }

  async updateDeliveryStatus(
    riderId: string,
    assignmentId: string,
    newDeliveryStatus: RiderDeliveryStatus
  ): Promise<IRiderAssignmentDocument> {
    const assignment = await this.repo.findAssignmentById(assignmentId);
    if (!assignment || assignment.riderId.toString() !== riderId) {
      throw new NotFoundError('Assignment not found', RIDER_ERROR_CODES.ASSIGNMENT_NOT_FOUND);
    }

    const currentStatus = assignment.deliveryStatus;
    const allowedTransitions = RIDER_DELIVERY_TRANSITIONS[currentStatus] || [];

    if (!allowedTransitions.includes(newDeliveryStatus)) {
      throw new BadRequestError(
        `Cannot transition delivery status from '${currentStatus}' to '${newDeliveryStatus}'`,
        RIDER_ERROR_CODES.INVALID_DELIVERY_TRANSITION
      );
    }

    assignment.deliveryStatus = newDeliveryStatus;
    if (newDeliveryStatus === 'picked_up') assignment.pickedUpAt = new Date();
    if (newDeliveryStatus === 'delivered') {
      assignment.deliveredAt = new Date();
      assignment.assignmentStatus = 'completed';

      // Update associated Order status to delivered
      await Order.findByIdAndUpdate(assignment.orderId, {
        $set: { orderStatus: 'delivered', fulfillmentStatus: 'delivered', deliveredAt: new Date() },
      });

      // Reset rider availability status back to online
      await this.repo.updateRider(riderId, { availabilityStatus: 'online' });
    }

    await assignment.save();

    // Broadcast Realtime delivery tracking event
    socketGateway.emitToRoom('/orders', `order:${assignment.orderId.toString()}`, 'delivery:status_updated', {
      orderId: assignment.orderId.toString(),
      deliveryStatus: newDeliveryStatus,
      riderId,
      updatedAt: new Date(),
    });

    logger.info({ riderId, assignmentId, newDeliveryStatus }, '🚚 Delivery status updated & broadcasted');
    return assignment;
  }

  private async recalculateCompleteness(riderId: string): Promise<void> {
    const rider = await this.repo.findRiderById(riderId);
    if (!rider) return;

    const vehicles = await this.repo.listVehicles(riderId);
    const documents = await this.repo.listDocuments(riderId);
    const approvedDocs = documents.filter((d) => d.status === 'approved').length;

    const completeness = calculateRiderCompleteness(rider, vehicles.length > 0, approvedDocs);
    await this.repo.updateRider(riderId, { profileCompleteness: completeness });
  }
}

export const ridersService = new RidersService();
