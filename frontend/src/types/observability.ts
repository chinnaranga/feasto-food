export type SeverityLevel = 'info' | 'warn' | 'error' | 'fatal';

export type EventCategory =
  | 'route'
  | 'component'
  | 'network'
  | 'form'
  | 'security'
  | 'pwa'
  | 'release'
  | 'interaction'
  | 'auth';

export interface UserContext {
  uid: string;
  email?: string;
  role?: string;
}

export interface ConnectionContext {
  online: boolean;
  type?: string;
  effectiveType?: string;
}

export interface TelemetryContext {
  route?: string;
  user?: UserContext;
  connection?: ConnectionContext;
  locale?: string;
  releaseVersion?: string;
  releaseChannel?: string;
  failedRequestType?: string;
}

export interface ErrorDetails {
  name: string;
  message: string;
  stack?: string;
}

export interface ActionContext {
  lastActions: string[];
}

export interface RecoveryState {
  recoveryTriggered: boolean;
  recoveryAction: string;
}

export interface DiagnosticEvent {
  id: string;
  timestamp: string;
  category: EventCategory;
  severity: SeverityLevel;
  message: string;
  errorDetails?: ErrorDetails;
  context: TelemetryContext;
  actionContext?: ActionContext;
  recoveryState?: RecoveryState;
}

export interface RouteHealthMetrics {
  errors: number;
  warnings: number;
  score: number;
  avgLoadTime?: number;
}

export interface ClientHealthStats {
  errorCount: number;
  warningCount: number;
  healthScore: number; // 0-100%
  status: 'optimal' | 'degraded' | 'critical';
  routeHealth: Record<string, RouteHealthMetrics>;
}
