import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { firestoreService } from '../../services/firebase/firestoreService';
import { usePortalStore } from './portalStore';

// ─── Hours Entry ──────────────────────────────────────────────────────────────
export interface HoursEntry {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

const DEFAULT_HOURS: HoursEntry[] = [
  { day: 'Monday',    open: '09:00', close: '22:00', isClosed: false },
  { day: 'Tuesday',   open: '09:00', close: '22:00', isClosed: false },
  { day: 'Wednesday', open: '09:00', close: '22:00', isClosed: false },
  { day: 'Thursday',  open: '09:00', close: '22:00', isClosed: false },
  { day: 'Friday',    open: '09:00', close: '23:00', isClosed: false },
  { day: 'Saturday',  open: '10:00', close: '23:00', isClosed: false },
  { day: 'Sunday',    open: '10:00', close: '21:00', isClosed: false },
];

// ─── Profile Details ──────────────────────────────────────────────────────────
export interface ProfileDetails {
  // — Restaurant Identity —
  restaurantName: string;
  tagline: string;
  cuisineType: string;
  description: string;
  isVisible: boolean;

  // — Branding —
  brandColor: string;
  logoUrl: string;
  coverUrl: string;

  // — Business Identity —
  legalName: string;
  taxId: string;
  registrationNumber: string;
  businessCategory: string;
  ownershipType: string;
  contactEmail: string;
  contactPhone: string;

  // — Location —
  address: string;
  city: string;
  state: string;
  country: string;
  timezone: string;
  hasDeliveryZone: boolean;

  // — Operational Identity —
  dineIn: boolean;
  takeaway: boolean;
  delivery: boolean;
  prepTimeMin: number;
  prepTimeMax: number;
  openingHours: HoursEntry[];
  kitchenHours: HoursEntry[];
  pickupHours: HoursEntry[];
  deliveryHours: HoursEntry[];

  // — Workspace Settings —
  workspaceName: string;
  language: string;
  currency: string;
  region: string;
  notifyOrderNew: boolean;
  notifyOrderStatus: boolean;
  notifyReviews: boolean;
  operationalMode: 'online' | 'paused' | 'offline';
  teamVisibility: 'all' | 'managers-only' | 'owner-only';

  // — Publish Readiness —
  isDraft: boolean;
  isPublished: boolean;
  publishedAt?: string;
}

// ─── Store Interface ──────────────────────────────────────────────────────────
interface ProfileState {
  profile: ProfileDetails;
  draft: ProfileDetails;
  isDirty: boolean;
  isSaving: boolean;

  setDraftField: <K extends keyof ProfileDetails>(key: K, value: ProfileDetails[K]) => void;
  setDraft: (newDraft: Partial<ProfileDetails>) => void;
  setHoursEntry: (
    scope: 'openingHours' | 'kitchenHours' | 'pickupHours' | 'deliveryHours',
    index: number,
    entry: Partial<HoursEntry>
  ) => void;
  saveProfile: () => void;
  discardEdits: () => void;
  publishProfile: () => void;
  getCompleteness: () => { score: number; missing: string[] };
}

// ─── Defaults ─────────────────────────────────────────────────────────────────
const defaultProfile: ProfileDetails = {
  restaurantName: 'Sora Sushi Restaurant',
  tagline: 'Authentic Tokyo Sushi Experience',
  cuisineType: 'Japanese Fusion',
  description: 'Handcrafted sushi, premium cuts, and traditional hot kitchen dishes in the heart of Tokyo.',
  isVisible: true,

  brandColor: '#e35205',
  logoUrl: '',
  coverUrl: '',

  legalName: 'Sora Culinary Group Co. Ltd.',
  taxId: 'GST-99221133',
  registrationNumber: 'CRN-773344',
  businessCategory: 'Full Service Restaurant',
  ownershipType: 'Privately Owned',
  contactEmail: 'contact@sora-sushi.com',
  contactPhone: '+81-3-1234-5678',

  address: '1-16 Shinjuku, Tokyo',
  city: 'Tokyo',
  state: 'Kanto',
  country: 'Japan',
  timezone: 'Asia/Tokyo',
  hasDeliveryZone: true,

  dineIn: true,
  takeaway: true,
  delivery: true,
  prepTimeMin: 15,
  prepTimeMax: 35,
  openingHours: DEFAULT_HOURS,
  kitchenHours: DEFAULT_HOURS,
  pickupHours: DEFAULT_HOURS,
  deliveryHours: DEFAULT_HOURS,

  workspaceName: 'Sora Sushi — Tokyo Operations',
  language: 'English',
  currency: 'JPY',
  region: 'JP',
  notifyOrderNew: true,
  notifyOrderStatus: true,
  notifyReviews: false,
  operationalMode: 'online',
  teamVisibility: 'all',

  isDraft: false,
  isPublished: true,
  publishedAt: new Date().toISOString(),
};

// ─── Completeness fields checked ──────────────────────────────────────────────
const COMPLETENESS_CHECKS: { key: keyof ProfileDetails; label: string }[] = [
  { key: 'restaurantName', label: 'Restaurant Name' },
  { key: 'tagline',        label: 'Brand Tagline' },
  { key: 'cuisineType',    label: 'Cuisine Type' },
  { key: 'description',    label: 'Profile Description' },
  { key: 'logoUrl',        label: 'Brand Logo Photo' },
  { key: 'coverUrl',       label: 'Cover Image Banner' },
  { key: 'taxId',          label: 'GST / Tax ID' },
  { key: 'address',        label: 'Physical Address' },
  { key: 'contactEmail',   label: 'Business Contact Email' },
  { key: 'contactPhone',   label: 'Business Contact Phone' },
];

// ─── Store ────────────────────────────────────────────────────────────────────
export const usePortalProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      draft: defaultProfile,
      isDirty: false,
      isSaving: false,

      setDraftField: (key, value) => {
        set((state) => {
          const nextDraft = { ...state.draft, [key]: value };
          const matchesSaved = JSON.stringify(nextDraft) === JSON.stringify(state.profile);
          return { draft: nextDraft, isDirty: !matchesSaved };
        });
      },

      setDraft: (newDraft) => {
        set((state) => {
          const nextDraft = { ...state.draft, ...newDraft };
          const matchesSaved = JSON.stringify(nextDraft) === JSON.stringify(state.profile);
          return { draft: nextDraft, isDirty: !matchesSaved };
        });
      },

      setHoursEntry: (scope, index, entry) => {
        set((state) => {
          const updatedHours = state.draft[scope].map((h, i) =>
            i === index ? { ...h, ...entry } : h
          );
          const nextDraft = { ...state.draft, [scope]: updatedHours };
          const matchesSaved = JSON.stringify(nextDraft) === JSON.stringify(state.profile);
          return { draft: nextDraft, isDirty: !matchesSaved };
        });
      },

      saveProfile: () => {
        const currentDraft = get().draft;
        set({ profile: currentDraft, isDirty: false, isSaving: false });

        const restaurantId = usePortalStore.getState().selectedRestaurant?.id;
        if (restaurantId) {
          const isOpen = currentDraft.operationalMode === 'online';
          const updatePayload = {
            name: currentDraft.restaurantName,
            tagline: currentDraft.tagline,
            cuisine: currentDraft.cuisineType.split(',').map((s) => s.trim()).filter(Boolean),
            isOpen: isOpen,
          };
          firestoreService.setDocument(`restaurants/${restaurantId}`, updatePayload);
        }
      },

      discardEdits: () => {
        const savedProfile = get().profile;
        set({ draft: savedProfile, isDirty: false });
      },

      publishProfile: () => {
        const currentDraft = get().draft;
        const published: ProfileDetails = {
          ...currentDraft,
          isDraft: false,
          isPublished: true,
          isVisible: true,
          publishedAt: new Date().toISOString(),
        };
        set({ profile: published, draft: published, isDirty: false });

        const restaurantId = usePortalStore.getState().selectedRestaurant?.id;
        if (restaurantId) {
          const isOpen = published.operationalMode === 'online';
          const updatePayload = {
            name: published.restaurantName,
            tagline: published.tagline,
            cuisine: published.cuisineType.split(',').map((s) => s.trim()).filter(Boolean),
            isOpen: isOpen,
          };
          firestoreService.setDocument(`restaurants/${restaurantId}`, updatePayload);
        }
      },

      getCompleteness: () => {
        const d = get().draft;
        const missing: string[] = [];
        for (const check of COMPLETENESS_CHECKS) {
          const val = d[check.key];
          if (!val || (typeof val === 'string' && val.trim() === '')) {
            missing.push(check.label);
          }
        }
        const score = Math.round(((COMPLETENESS_CHECKS.length - missing.length) / COMPLETENESS_CHECKS.length) * 100);
        return { score, missing };
      },
    }),
    {
      name: 'feasto-merchant-profile-store',
      partialize: (state) => ({
        profile: state.profile,
        draft: state.draft,
      }),
    }
  )
);

export default usePortalProfileStore;
