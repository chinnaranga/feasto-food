export const HANDOVER_STATUSES = [
  'WAITING_FOR_RIDER',
  'RIDER_APPROACHING',
  'RIDER_ARRIVED',
  'HANDOFF_STARTED',
  'VERIFIED_HANDOVER',
  'COMPLETED',
  'FAILED',
] as const;
export type HandoverStatus = (typeof HANDOVER_STATUSES)[number];
