import {
  RiderAccountStatus,
  RiderVerificationStatus,
  RiderAvailabilityStatus,
} from './riders.model.js';
import { VehicleType } from './models/riderVehicle.model.js';
import { DocumentType, DocumentStatus } from './models/riderDocument.model.js';
import { AssignmentStatus, RiderDeliveryStatus } from './models/riderAssignment.model.js';

export interface CreateRiderDTO {
  fullName: string;
  phone: string;
  email: string;
  profilePhoto?: string;
  preferredZones?: string[];
}

export interface UpdateRiderDTO extends Partial<CreateRiderDTO> {
  currentZone?: string;
  accountStatus?: RiderAccountStatus;
}

export interface AddVehicleDTO {
  vehicleType: VehicleType;
  vehicleBrand?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  vehicleNumber?: string;
  licenseNumber?: string;
  licenseExpiryDate?: string;
  isPrimary?: boolean;
}

export interface UpdateVehicleDTO extends Partial<AddVehicleDTO> {}

export interface UploadDocumentDTO {
  documentType: DocumentType;
  documentNumber?: string;
  documentUrl: string;
  expiryDate?: string;
}

export interface UpdateDocumentStatusDTO {
  status: DocumentStatus;
  rejectionReason?: string;
}

export interface UpdateAvailabilityDTO {
  isOnline: boolean;
  breakMode?: boolean;
}

export interface UpdateZonesDTO {
  currentZone?: string;
  preferredZones?: string[];
}

export interface UpdateDeliveryStatusDTO {
  deliveryStatus: RiderDeliveryStatus;
}

export interface RiderReadinessResponse {
  riderId: string;
  isEligibleForDispatch: boolean;
  profileCompleteness: number;
  verificationStatus: RiderVerificationStatus;
  availabilityStatus: RiderAvailabilityStatus;
  hasPrimaryVehicle: boolean;
  approvedDocumentsCount: number;
  missingRequirements: string[];
}

export interface RiderSummaryResponse {
  riderId: string;
  fullName: string;
  email: string;
  phone: string;
  accountStatus: RiderAccountStatus;
  verificationStatus: RiderVerificationStatus;
  availabilityStatus: RiderAvailabilityStatus;
  profileCompleteness: number;
  rating: number;
  stats: {
    activeDeliveriesCount: number;
    completedDeliveriesCount: number;
    vehiclesCount: number;
    approvedDocumentsCount: number;
  };
  createdAt: Date;
}
