export const OFFER_STATUSES = ['PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED'] as const;
export type OfferStatus = (typeof OFFER_STATUSES)[number];

export const ASSIGNMENT_STATUSES = [
  'PENDING',
  'OFFERED',
  'ACCEPTED',
  'PICKUP_PENDING',
  'PICKED_UP',
  'OUT_FOR_DELIVERY',
  'COMPLETED',
  'CANCELLED',
  'REASSIGNMENT_REQUIRED',
] as const;
export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];

export const DISPATCH_PRIORITIES = ['NORMAL', 'HIGH', 'URGENT'] as const;
export type DispatchPriority = (typeof DISPATCH_PRIORITIES)[number];

export const REJECTION_REASONS = [
  'TOO_FAR',
  'NOT_AVAILABLE',
  'VEHICLE_ISSUE',
  'PERSONAL_REASON',
  'OTHER',
] as const;
export type RejectionReason = (typeof REJECTION_REASONS)[number];

export const DEFAULT_DISPATCH_CONFIG = {
  maxDispatchRadiusKm: 10,
  offerTimeoutSeconds: 45,
  maxAssignmentAttempts: 5,
  maxActiveDeliveriesPerRider: 2,
  locationFreshnessThresholdSeconds: 300, // 5 minutes
  minimumRiderScore: 10,
  retryDelaySeconds: 15,
  priorityMultiplier: 1.5,
};
