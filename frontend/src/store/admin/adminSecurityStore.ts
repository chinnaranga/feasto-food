import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Types & Interfaces ───────────────────────────────────────────────────────

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface SecurityIncident {
  id: string;
  ticketNumber: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  affectedComponent: string; // e.g. Payment Gateway, Auth Service, Firestore Sync
  assignedTo?: string;
  reportedAt: string;
  updatedAt: string;
  description: string;
  responseNotes: {
    id: string;
    author: string;
    note: string;
    timestamp: string;
  }[];
}

export interface ComplianceCheckItem {
  id: string;
  title: string;
  region: 'India (DPDP Act)' | 'EU (GDPR)' | 'Global SOC-2' | 'PCI-DSS';
  category: 'privacy' | 'data_retention' | 'access_control' | 'encryption';
  status: 'compliant' | 'in_review' | 'action_required';
  lastAudited: string;
  responsibleOfficer: string;
}

export interface PrivacyRequest {
  id: string;
  requestType: 'data_access' | 'data_export' | 'account_deletion' | 'consent_opt_out';
  userName: string;
  userEmail: string;
  userType: 'customer' | 'restaurant_owner';
  status: 'pending' | 'in_review' | 'completed' | 'rejected';
  deadlineHours: number;
  requestedAt: string;
  completedAt?: string;
}

export interface AccessEvent {
  id: string;
  userEmail: string;
  userRole: string;
  ipAddress: string;
  location: string;
  deviceFingerprint: string;
  eventType: 'login_success' | 'suspicious_login' | 'failed_mfa' | 'privilege_escalation' | 'access_denied';
  riskScore: number; // 0 to 100
  timestamp: string;
}

export interface SensitiveAction {
  id: string;
  actorEmail: string;
  actionName: string;
  category: 'payout_change' | 'role_override' | 'refund_approval' | 'kill_switch_toggle' | 'account_deletion';
  targetEntity: string;
  ipAddress: string;
  timestamp: string;
  requiresReview: boolean;
  isConfirmed: boolean;
}

export interface PolicyVersion {
  id: string;
  title: string;
  version: string;
  effectiveDate: string;
  acknowledgmentRatePct: number;
  status: 'active' | 'draft' | 'archived';
}

export interface ThreatInsight {
  id: string;
  title: string;
  type: 'threat_anomaly' | 'suspicious_sign_in' | 'policy_gap' | 'privacy_deadline';
  severity: IncidentSeverity;
  description: string;
  recommendedAction: string;
}

// ─── Initial Mock Data Sets ──────────────────────────────────────────────────

const MOCK_INCIDENTS: SecurityIncident[] = [
  {
    id: 'inc-101',
    ticketNumber: 'SEC-INC-2026-089',
    title: 'Suspicious Rate-Limit Spike on Auth Endpoint',
    severity: 'high',
    status: 'in_progress',
    affectedComponent: 'Auth Service API Gateway',
    assignedTo: 'Security Lead Alex',
    reportedAt: '2026-07-21 18:30',
    updatedAt: '2026-07-21 21:10',
    description: '14,000 automated credential stuffing login requests detected from subnet 185.220.101.0/24.',
    responseNotes: [
      { id: 'n1', author: 'Security Bot', note: 'Automated IP subnet block applied at Cloudflare WAF.', timestamp: '18:32' },
      { id: 'n2', author: 'Alex Chen', note: 'Enforced reCAPTCHA v3 challenge for all non-session requests.', timestamp: '19:45' },
    ],
  },
  {
    id: 'inc-102',
    ticketNumber: 'SEC-INC-2026-084',
    title: 'Unusual Merchant Bank Account Change Attempt',
    severity: 'critical',
    status: 'open',
    affectedComponent: 'Payout Gateway',
    assignedTo: 'Compliance Officer Maya',
    reportedAt: '2026-07-21 20:00',
    updatedAt: '2026-07-21 20:00',
    description: 'Bank account number change requested for Sora Sushi from un-recognized IP in Frankfurt.',
    responseNotes: [],
  },
];

const MOCK_COMPLIANCE: ComplianceCheckItem[] = [
  { id: 'cmp-1', title: 'DPDP Data Fiduciary Consent Logging', region: 'India (DPDP Act)', category: 'privacy', status: 'compliant', lastAudited: '2026-07-15', responsibleOfficer: 'Legal Desk' },
  { id: 'cmp-2', title: 'EU GDPR Right to Be Forgotten Engine', region: 'EU (GDPR)', category: 'data_retention', status: 'compliant', lastAudited: '2026-07-10', responsibleOfficer: 'Privacy Lead' },
  { id: 'cmp-3', title: 'PCI-DSS Payment Gateway Tokenization Audit', region: 'Global SOC-2', category: 'encryption', status: 'action_required', lastAudited: '2026-07-01', responsibleOfficer: 'Finance Security' },
];

const MOCK_PRIVACY_REQUESTS: PrivacyRequest[] = [
  { id: 'pr-891', requestType: 'data_export', userName: 'Rohan Deshmukh', userEmail: 'rohan.d@gmail.com', userType: 'customer', status: 'pending', deadlineHours: 14, requestedAt: '2026-07-21 08:00' },
  { id: 'pr-892', requestType: 'account_deletion', userName: 'Ananya Roy', userEmail: 'ananya.roy@yahoo.in', userType: 'customer', status: 'in_review', deadlineHours: 36, requestedAt: '2026-07-20 14:00' },
];

const MOCK_ACCESS_EVENTS: AccessEvent[] = [
  { id: 'acc-1', userEmail: 'sarah.admin@feasto.com', userRole: 'Super Admin', ipAddress: '103.24.180.12', location: 'New Delhi, IN', deviceFingerprint: 'Chrome / macOS Sonoma', eventType: 'login_success', riskScore: 5, timestamp: '2026-07-21 22:45' },
  { id: 'acc-2', userEmail: 'marco@lacucina.in', userRole: 'Restaurant Owner', ipAddress: '185.220.101.44', location: 'Frankfurt, DE', deviceFingerprint: 'Firefox / Linux', eventType: 'suspicious_login', riskScore: 82, timestamp: '2026-07-21 20:00' },
];

const MOCK_SENSITIVE_ACTIONS: SensitiveAction[] = [
  { id: 'sa-1', actorEmail: 'sarah.admin@feasto.com', actionName: 'Updated Bank Payout Account for Artisan Table', category: 'payout_change', targetEntity: 'ART-MUM-02', ipAddress: '103.24.180.12', timestamp: '2026-07-21 21:15', requiresReview: false, isConfirmed: true },
  { id: 'sa-2', actorEmail: 'alex.security@feasto.com', actionName: 'Triggered Emergency Kill Switch on Realtime GPS Streaming', category: 'kill_switch_toggle', targetEntity: 'realtimeRiderGps', ipAddress: '103.24.180.12', timestamp: '2026-07-20 18:30', requiresReview: true, isConfirmed: true },
];

const MOCK_POLICIES: PolicyVersion[] = [
  { id: 'pol-1', title: 'Merchant Privacy & Data Handling Policy', version: 'v4.2', effectiveDate: '2026-07-01', acknowledgmentRatePct: 98.4, status: 'active' },
  { id: 'pol-2', title: 'Platform Security & Anti-Fraud Agreement', version: 'v3.1', effectiveDate: '2026-05-15', acknowledgmentRatePct: 100.0, status: 'active' },
];

const MOCK_THREAT_INSIGHTS: ThreatInsight[] = [
  { id: 'ti-1', title: 'High Severity Incident Pending Review', type: 'threat_anomaly', severity: 'critical', description: 'Unusual bank account change request for Sora Sushi requires security approval before payout release.', recommendedAction: 'Verify via OTP & Voice Check' },
  { id: 'ti-2', title: 'Privacy Data Export Deadline Approaching', type: 'privacy_deadline', severity: 'medium', description: 'Data export request #PR-891 due within 14 hours under DPDP statutory SLA.', recommendedAction: 'Generate Export Bundle' },
];

// ─── Store Interface ──────────────────────────────────────────────────────────

interface AdminSecurityStoreState {
  incidents: SecurityIncident[];
  complianceItems: ComplianceCheckItem[];
  privacyRequests: PrivacyRequest[];
  accessEvents: AccessEvent[];
  sensitiveActions: SensitiveAction[];
  policies: PolicyVersion[];
  threatInsights: ThreatInsight[];

  isDataMasked: boolean;

  // Actions
  createIncident: (incident: Omit<SecurityIncident, 'id' | 'ticketNumber' | 'reportedAt' | 'updatedAt' | 'responseNotes'>) => void;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  addIncidentNote: (id: string, author: string, note: string) => void;
  resolvePrivacyRequest: (id: string) => void;
  toggleDataMasking: () => void;
}

// ─── Zustand Store Implementation ─────────────────────────────────────────────

export const useAdminSecurityStore = create<AdminSecurityStoreState>()(
  persist(
    (set) => ({
      incidents: MOCK_INCIDENTS,
      complianceItems: MOCK_COMPLIANCE,
      privacyRequests: MOCK_PRIVACY_REQUESTS,
      accessEvents: MOCK_ACCESS_EVENTS,
      sensitiveActions: MOCK_SENSITIVE_ACTIONS,
      policies: MOCK_POLICIES,
      threatInsights: MOCK_THREAT_INSIGHTS,

      isDataMasked: true,

      createIncident: (data) => {
        const id = `inc-${Date.now()}`;
        const ticketNumber = `SEC-INC-2026-${Math.floor(100 + Math.random() * 900)}`;
        const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
        const newIncident: SecurityIncident = {
          ...data,
          id,
          ticketNumber,
          reportedAt: timestamp,
          updatedAt: timestamp,
          responseNotes: [],
        };
        set((state) => ({ incidents: [newIncident, ...state.incidents] }));
      },

      updateIncidentStatus: (id, status) => {
        set((state) => ({
          incidents: state.incidents.map((inc) =>
            inc.id === id ? { ...inc, status, updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) } : inc
          ),
        }));
      },

      addIncidentNote: (id, author, note) => {
        const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
        set((state) => ({
          incidents: state.incidents.map((inc) =>
            inc.id === id
              ? {
                  ...inc,
                  updatedAt: timestamp,
                  responseNotes: [...inc.responseNotes, { id: `n-${Date.now()}`, author, note, timestamp }],
                }
              : inc
          ),
        }));
      },

      resolvePrivacyRequest: (id) => {
        set((state) => ({
          privacyRequests: state.privacyRequests.map((pr) =>
            pr.id === id ? { ...pr, status: 'completed', completedAt: new Date().toISOString().split('T')[0] } : pr
          ),
        }));
      },

      toggleDataMasking: () => set((state) => ({ isDataMasked: !state.isDataMasked })),
    }),
    {
      name: 'feasto-super-admin-security-store',
      partialize: (state) => ({
        incidents: state.incidents,
        privacyRequests: state.privacyRequests,
        isDataMasked: state.isDataMasked,
      }),
    }
  )
);

export default useAdminSecurityStore;
