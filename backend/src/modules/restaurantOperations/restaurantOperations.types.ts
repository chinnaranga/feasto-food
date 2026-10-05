import {
  RestaurantOperationalStatus,
  RestaurantSubState,
  DelayReason,
} from './restaurantOperations.constants.js';

export interface IRestaurantOperations {
  _id?: string;
  restaurantId: string;
  branchId?: string;
  status: RestaurantOperationalStatus;
  isPaused: boolean;
  pauseReason?: string;
  pausedUntil?: Date;
  avgPreparationTimeMinutes: number;
  activeOrderCount: number;
  lastStatusChangedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrderPreparationEvent {
  _id?: string;
  eventId: string;
  orderId: string;
  restaurantId: string;
  previousSubState?: RestaurantSubState;
  newSubState: RestaurantSubState;
  actorId: string;
  actorRole: string;
  notes?: string;
  createdAt?: Date;
}

export interface IOrderDelay {
  _id?: string;
  delayId: string;
  orderId: string;
  restaurantId: string;
  reason: DelayReason;
  delayMinutes: number;
  notes?: string;
  createdBy: string;
  isResolved: boolean;
  resolvedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRestaurantOperationalEvent {
  _id?: string;
  eventId: string;
  restaurantId: string;
  eventType: string;
  details?: Record<string, any>;
  actorId: string;
  createdAt?: Date;
}
