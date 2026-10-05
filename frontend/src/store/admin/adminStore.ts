import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Types & Interfaces ───────────────────────────────────────────────────────

export type AdminRole =
  | 'super_admin'
  | 'admin'
  | 'restaurant_owner'
  | 'restaurant_manager'
  | 'support_lead'
  | 'support'
  | 'delivery_manager'
  | 'marketing'
  | 'finance'
  | 'analyst'
  | 'trust_safety_officer'
  | 'operations_lead'
  | 'auditor';

export type AdminPermission =
  | 'view_dashboard'
  | 'manage_restaurants'
  | 'manage_orders'
  | 'manage_users'
  | 'manage_delivery'
  | 'manage_support'
  | 'manage_trust_safety'
  | 'manage_flags'
  | 'view_audit_logs'
  | 'manage_content'
  | 'manage_settings'
  | 'view_system_health'
  | 'manage_marketing'
  | 'view_analytics';

export interface VerificationDoc {
  id: string;
  type: 'FSSAI License' | 'GST Registration' | 'Pan Card' | 'Bank Account Proof';
  documentNumber: string;
  fileUrl?: string;
  status: 'verified' | 'pending' | 'rejected';
}

export interface AdminRestaurant {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  branchCode: string;
  city: string;
  status: 'pending' | 'verified' | 'suspended' | 'flagged';
  riskScore: number; // 0 to 100
  registeredAt: string;
  verificationDocs: VerificationDoc[];
  totalOrders: number;
  grossRevenue: number;
  notes?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'customer' | 'restaurant_owner' | 'restaurant_staff' | 'platform_admin' | 'support' | 'finance';
  status: 'active' | 'suspended' | 'read_only';
  role: string;
  registeredAt: string;
  lastLoginAt: string;
  flagCount: number;
  permissions: AdminPermission[];
}

export interface TrustSafetyReport {
  id: string;
  entityType: 'restaurant' | 'menu_item' | 'review' | 'user';
  entityId: string;
  entityName: string;
  reportType: 'food_safety' | 'fraudulent_billing' | 'abusive_behavior' | 'fake_review' | 'policy_violation';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  reportedBy: string;
  reportedAt: string;
  description: string;
  investigatorNotes?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  raisedBy: string; // User or Restaurant
  userType: 'customer' | 'restaurant';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'escalated' | 'resolved';
  slaBreachHours: number;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    sender: string;
    senderType: 'user' | 'agent' | 'system';
    text: string;
    timestamp: string;
  }[];
}

export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  isEnabled: boolean;
  isKillSwitch: boolean;
  rolloutPercentage: number; // 0 to 100
  targetAudience: 'global' | 'restaurants' | 'customers' | 'specific_branches';
  lastModifiedBy: string;
  lastModifiedAt: string;
}

export interface AuditLog {
  id: string;
  actorName: string;
  actorRole: string;
  actionCategory: 'auth' | 'restaurant' | 'user' | 'trust_safety' | 'support' | 'flag' | 'system';
  action: string;
  targetId?: string;
  ipAddress: string;
  timestamp: string;
  details?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'maintenance' | 'feature_release' | 'policy_update' | 'critical_alert';
  targetAudience: 'all' | 'restaurants' | 'customers';
  isPublished: boolean;
  createdAt: string;
  publishedAt?: string;
}

export interface ServiceHealth {
  serviceName: string;
  status: 'operational' | 'degraded' | 'outage';
  uptimePercentage: number;
  latencyMs: number;
  errorRatePercentage: number;
}

export interface AdminInsight {
  id: string;
  title: string;
  type: 'anomaly' | 'risk_score' | 'sla_breach' | 'system_alert';
  severity: 'info' | 'warning' | 'critical';
  description: string;
  impactText?: string;
}

// ─── Initial Mock Data Sets ──────────────────────────────────────────────────

const MOCK_RESTAURANTS: AdminRestaurant[] = [
  {
    id: 'sora-sushi',
    name: 'Sora Sushi Merchant',
    ownerName: 'Kenji Sato',
    ownerEmail: 'kenji@sorasushi.com',
    ownerPhone: '+91-9876543210',
    branchCode: 'SOR-DEL-01',
    city: 'New Delhi',
    status: 'verified',
    riskScore: 12,
    registeredAt: '2025-11-10',
    verificationDocs: [
      { id: 'doc-1', type: 'FSSAI License', documentNumber: '11223344556677', status: 'verified' },
      { id: 'doc-2', type: 'GST Registration', documentNumber: '07AAACS1234F1Z5', status: 'verified' },
    ],
    totalOrders: 1420,
    grossRevenue: 845000,
  },
  {
    id: 'artisan-table',
    name: 'Artisan Table Merchant',
    ownerName: 'Priya Sharma',
    ownerEmail: 'priya@artisantable.in',
    ownerPhone: '+91-9812345678',
    branchCode: 'ART-MUM-02',
    city: 'Mumbai',
    status: 'pending',
    riskScore: 35,
    registeredAt: '2026-07-01',
    verificationDocs: [
      { id: 'doc-3', type: 'FSSAI License', documentNumber: '22334455667788', status: 'pending' },
    ],
    totalOrders: 180,
    grossRevenue: 128000,
    notes: 'Pending FSSAI physical site inspection verification.',
  },
  {
    id: 'la-cucina',
    name: 'La Cucina Bistro',
    ownerName: 'Marco Rossi',
    ownerEmail: 'marco@lacucina.in',
    ownerPhone: '+91-9988776655',
    branchCode: 'LAC-BLR-03',
    city: 'Bengaluru',
    status: 'flagged',
    riskScore: 78,
    registeredAt: '2026-06-15',
    verificationDocs: [
      { id: 'doc-4', type: 'GST Registration', documentNumber: '29ABCDE1234F1Z5', status: 'verified' },
    ],
    totalOrders: 340,
    grossRevenue: 245000,
    notes: 'Flagged for multiple customer complaints regarding missing items.',
  },
];

const MOCK_USERS: AdminUser[] = [
  {
    id: 'usr-admin-1',
    name: 'Sarah Connor',
    email: 'sarah.admin@feasto.com',
    phone: '+91-9000000001',
    userType: 'platform_admin',
    status: 'active',
    role: 'Super Admin',
    registeredAt: '2025-01-01',
    lastLoginAt: '2026-07-21 22:45',
    flagCount: 0,
    permissions: [
      'view_dashboard',
      'manage_restaurants',
      'manage_users',
      'manage_support',
      'manage_trust_safety',
      'manage_flags',
      'view_audit_logs',
      'manage_content',
      'manage_settings',
      'view_system_health',
    ],
  },
  {
    id: 'usr-owner-1',
    name: 'Kenji Sato',
    email: 'kenji@sorasushi.com',
    phone: '+91-9876543210',
    userType: 'restaurant_owner',
    status: 'active',
    role: 'Restaurant Owner',
    registeredAt: '2025-11-10',
    lastLoginAt: '2026-07-21 19:30',
    flagCount: 0,
    permissions: ['manage_restaurants'],
  },
  {
    id: 'usr-[#cust-1]',
    name: 'Aarav Mehta',
    email: 'aarav.m@gmail.com',
    phone: '+91-9811223344',
    userType: 'customer',
    status: 'active',
    role: 'Customer',
    registeredAt: '2026-02-14',
    lastLoginAt: '2026-07-21 21:15',
    flagCount: 0,
    permissions: [],
  },
];

const MOCK_TRUST_REPORTS: TrustSafetyReport[] = [
  {
    id: 'tr-101',
    entityType: 'restaurant',
    entityId: 'la-cucina',
    entityName: 'La Cucina Bistro',
    reportType: 'food_safety',
    riskLevel: 'high',
    status: 'investigating',
    reportedBy: 'Customer App User #8912',
    reportedAt: '2026-07-20 18:30',
    description: 'Reported undercooked poultry in takeaway order #FST-662190.',
    investigatorNotes: 'Contacting store quality assurance lead for inspection checklist.',
  },
  {
    id: 'tr-102',
    entityType: 'review',
    entityId: 'rev-901',
    entityName: 'Review #901 on Sora Sushi',
    reportType: 'fake_review',
    riskLevel: 'medium',
    status: 'open',
    reportedBy: 'Automated Spam Classifier AI',
    reportedAt: '2026-07-21 14:10',
    description: 'Repeated IP submission of 5-star ratings detected from single subnet.',
  },
];

const MOCK_TICKETS: SupportTicket[] = [
  {
    id: 'st-501',
    ticketNumber: 'TKT-89102',
    subject: 'Delayed Bank Payout Clearance for SETTLE-2026-030',
    raisedBy: 'Artisan Table Merchant',
    userType: 'restaurant',
    priority: 'high',
    status: 'escalated',
    slaBreachHours: 2,
    assignedTo: 'Finance Escalations Lead',
    createdAt: '2026-07-21 10:00',
    updatedAt: '2026-07-21 15:30',
    messages: [
      { id: 'm1', sender: 'Priya Sharma', senderType: 'user', text: 'Our daily payout has not reflected in HDFC account ending 4102.', timestamp: '10:00' },
      { id: 'm2', sender: 'Support Agent Rahul', senderType: 'agent', text: 'Escalating to banking gateway operations team.', timestamp: '11:15' },
    ],
  },
  {
    id: 'st-502',
    ticketNumber: 'TKT-89105',
    subject: 'Incorrect Allergen Tag on Omakase Platter',
    raisedBy: 'Aarav Mehta',
    userType: 'customer',
    priority: 'urgent',
    status: 'in_progress',
    slaBreachHours: 0,
    assignedTo: 'Trust & Safety Agent',
    createdAt: '2026-07-21 19:40',
    updatedAt: '2026-07-21 20:00',
    messages: [
      { id: 'm3', sender: 'Aarav Mehta', senderType: 'user', text: 'Item contains sesame seeds but was listed as Sesame-Free.', timestamp: '19:40' },
    ],
  },
];

const MOCK_FEATURE_FLAGS: FeatureFlag[] = [
  {
    key: 'aiPersonalization',
    name: 'AI Personalization & Recommendation Engine',
    description: 'Dynamic dish recommendations based on dietary preferences and past orders.',
    isEnabled: true,
    isKillSwitch: false,
    rolloutPercentage: 100,
    targetAudience: 'global',
    lastModifiedBy: 'Sarah Connor',
    lastModifiedAt: '2026-07-15',
  },
  {
    key: 'instantPwaBanner',
    name: 'Instant PWA App Install Banner',
    description: 'Prompts mobile browser users to install the Feasto PWA app.',
    isEnabled: true,
    isKillSwitch: false,
    rolloutPercentage: 50,
    targetAudience: 'customers',
    lastModifiedBy: 'Sarah Connor',
    lastModifiedAt: '2026-07-18',
  },
  {
    key: 'realtimeRiderGps',
    name: 'Real-time Rider GPS Streaming',
    description: 'Live delivery driver location websocket map updates.',
    isEnabled: false,
    isKillSwitch: true,
    rolloutPercentage: 0,
    targetAudience: 'specific_branches',
    lastModifiedBy: 'Sarah Connor',
    lastModifiedAt: '2026-07-20',
  },
];

const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    actorName: 'Sarah Connor',
    actorRole: 'Super Admin',
    actionCategory: 'restaurant',
    action: 'Verified Restaurant Account',
    targetId: 'sora-sushi',
    ipAddress: '103.24.180.12',
    timestamp: '2026-07-21 22:15',
    details: 'FSSAI License #11223344556677 approved after document audit.',
  },
  {
    id: 'log-2',
    actorName: 'Sarah Connor',
    actorRole: 'Super Admin',
    actionCategory: 'flag',
    action: 'Updated Feature Flag Rollout',
    targetId: 'instantPwaBanner',
    ipAddress: '103.24.180.12',
    timestamp: '2026-07-21 20:10',
    details: 'Increased rollout percentage from 25% to 50%.',
  },
];

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Scheduled Platform Maintenance Window',
    content: 'Feasto API gateway will undergo a 15-minute maintenance window on Sunday 02:00 AM IST.',
    category: 'maintenance',
    targetAudience: 'all',
    isPublished: true,
    createdAt: '2026-07-19',
    publishedAt: '2026-07-19 12:00',
  },
  {
    id: 'ann-2',
    title: 'Updated Merchant GST Tax Policy for Q3 2026',
    content: 'Please review updated GSTR-1 automated filing rules under the Accounting module.',
    category: 'policy_update',
    targetAudience: 'restaurants',
    isPublished: true,
    createdAt: '2026-07-20',
    publishedAt: '2026-07-20 09:00',
  },
];

const MOCK_HEALTH: ServiceHealth[] = [
  { serviceName: 'API Gateway & Ingress Router', status: 'operational', uptimePercentage: 99.98, latencyMs: 24, errorRatePercentage: 0.01 },
  { serviceName: 'Cloud Firestore Realtime Sync', status: 'operational', uptimePercentage: 99.99, latencyMs: 38, errorRatePercentage: 0.00 },
  { serviceName: 'Media Asset CDN & Storage', status: 'operational', uptimePercentage: 100.0, latencyMs: 18, errorRatePercentage: 0.00 },
  { serviceName: 'Payment Gateway Integration', status: 'degraded', uptimePercentage: 98.50, latencyMs: 140, errorRatePercentage: 0.85 },
  { serviceName: 'FCM Push Notification Service', status: 'operational', uptimePercentage: 99.95, latencyMs: 42, errorRatePercentage: 0.02 },
];

const MOCK_AI_INSIGHTS: AdminInsight[] = [
  {
    id: 'ai-adm-1',
    title: 'High Risk Restaurant Verification Alert',
    type: 'risk_score',
    severity: 'warning',
    description: 'La Cucina Bistro risk score increased to 78 due to 3 unhandled food quality complaints.',
    impactText: 'Action Required',
  },
  {
    id: 'ai-adm-2',
    title: 'Support Ticket SLA Breach Warning',
    type: 'sla_breach',
    severity: 'critical',
    description: 'Ticket #TKT-89102 has breached the 2-hour escalation SLA threshold.',
    impactText: '2h SLA Breach',
  },
];

// ─── Store Interface ──────────────────────────────────────────────────────────

export interface AdminStoreState {
  activeRole: AdminRole;
  restaurants: AdminRestaurant[];
  users: AdminUser[];
  trustReports: TrustSafetyReport[];
  activePermissions: AdminPermission[];
  tickets: SupportTicket[];
  supportTickets: SupportTicket[];
  orders: any[];
  deliveryPartners: any[];
  campaigns: any[];
  featureFlags: FeatureFlag[];
  auditLogs: AuditLog[];
  announcements: Announcement[];
  serviceHealth: ServiceHealth[];
  insights: AdminInsight[];
  searchQuery: string;
  statusFilter: string;

  // Role Control
  setActiveRole: (role: AdminRole) => void;

  // Restaurant Governance Actions
  verifyRestaurant: (id: string) => void;
  suspendRestaurant: (id: string) => void;
  flagRestaurant: (id: string, notes: string) => void;

  // User Governance Actions
  suspendUser: (id: string) => void;
  activateUser: (id: string) => void;

  // Trust & Safety Actions
  resolveTrustReport: (id: string, notes?: string) => void;

  // Support Actions
  assignSupportTicket: (id: string, agentName: string) => void;
  resolveSupportTicket: (id: string) => void;

  // Feature Flag Actions
  toggleFeatureFlag: (key: string) => void;
  setRolloutPercentage: (key: string, pct: number) => void;

  // Announcement Actions
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;

  // Filters
  setSearchQuery: (q: string) => void;
  setStatusFilter: (filter: string) => void;

  // Audit Logger
  logAction: (action: string, category: AuditLog['actionCategory'], details?: string) => void;

  // Legacy Actions
  addCampaign: (campaign: any) => void;
  endCampaign: (id: string) => void;
  updateOrderStatus: (id: string, status: any) => void;
}

// ─── Zustand Store Implementation ─────────────────────────────────────────────

export const useAdminStore = create<AdminStoreState>()(
  persist(
    (set, get) => ({
      activeRole: 'super_admin',
      restaurants: MOCK_RESTAURANTS,
      users: MOCK_USERS,
      trustReports: MOCK_TRUST_REPORTS,
      supportTickets: MOCK_TICKETS,
      tickets: MOCK_TICKETS,
      orders: [],
      deliveryPartners: [],
      campaigns: [],
      activePermissions: [
        'view_dashboard',
        'manage_restaurants',
        'manage_users',
        'manage_support',
        'manage_trust_safety',
        'manage_flags',
        'view_audit_logs',
        'manage_content',
        'manage_settings',
        'view_system_health',
      ],
      featureFlags: MOCK_FEATURE_FLAGS,
      auditLogs: MOCK_AUDIT_LOGS,
      announcements: MOCK_ANNOUNCEMENTS,
      serviceHealth: MOCK_HEALTH,
      insights: MOCK_AI_INSIGHTS,

      searchQuery: '',
      statusFilter: 'all',

      addCampaign: (campaign: any) => set((state: any) => ({ campaigns: [...state.campaigns, campaign] })),
      endCampaign: (id: string) => set((state: any) => ({ campaigns: state.campaigns.filter((c: any) => c.id !== id) })),
      updateOrderStatus: (id: string, status: any) => set((state: any) => ({ orders: state.orders.map((o: any) => o.id === id ? { ...o, status } : o) })),

      setActiveRole: (activeRole) => set({ activeRole }),

      verifyRestaurant: (id) => {
        set((state) => ({
          restaurants: state.restaurants.map((r) =>
            r.id === id ? { ...r, status: 'verified', riskScore: Math.max(0, r.riskScore - 20) } : r
          ),
        }));
        get().logAction(`Verified restaurant account (${id})`, 'restaurant');
      },

      suspendRestaurant: (id) => {
        set((state) => ({
          restaurants: state.restaurants.map((r) => (r.id === id ? { ...r, status: 'suspended' } : r)),
        }));
        get().logAction(`Suspended restaurant account (${id})`, 'restaurant');
      },

      flagRestaurant: (id, notes) => {
        set((state) => ({
          restaurants: state.restaurants.map((r) => (r.id === id ? { ...r, status: 'flagged', notes } : r)),
        }));
        get().logAction(`Flagged restaurant (${id}): ${notes}`, 'trust_safety');
      },

      suspendUser: (id) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, status: 'suspended' } : u)),
        }));
        get().logAction(`Suspended user account (${id})`, 'user');
      },

      activateUser: (id) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, status: 'active' } : u)),
        }));
        get().logAction(`Activated user account (${id})`, 'user');
      },

      resolveTrustReport: (id, notes) => {
        set((state) => ({
          trustReports: state.trustReports.map((tr) =>
            tr.id === id ? { ...tr, status: 'resolved', investigatorNotes: notes } : tr
          ),
        }));
        get().logAction(`Resolved trust & safety report (${id})`, 'trust_safety');
      },

      assignSupportTicket: (id, agentName) => {
        set((state) => ({
          supportTickets: state.supportTickets.map((t) =>
            t.id === id ? { ...t, assignedTo: agentName, status: 'in_progress' } : t
          ),
        }));
      },

      resolveSupportTicket: (id) => {
        set((state) => ({
          supportTickets: state.supportTickets.map((t) => (t.id === id ? { ...t, status: 'resolved' } : t)),
        }));
        get().logAction(`Resolved support ticket (${id})`, 'support');
      },

      toggleFeatureFlag: (key) => {
        set((state) => ({
          featureFlags: state.featureFlags.map((f) =>
            f.key === key
              ? {
                  ...f,
                  isEnabled: !f.isEnabled,
                  lastModifiedAt: new Date().toISOString().split('T')[0],
                }
              : f
          ),
        }));
        get().logAction(`Toggled feature flag (${key})`, 'flag');
      },

      setRolloutPercentage: (key, pct) => {
        set((state) => ({
          featureFlags: state.featureFlags.map((f) =>
            f.key === key ? { ...f, rolloutPercentage: pct } : f
          ),
        }));
        get().logAction(`Changed rollout percentage for flag (${key}) to ${pct}%`, 'flag');
      },

      createAnnouncement: (data) => {
        const id = `ann-${Date.now()}`;
        const newAnn: Announcement = {
          ...data,
          id,
          createdAt: new Date().toISOString().split('T')[0],
          publishedAt: data.isPublished ? new Date().toISOString() : undefined,
        };
        set((state) => ({ announcements: [newAnn, ...state.announcements] }));
        get().logAction(`Created platform announcement (${data.title})`, 'system');
      },

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setStatusFilter: (statusFilter) => set({ statusFilter }),

      logAction: (action, category, details) => {
        const newLog: AuditLog = {
          id: `log-${Date.now()}`,
          actorName: 'Super Admin',
          actorRole: get().activeRole,
          actionCategory: category,
          action,
          ipAddress: '103.24.180.12',
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          details,
        };
        set((state) => ({ auditLogs: [newLog, ...state.auditLogs] }));
      },
    }),
    {
      name: 'feasto-super-admin-store',
      partialize: (state) => ({
        activeRole: state.activeRole,
        restaurants: state.restaurants,
        users: state.users,
        featureFlags: state.featureFlags,
        auditLogs: state.auditLogs,
      }),
    }
  )
);

export default useAdminStore;
