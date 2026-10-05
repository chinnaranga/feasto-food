import { Types } from 'mongoose';
import { Rider, IRiderDocument } from './riders.model.js';
import { RiderVehicle, IRiderVehicleDocument } from './models/riderVehicle.model.js';
import { RiderDocument, IRiderDocumentDocument } from './models/riderDocument.model.js';
import { RiderAvailability, IRiderAvailabilityDocument } from './models/riderAvailability.model.js';
import { RiderAssignment, IRiderAssignmentDocument } from './models/riderAssignment.model.js';

export class RidersRepository {
  // --- Rider Repository ---
  async createRider(data: Partial<IRiderDocument>): Promise<IRiderDocument> {
    const rider = new Rider(data);
    return rider.save();
  }

  async findRiderById(riderId: string | Types.ObjectId): Promise<IRiderDocument | null> {
    return Rider.findOne({ _id: riderId, isDeleted: false }).exec();
  }

  async findRiderByUserId(userId: string | Types.ObjectId): Promise<IRiderDocument | null> {
    return Rider.findOne({ userId, isDeleted: false }).exec();
  }

  async listRiders(query: Record<string, unknown> = {}): Promise<IRiderDocument[]> {
    return Rider.find({ isDeleted: false, ...query }).exec();
  }

  async updateRider(
    riderId: string | Types.ObjectId,
    data: Partial<IRiderDocument>
  ): Promise<IRiderDocument | null> {
    return Rider.findOneAndUpdate({ _id: riderId, isDeleted: false }, { $set: data }, { new: true, runValidators: true }).exec();
  }

  // --- Vehicle Repository ---
  async createVehicle(data: Partial<IRiderVehicleDocument>): Promise<IRiderVehicleDocument> {
    const vehicle = new RiderVehicle(data);
    return vehicle.save();
  }

  async listVehicles(riderId: string | Types.ObjectId): Promise<IRiderVehicleDocument[]> {
    return RiderVehicle.find({ riderId }).exec();
  }

  async findVehicleById(vehicleId: string | Types.ObjectId): Promise<IRiderVehicleDocument | null> {
    return RiderVehicle.findById(vehicleId).exec();
  }

  async updateVehicle(
    vehicleId: string | Types.ObjectId,
    data: Partial<IRiderVehicleDocument>
  ): Promise<IRiderVehicleDocument | null> {
    return RiderVehicle.findByIdAndUpdate(vehicleId, { $set: data }, { new: true, runValidators: true }).exec();
  }

  async deleteVehicle(vehicleId: string | Types.ObjectId): Promise<boolean> {
    const res = await RiderVehicle.findByIdAndDelete(vehicleId).exec();
    return res !== null;
  }

  // --- Document Repository ---
  async createDocument(data: Partial<IRiderDocumentDocument>): Promise<IRiderDocumentDocument> {
    const doc = new RiderDocument(data);
    return doc.save();
  }

  async listDocuments(riderId: string | Types.ObjectId): Promise<IRiderDocumentDocument[]> {
    return RiderDocument.find({ riderId }).exec();
  }

  async findDocumentById(documentId: string | Types.ObjectId): Promise<IRiderDocumentDocument | null> {
    return RiderDocument.findById(documentId).exec();
  }

  async updateDocument(
    documentId: string | Types.ObjectId,
    data: Partial<IRiderDocumentDocument>
  ): Promise<IRiderDocumentDocument | null> {
    return RiderDocument.findByIdAndUpdate(documentId, { $set: data }, { new: true, runValidators: true }).exec();
  }

  async deleteDocument(documentId: string | Types.ObjectId): Promise<boolean> {
    const res = await RiderDocument.findByIdAndDelete(documentId).exec();
    return res !== null;
  }

  // --- Availability Repository ---
  async getAvailability(riderId: string | Types.ObjectId): Promise<IRiderAvailabilityDocument | null> {
    return RiderAvailability.findOne({ riderId }).exec();
  }

  async upsertAvailability(
    riderId: string | Types.ObjectId,
    data: Partial<IRiderAvailabilityDocument>
  ): Promise<IRiderAvailabilityDocument> {
    return RiderAvailability.findOneAndUpdate(
      { riderId },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    ).exec();
  }

  // --- Assignment & Delivery Repository ---
  async createAssignment(data: Partial<IRiderAssignmentDocument>): Promise<IRiderAssignmentDocument> {
    const assignment = new RiderAssignment(data);
    return assignment.save();
  }

  async listAssignments(riderId: string | Types.ObjectId): Promise<IRiderAssignmentDocument[]> {
    return RiderAssignment.find({ riderId }).sort({ createdAt: -1 }).exec();
  }

  async findAssignmentById(assignmentId: string | Types.ObjectId): Promise<IRiderAssignmentDocument | null> {
    return RiderAssignment.findById(assignmentId).exec();
  }

  async updateAssignment(
    assignmentId: string | Types.ObjectId,
    data: Partial<IRiderAssignmentDocument>
  ): Promise<IRiderAssignmentDocument | null> {
    return RiderAssignment.findByIdAndUpdate(assignmentId, { $set: data }, { new: true, runValidators: true }).exec();
  }

  async countActiveAssignments(riderId: string | Types.ObjectId): Promise<number> {
    return RiderAssignment.countDocuments({
      riderId,
      assignmentStatus: 'accepted',
      deliveryStatus: { $ne: 'delivered' },
    }).exec();
  }

  async countCompletedAssignments(riderId: string | Types.ObjectId): Promise<number> {
    return RiderAssignment.countDocuments({
      riderId,
      assignmentStatus: 'completed',
      deliveryStatus: 'delivered',
    }).exec();
  }
}

export const ridersRepository = new RidersRepository();
