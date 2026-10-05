import crypto from 'crypto';

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100; // Round to 2 decimal places
}

export function generateDispatchJobId(): string {
  return `djob_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

export function generateOfferId(): string {
  return `offr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

export function generateAssignmentId(): string {
  return `asgn_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

export function generateAttemptId(): string {
  return `datt_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

export function generateDispatchEventId(): string {
  return `devt_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}
