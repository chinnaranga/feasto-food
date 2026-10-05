export interface DeliveryOffer {
  offerId: string;
  orderId: string;
  restaurantId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';
  score: number;
  distanceToRestaurantKm: number;
  expiresAt: string;
}

export interface DeliveryAssignment {
  assignmentId: string;
  orderId: string;
  riderId: string;
  assignmentStatus: string;
  assignedAt: string;
}
