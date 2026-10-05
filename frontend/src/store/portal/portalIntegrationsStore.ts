import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppConnector,
  WebhookEndpoint,
  WebhookDeliveryLog,
  AutomationRule,
  ApiKeyCredentials,
  SyncHealthMetrics,
  IntegrationActivityLog,
  MarketplaceApp,
  SmartAIInsight,
} from '../../types/integrations';
import {
  INITIAL_CONNECTORS,
  INITIAL_WEBHOOKS,
  INITIAL_DELIVERY_LOGS,
  INITIAL_AUTOMATIONS,
  INITIAL_API_KEYS,
  INITIAL_SYNC_HEALTH,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_MARKETPLACE,
  INITIAL_AI_INSIGHTS,
} from '../../constants/integrations';

interface PortalIntegrationsState {
  connectors: AppConnector[];
  webhooks: WebhookEndpoint[];
  deliveryLogs: WebhookDeliveryLog[];
  automations: AutomationRule[];
  apiKeys: ApiKeyCredentials[];
  syncHealth: SyncHealthMetrics;
  activityLogs: IntegrationActivityLog[];
  marketplaceApps: MarketplaceApp[];
  aiInsights: SmartAIInsight[];

  // Filter & Search
  searchQuery: string;
  categoryFilter: string;
  logSeverityFilter: string;

  // Actions
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  setLogSeverityFilter: (severity: string) => void;

  // Connectors Actions
  toggleConnectorStatus: (id: string) => void;
  connectApp: (id: string) => void;
  disconnectApp: (id: string) => void;

  // Webhooks Actions
  addWebhook: (webhook: Omit<WebhookEndpoint, 'id' | 'createdAt' | 'failureRatePct' | 'totalDeliveries'>) => void;
  toggleWebhookStatus: (id: string) => void;
  deleteWebhook: (id: string) => void;

  // Automations Actions
  addAutomation: (automation: Omit<AutomationRule, 'id' | 'runCount' | 'createdAt'>) => void;
  toggleAutomationStatus: (id: string) => void;
  deleteAutomation: (id: string) => void;
  duplicateAutomation: (id: string) => void;

  // API Key Actions
  generateApiKey: (name: string, environment: 'sandbox' | 'production', scopes: ('read' | 'write' | 'admin')[]) => void;
  revokeApiKey: (id: string) => void;

  // Sync Health & Retry Actions
  triggerManualSync: () => void;
  retryFailedWebhooks: () => void;
  installMarketplaceApp: (id: string) => void;
}

export const usePortalIntegrationsStore = create<PortalIntegrationsState>()(
  persist(
    (set, get) => ({
      connectors: INITIAL_CONNECTORS,
      webhooks: INITIAL_WEBHOOKS,
      deliveryLogs: INITIAL_DELIVERY_LOGS,
      automations: INITIAL_AUTOMATIONS,
      apiKeys: INITIAL_API_KEYS,
      syncHealth: INITIAL_SYNC_HEALTH,
      activityLogs: INITIAL_ACTIVITY_LOGS,
      marketplaceApps: INITIAL_MARKETPLACE,
      aiInsights: INITIAL_AI_INSIGHTS,

      searchQuery: '',
      categoryFilter: 'all',
      logSeverityFilter: 'all',

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
      setLogSeverityFilter: (logSeverityFilter) => set({ logSeverityFilter }),

      toggleConnectorStatus: (id) =>
        set((state) => ({
          connectors: state.connectors.map((c) =>
            c.id === id
              ? { ...c, status: c.status === 'connected' ? 'disconnected' : 'connected', connectedAt: c.status === 'connected' ? undefined : new Date().toISOString() }
              : c
          ),
        })),

      connectApp: (id) =>
        set((state) => ({
          connectors: state.connectors.map((c) =>
            c.id === id ? { ...c, status: 'connected', connectedAt: new Date().toISOString() } : c
          ),
          marketplaceApps: state.marketplaceApps.map((m) =>
            m.id === id ? { ...m, installed: true } : m
          ),
        })),

      disconnectApp: (id) =>
        set((state) => ({
          connectors: state.connectors.map((c) =>
            c.id === id ? { ...c, status: 'disconnected', connectedAt: undefined } : c
          ),
        })),

      addWebhook: (webhookData) =>
        set((state) => {
          const newWebhook: WebhookEndpoint = {
            ...webhookData,
            id: `wh-${Date.now()}`,
            createdAt: new Date().toISOString().split('T')[0],
            failureRatePct: 0.0,
            totalDeliveries: 0,
          };
          return { webhooks: [newWebhook, ...state.webhooks] };
        }),

      toggleWebhookStatus: (id) =>
        set((state) => ({
          webhooks: state.webhooks.map((w) =>
            w.id === id
              ? { ...w, status: w.status === 'active' ? 'paused' : 'active' }
              : w
          ),
        })),

      deleteWebhook: (id) =>
        set((state) => ({
          webhooks: state.webhooks.filter((w) => w.id !== id),
        })),

      addAutomation: (ruleData) =>
        set((state) => {
          const newRule: AutomationRule = {
            ...ruleData,
            id: `rule-${Date.now()}`,
            runCount: 0,
            createdAt: new Date().toISOString().split('T')[0],
          };
          return { automations: [newRule, ...state.automations] };
        }),

      toggleAutomationStatus: (id) =>
        set((state) => ({
          automations: state.automations.map((a) =>
            a.id === id
              ? { ...a, isActive: !a.isActive, status: !a.isActive ? 'active' : 'paused' }
              : a
          ),
        })),

      deleteAutomation: (id) =>
        set((state) => ({
          automations: state.automations.filter((a) => a.id !== id),
        })),

      duplicateAutomation: (id) =>
        set((state) => {
          const target = state.automations.find((a) => a.id === id);
          if (!target) return state;
          const copy: AutomationRule = {
            ...target,
            id: `rule-${Date.now()}`,
            title: `${target.title} (Copy)`,
            runCount: 0,
            createdAt: new Date().toISOString().split('T')[0],
          };
          return { automations: [copy, ...state.automations] };
        }),

      generateApiKey: (name, environment, scopes) =>
        set((state) => {
          const randomSuffix = Math.random().toString(36).substring(2, 10);
          const fullKey = `fst_${environment === 'production' ? 'live' : 'test'}_${Date.now()}${randomSuffix}`;
          const newKey: ApiKeyCredentials = {
            id: `key-${Date.now()}`,
            name,
            keyPrefix: fullKey.substring(0, 14) + '...',
            fullKeySecret: fullKey,
            environment,
            scopes,
            createdAt: new Date().toISOString().split('T')[0],
            status: 'active',
          };
          return { apiKeys: [newKey, ...state.apiKeys] };
        }),

      revokeApiKey: (id) =>
        set((state) => ({
          apiKeys: state.apiKeys.map((k) => (k.id === id ? { ...k, status: 'revoked' } : k)),
        })),

      triggerManualSync: () =>
        set((state) => ({
          syncHealth: {
            ...state.syncHealth,
            lastSyncTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            pendingRetryCount: 0,
            failedItemsCount: 0,
            status: 'healthy',
          },
        })),

      retryFailedWebhooks: () =>
        set((state) => ({
          deliveryLogs: state.deliveryLogs.map((l) =>
            l.status === 'failed' ? { ...l, status: 'success', statusCode: 200, timestamp: 'Just now', attemptCount: l.attemptCount + 1 } : l
          ),
          webhooks: state.webhooks.map((w) => (w.status === 'failing' ? { ...w, status: 'active', failureRatePct: 0 } : w)),
        })),

      installMarketplaceApp: (id) =>
        set((state) => ({
          marketplaceApps: state.marketplaceApps.map((m) =>
            m.id === id ? { ...m, installed: true } : m
          ),
        })),
    }),
    {
      name: 'feasto-portal-integrations-store-r21',
      partialize: (state) => ({
        connectors: state.connectors,
        webhooks: state.webhooks,
        automations: state.automations,
        apiKeys: state.apiKeys,
        syncHealth: state.syncHealth,
        marketplaceApps: state.marketplaceApps,
      }),
    }
  )
);

export default usePortalIntegrationsStore;
