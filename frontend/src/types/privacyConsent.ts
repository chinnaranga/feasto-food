export type CookieCategoryKey = 'necessary' | 'functional' | 'analytics' | 'personalization' | 'marketing';

export interface CookieConsentState {
  necessary: boolean; // Always true
  functional: boolean;
  analytics: boolean;
  personalization: boolean;
  marketing: boolean;
  updatedAt: string; // ISO timestamp
  version: string; // Consent policy version
}

export interface CookieCategoryConfig {
  id: CookieCategoryKey;
  title: string;
  shortDescription: string;
  isStrictlyNecessary: boolean;
  purpose: string;
  examples: string[];
  duration: string;
  type: string;
  dataUse: string;
  firstParty: boolean;
}

export const CURRENT_CONSENT_VERSION = '1.0';

export const DEFAULT_CONSENT_STATE: CookieConsentState = {
  necessary: true,
  functional: true,
  analytics: false,
  personalization: false,
  marketing: false,
  updatedAt: '',
  version: CURRENT_CONSENT_VERSION,
};

export const ACCEPT_ALL_CONSENT_STATE: Omit<CookieConsentState, 'updatedAt'> = {
  necessary: true,
  functional: true,
  analytics: true,
  personalization: true,
  marketing: true,
  version: CURRENT_CONSENT_VERSION,
};

export const REJECT_OPTIONAL_CONSENT_STATE: Omit<CookieConsentState, 'updatedAt'> = {
  necessary: true,
  functional: false,
  analytics: false,
  personalization: false,
  marketing: false,
  version: CURRENT_CONSENT_VERSION,
};

export const COOKIE_CATEGORIES_CONFIG: CookieCategoryConfig[] = [
  {
    id: 'necessary',
    title: 'Strictly Necessary',
    shortDescription:
      'Required for authentication, security, session management, cart functionality, and core application operation.',
    isStrictlyNecessary: true,
    purpose:
      'Maintains secure user sessions, protects checkout tokens against CSRF attacks, keeps your active cart items in sync, and remembers security authorizations.',
    examples: ['feasto_session_token', 'feasto_csrf_guard', 'feasto_active_cart', 'feasto-security-compliance-prefs'],
    duration: 'Session to 30 days',
    type: 'First-party Session Storage / Cookie',
    firstParty: true,
    dataUse:
      'Processes essential cryptographic tokens to verify your identity and safeguard financial transactions. These cannot be disabled.',
  },
  {
    id: 'functional',
    title: 'Functional',
    shortDescription:
      'Used to remember preferences such as language, region, layout preferences, and other convenience settings.',
    isStrictlyNecessary: false,
    purpose:
      'Stores interface configurations such as your chosen display language, regional currency, high-contrast themes, and reduced-motion settings.',
    examples: ['feasto_i18n_lang', 'feasto_i18n_region', 'feasto_accessibility_prefs', 'feasto_ui_density'],
    duration: 'Up to 1 year',
    type: 'First-party Local Storage',
    firstParty: true,
    dataUse:
      'Preserves your customized website preferences so you do not need to reconfigure display options on every visit.',
  },
  {
    id: 'analytics',
    title: 'Analytics',
    shortDescription:
      'Helps us understand how Feasto is used so we can improve performance, usability, and product quality.',
    isStrictlyNecessary: false,
    purpose:
      'Measures aggregate route loading speeds, Core Web Vitals, checkout step completion rates, and application errors.',
    examples: ['feasto_cwv_metrics', 'feasto_route_perf', 'feasto_session_trace'],
    duration: 'Up to 90 days',
    type: 'First-party Telemetry Metric',
    firstParty: true,
    dataUse:
      'Collects anonymized usage metrics without tracking individual identities or selling data to third parties.',
  },
  {
    id: 'personalization',
    title: 'Personalization',
    shortDescription:
      'Used to personalize restaurant, food, and recommendation experiences based on permitted preferences and activity.',
    isStrictlyNecessary: false,
    purpose:
      'Calibrates your taste affinity vectors, dietary restrictions (vegan, halal, gluten-free), and neighborhood restaurant sorting.',
    examples: ['feasto_taste_affinity', 'feasto_dietary_filter', 'feasto_recent_cuisine_weights'],
    duration: 'Up to 180 days',
    type: 'First-party Recommendation Engine',
    firstParty: true,
    dataUse:
      'Adapts restaurant listings and flavor suggestions to highlight dishes matching your recorded dining affinities.',
  },
  {
    id: 'marketing',
    title: 'Marketing',
    shortDescription:
      'Used for promotional campaigns, advertising measurement, and personalized marketing communications.',
    isStrictlyNecessary: false,
    purpose:
      'Evaluates promotional voucher effectiveness, seasonal campaign performance, and optional discount push notifications.',
    examples: ['feasto_promo_attribution', 'feasto_campaign_tag', 'feasto_referral_ref'],
    duration: 'Up to 30 days',
    type: 'First-party Campaign Tag',
    firstParty: true,
    dataUse:
      'Tracks promotional discount redemption and verifies referral bonuses. We never sell your data to third-party ad brokers.',
  },
];
