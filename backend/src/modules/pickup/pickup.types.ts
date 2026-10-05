import { HandoverStatus } from './pickup.constants.js';

export interface IPickupHandover {
  _id?: string;
  handoverId: string;
  orderId: string;
  restaurantId: string;
  riderId?: string;
  status: HandoverStatus;
  verificationCode?: string;
  isVerified: boolean;
  riderArrivedAt?: Date;
  handoffStartedAt?: Date;
  handoffCompletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
