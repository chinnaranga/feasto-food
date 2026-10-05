import { TRACKING_CONSTANTS } from './tracking.constants.js';

export const calculateHaversineDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
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
  const distanceKm = R * c;

  return Number(distanceKm.toFixed(2));
};

export const calculateEtaMinutes = (
  distanceRemainingKm: number,
  speedKmh: number = TRACKING_CONSTANTS.DEFAULT_AVERAGE_SPEED_KMH
): number => {
  if (distanceRemainingKm <= 0) return 0;
  const effectiveSpeed = Math.max(speedKmh, 5.0); // minimum 5 km/h walking speed threshold
  const durationHours = distanceRemainingKm / effectiveSpeed;
  return Math.ceil(durationHours * 60);
};
