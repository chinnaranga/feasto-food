import { BuildMetadata } from '../../types/release';

export const buildMetadata: BuildMetadata = {
  version: '2.0.0',
  buildTimestamp: '2026-07-15T06:00:00Z',
  commitHash: 'fea570f0322cdae34746b4dedf0b4dfa099e1781',
  buildChannel: (import.meta.env.MODE === 'production' 
    ? 'production' 
    : import.meta.env.MODE === 'staging'
    ? 'staging'
    : import.meta.env.MODE === 'preview'
    ? 'preview'
    : 'development') as any,
  releaseNotes: {
    version: '2.0.0',
    date: '2026-07-15',
    summary: 'Launch of Feasto 2.0 with live Firestore synchronization, design system overhaul, and security compliance enhancements.',
    changes: [
      'Migrated user profiles, support ticketing, notifications, and menus catalog to live Firebase Cloud Firestore real-time sync.',
      'Overhauled design system typography tracking, multi-layered depth elevation shadows, and snappy transitions.',
      'Implemented double confirmation secure dialog overlays and inactivity session timeout monitoring.',
      'Refined Service Worker caching logic to catch network failures gracefully without throwing unhandled TypeErrors.',
    ],
    security: [
      'Introduced sensitive actions double-confirmation gates.',
      'Configured secure Firestore queries mapped strictly to authenticated user sessions.',
    ],
  },
};
export default buildMetadata;
