import { ReleaseChannel } from '../types/release';

export const RELEASE_CHANNELS: ReleaseChannel[] = ['production', 'staging', 'preview', 'development'];

export const MANDATORY_ENV_KEYS = [
  {
    key: 'VITE_FIREBASE_API_KEY',
    description: 'Firebase Web API Key for authenticating app transactions.',
  },
  {
    key: 'VITE_FIREBASE_AUTH_DOMAIN',
    description: 'Firebase Authentication Domain.',
  },
  {
    key: 'VITE_FIREBASE_PROJECT_ID',
    description: 'Google Cloud Platform/Firebase Project ID.',
  },
  {
    key: 'VITE_FIREBASE_STORAGE_BUCKET',
    description: 'Firebase Cloud Storage bucket identifier.',
  },
  {
    key: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
    description: 'Cloud Messaging Identifier for PWA push alerts.',
  },
  {
    key: 'VITE_FIREBASE_APP_ID',
    description: 'Firebase Application registration token.',
  },
];

export const OPTIONAL_ENV_KEYS = [
  {
    key: 'VITE_FIREBASE_MEASUREMENT_ID',
    description: 'Google Analytics measurement tag.',
  },
  {
    key: 'VITE_DEBUG_MODE',
    description: 'Flag to print detailed diagnostics checks logs.',
  },
];

export const VERSION_KEY = 'feasto-cached-version';
