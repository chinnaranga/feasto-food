// ─── Stage R21 Integrations, Webhooks & Workflow Automation Types ─────────────

export type AppCategory =
  | 'payment'
  | 'delivery'
  | 'accounting'
  | 'pos'
  | 'messaging'
  | 'inventory'
  | 'crm'
  | 'printer';

export type ConnectionStatus = 'connected' | 'disconnected' | 'degraded' | 'error' | 'pending';

export interface AppConnector {
  id: string;
  name: string;
  category: AppCategory;
  description: string;
  icon: string;
  developer: string;
  version: string;
  status: ConnectionStatus;
  isPopular?: boolean;
  isFeatured?: boolean;
  connectedAt?: string;
  lastSyncAt?: string;
  permissions: string[];
  docsUrl?: string;
  config?: {
    apiKey?: string;
    webhookUrl?: string;
    environment?: 'sandbox' | 'production';
    autoSync?: boolean;
  };
}

export type WebhookStatus = 'active' | 'paused' | 'failing';

export interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  secret: string;
  status: WebhookStatus;
  subscribedEvents: string[];
  createdAt: string;
  lastDeliveredAt?: string;
  failureRatePct: number;
  totalDeliveries: number;
  environment: 'sandbox' | 'production';
}

export interface WebhookDeliveryLog {
  id: string;
  endpointId: string;
  endpointName: string;
  event: string;
  statusCode: number;
  executionTimeMs: number;
  payloadSnippet: string;
  timestamp: string;
  status: 'success' | 'failed' | 'retrying';
  responseBody?: string;
  attemptCount: number;
}

export type TriggerEventType =
  | 'order.created'
  | 'order.accepted'
  | 'order.delayed'
  | 'order.ready'
  | 'order.completed'
  | 'inventory.low_stock'
  | 'inventory.out_of_stock'
  | 'customer.created'
  | 'review.received'
  | 'invoice.paid'
  | 'refund.issued'
  | 'staff.shift_started'
  | 'promotion.expired'
  | 'incident.created';

export type ActionType =
  | 'send_notification'
  | 'update_inventory'
  | 'change_menu_status'
  | 'tag_customer'
  | 'send_email'
  | 'send_sms'
  | 'trigger_webhook'
  | 'create_support_ticket'
  | 'sync_external_system';

export interface TriggerDefinition {
  type: TriggerEventType;
  label: string;
  category: 'orders' | 'inventory' | 'customer' | 'finance' | 'staff' | 'system';
  description: string;
  availableVariables: string[];
}

export interface ActionDefinition {
  type: ActionType;
  label: string;
  description: string;
  targetSystem: string;
}

export interface AutomationRule {
  id: string;
  title: string;
  description: string;
  triggerEvent: TriggerEventType;
  action: ActionType;
  actionConfig: Record<string, any>;
  isActive: boolean;
  runCount: number;
  lastTriggeredAt?: string;
  createdAt: string;
  createdByName: string;
  branchScope: 'all' | 'specific';
  status: 'active' | 'paused' | 'draft' | 'error';
}

export interface ApiKeyCredentials {
  id: string;
  name: string;
  keyPrefix: string;
  fullKeySecret?: string;
  environment: 'sandbox' | 'production';
  scopes: ('read' | 'write' | 'admin')[];
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
  status: 'active' | 'revoked';
}

export interface SyncHealthMetrics {
  lastSyncTimestamp: string;
  syncSuccessRatePct: number;
  avgSyncLagMs: number;
  failedItemsCount: number;
  pendingRetryCount: number;
  conflictCount: number;
  status: 'healthy' | 'degraded' | 'critical';
}

export interface IntegrationActivityLog {
  id: string;
  sourceApp: string;
  eventType: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface MarketplaceApp {
  id: string;
  name: string;
  category: AppCategory;
  tagline: string;
  rating: number;
  reviewCount: number;
  installed: boolean;
  priceModel: 'Free' | 'Freemium' | 'Paid';
  developer: string;
  bannerColor: string;
  features: string[];
  requiredPermissions: string[];
}

export interface SmartAIInsight {
  id: string;
  title: string;
  description: string;
  impactScore: 'high' | 'medium' | 'low';
  type: 'retry_optimization' | 'conflict_prediction' | 'automation_suggestion' | 'anomaly_detected';
  actionLabel: string;
}

export default AppConnector;
