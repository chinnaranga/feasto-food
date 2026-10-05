export const RESTAURANT_CONSTANTS = {
  MAX_BRANCHES_PER_RESTAURANT: 50,
  DEFAULT_PREP_TIME_MINUTES: 20,
  SUPPORTED_CUISINES: [
    'Italian',
    'Mexican',
    'Chinese',
    'Indian',
    'Japanese',
    'American',
    'Thai',
    'Mediterranean',
    'French',
    'Korean',
    'Middle Eastern',
    'Vietnamese',
    'Fast Food',
    'Bakery',
    'Desserts',
    'Beverages',
  ],
} as const;

export const RESTAURANT_ERROR_CODES = {
  RESTAURANT_NOT_FOUND: 'RESTAURANT_NOT_FOUND',
  BRANCH_NOT_FOUND: 'BRANCH_NOT_FOUND',
  STAFF_ACCESS_NOT_FOUND: 'STAFF_ACCESS_NOT_FOUND',
  MAX_BRANCHES_EXCEEDED: 'MAX_BRANCHES_EXCEEDED',
  UNAUTHORIZED_RESTAURANT_ACCESS: 'UNAUTHORIZED_RESTAURANT_ACCESS',
  STAFF_ALREADY_EXISTS: 'STAFF_ALREADY_EXISTS',
  VERIFICATION_ALREADY_SUBMITTED: 'VERIFICATION_ALREADY_SUBMITTED',
} as const;
