import {
  OfferStatus,
  AssignmentStatus,
  DispatchPriority,
  RejectionReason,
} from './dispatch.constants.js';

export interface IDispatchJob {
  _id?: string;
  jobId: string;
  orderId: string;
  restaurantId: string;
  branchId?: string;
  priority: DispatchPriority;
  status: 'PENDING' | 'DISPATCHING' | 'ASSIGNED' | 'FAILED' | 'CANCELLED';
  attemptsCount: number;
  maxAttempts: number;
  excludedRiderIds: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDeliveryOffer {
  _id?: string;
  offerId: string;
  orderId: string;
  riderId: string;
  restaurantId: string;
  branchId?: string;
  status: OfferStatus;
  score: number;
  distanceToRestaurantKm: number;
  estimatedPickupTimeMinutes: number;
  expiresAt: Date;
  respondedAt?: Date;
  rejectionReason?: RejectionReason;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDeliveryAssignment {
  _id?: string;
  assignmentId: string;
  orderId: string;
  riderId: string;
  restaurantId: string;
  branchId?: string;
  offerId: string;
  assignmentStatus: AssignmentStatus;
  assignmentVersion: number;
  assignedAt: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  cancelledAt?: Date;
  pickupStartedAt?: Date;
  pickupCompletedAt?: Date;
  deliveryStartedAt?: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDispatchAttempt {
  _id?: string;
  attemptId: string;
  jobId: string;
  orderId: string;
  candidatesCount: number;
  selectedRiderId?: string;
  offerId?: string;
  outcome: 'OFFER_CREATED' | 'NO_RIDER_ELIGIBLE' | 'FAILED';
  notes?: string;
  createdAt?: Date;
}

export interface IDispatchConfig {
  _id?: string;
  configKey: string;
  maxDispatchRadiusKm: number;
  offerTimeoutSeconds: number;
  maxAssignmentAttempts: number;
  maxActiveDeliveriesPerRider: number;
  locationFreshnessThresholdSeconds: number;
  minimumRiderScore: number;
  retryDelaySeconds: number;
  priorityMultiplier: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDispatchEvent {
  _id?: string;
  eventId: string;
  orderId: string;
  eventType: string;
  details?: Record<string, any>;
  createdAt?: Date;
}

export interface IRiderCandidateScore {
  riderId: string;
  score: number;
  distanceKm: number;
  breakdown: {
    proximityScore: number;
    availabilityScore: number;
    zoneScore: number;
    workloadScore: number;
    freshnessScore: number;
    priorityScore: number;
  };
}
