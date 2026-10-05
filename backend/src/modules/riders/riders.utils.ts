import { IRiderDocument } from './riders.model.js';
import { IRiderVehicleDocument } from './models/riderVehicle.model.js';
import { IRiderDocumentDocument } from './models/riderDocument.model.js';
import { RiderReadinessResponse } from './riders.types.js';

export const calculateRiderCompleteness = (
  rider: IRiderDocument,
  hasVehicle: boolean,
  approvedDocCount: number
): number => {
  let score = 30; // Base score for registration

  if (rider.fullName && rider.phone && rider.email) score += 20;
  if (rider.profilePhoto) score += 10;
  if (hasVehicle) score += 20;
  if (approvedDocCount >= 2) score += 20;

  return Math.min(100, score);
};

export const evaluateRiderReadiness = (
  rider: IRiderDocument,
  vehicles: IRiderVehicleDocument[],
  documents: IRiderDocumentDocument[]
): RiderReadinessResponse => {
  const missingRequirements: string[] = [];

  const hasPrimaryVehicle = vehicles.some((v) => v.isPrimary);
  if (!hasPrimaryVehicle) {
    missingRequirements.push('Primary vehicle profile required');
  }

  const approvedDocs = documents.filter((d) => d.status === 'approved');
  if (approvedDocs.length < 2) {
    missingRequirements.push('At least 2 approved verification documents required (Driver License, ID)');
  }

  if (rider.verificationStatus !== 'verified') {
    missingRequirements.push('Rider verification status must be approved by admin');
  }

  const isEligibleForDispatch =
    hasPrimaryVehicle &&
    approvedDocs.length >= 2 &&
    rider.verificationStatus === 'verified' &&
    rider.accountStatus === 'active';

  return {
    riderId: rider._id.toString(),
    isEligibleForDispatch,
    profileCompleteness: rider.profileCompleteness || 30,
    verificationStatus: rider.verificationStatus,
    availabilityStatus: rider.availabilityStatus,
    hasPrimaryVehicle,
    approvedDocumentsCount: approvedDocs.length,
    missingRequirements,
  };
};
