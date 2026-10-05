import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ExternalLink,
  Copy,
  Zap,
  Play,
  Pause,
  RefreshCw,
  Sliders,
  Shield,
  Layers,
  Key,
  Database,
  Search,
  Check,
  Plus,
} from 'lucide-react';
import type {
  AppConnector,
  WebhookEndpoint,
  WebhookDeliveryLog,
  AutomationRule,
  ApiKeyCredentials,
  SyncHealthMetrics,
  IntegrationActivityLog,
  MarketplaceApp,
  ConnectionStatus,
} from '../../types/integrations';

// ─── ConnectionStatusBadge ───────────────────────────────────────────────────
export const ConnectionStatusBadge: React.FC<{ status: ConnectionStatus }> = ({ status }) => {
  const styles: Record<ConnectionStatus, string> = {
    connected: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    disconnected: 'bg-neutral-100 text-neutral-600 border-neutral-250',
    degraded: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    pending: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  const labels: Record<ConnectionStatus, string> = {
    connected: '● Connected',
    disconnected: 'Disconnected',
    degraded: '▲ Degraded',
    error: '✖ Error',
    pending: '⏳ Pending',
  };

  return (
    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

// ─── SeverityBadge ────────────────────────────────────────────────────────────
export const SeverityBadge: React.FC<{ severity: 'info' | 'warning' | 'error' | 'success' }> = ({ severity }) => {
  const styles = {
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border ${styles[severity]}`}>
      {severity}
    </span>
  );
};

// ─── IntegrationsSummaryCard ─────────────────────────────────────────────────
export interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  statusTag?: string;
  statusVariant?: 'success' | 'warning' | 'neutral';
}

export const IntegrationsSummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  statusTag,
  statusVariant = 'neutral',
}) => {
  const statusStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    neutral: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs text-left space-y-3 transition-all hover:border-neutral-300">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-heading">
          {title}
        </span>
        <div className="p-2 rounded-xl bg-neutral-100 text-neutral-600">{icon}</div>
      </div>

      <div>
        <h3 className="text-2xl font-black text-neutral-900 font-mono leading-none">{value}</h3>
        {subtitle && <p className="text-[11px] text-neutral-500 font-medium mt-1.5">{subtitle}</p>}
      </div>

      {statusTag && (
        <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusStyles[statusVariant]}`}>
          {statusTag}
        </span>
      )}
    </div>
  );
};

// ─── ConnectionCard / AppCard ────────────────────────────────────────────────
export const AppCard: React.FC<{
  connector: AppConnector;
  onToggleStatus: (id: string) => void;
}> = ({ connector, onToggleStatus }) => {
  return (
    <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs text-left flex flex-col justify-between space-y-4 hover:border-neutral-300 transition-all">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-xl bg-neutral-50 border border-neutral-150 select-none">
              {connector.icon}
            </span>
            <div>
              <h4 className="text-sm font-black text-neutral-900 font-heading">{connector.name}</h4>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                {connector.category} • {connector.developer}
              </span>
            </div>
          </div>
          <ConnectionStatusBadge status={connector.status} />
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed">{connector.description}</p>
      </div>

      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
        <span className="text-[10px] text-neutral-400 font-semibold">
          {connector.lastSyncAt ? `Last sync: ${connector.lastSyncAt}` : 'Not synchronized'}
        </span>

        <button
          onClick={() => onToggleStatus(connector.id)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            connector.status === 'connected'
              ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              : 'bg-[#e35205] hover:bg-[#c94804] text-white shadow-3xs'
          }`}
        >
          {connector.status === 'connected' ? 'Disconnect' : 'Connect'}
        </button>
      </div>
    </div>
  );
};

// ─── WebhookCard ─────────────────────────────────────────────────────────────
export const WebhookCard: React.FC<{
  endpoint: WebhookEndpoint;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ endpoint, onToggleStatus, onDelete }) => {
  const [copied, setCopied] = React.useState(false);

  const copySecret = () => {
    navigator.clipboard.writeText(endpoint.secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs text-left space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-black text-neutral-900 font-heading">{endpoint.name}</h4>
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              endpoint.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {endpoint.status}
            </span>
          </div>
          <span className="text-xs font-mono text-neutral-600 block truncate">{endpoint.url}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onToggleStatus(endpoint.id)}
            className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg cursor-pointer transition-colors"
            title={endpoint.status === 'active' ? 'Pause Webhook' : 'Activate Webhook'}
          >
            {endpoint.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            onClick={() => onDelete(endpoint.id)}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
            title="Delete Webhook"
          >
            <XCircle size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {endpoint.subscribedEvents.map((evt) => (
          <span key={evt} className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200">
            {evt}
          </span>
        ))}
      </div>

      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span>Secret: {endpoint.secret.substring(0, 10)}...</span>
          <button onClick={copySecret} className="text-[#e35205] font-bold hover:underline cursor-pointer">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <span className="text-[10px]">Deliveries: {endpoint.totalDeliveries} • Failure: {endpoint.failureRatePct}%</span>
      </div>
    </div>
  );
};

// ─── AutomationCard ──────────────────────────────────────────────────────────
export const AutomationCard: React.FC<{
  rule: AutomationRule;
  onToggle: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ rule, onToggle, onDuplicate, onDelete }) => {
  return (
    <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs text-left space-y-4 hover:border-neutral-300 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Zap size={15} className={rule.isActive ? 'text-[#e35205]' : 'text-neutral-400'} />
            <h4 className="text-sm font-black text-neutral-900 font-heading">{rule.title}</h4>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">{rule.description}</p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={rule.isActive}
            onChange={() => onToggle(rule.id)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e35205]"></div>
        </label>
      </div>

      <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-150 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-neutral-400 uppercase">Trigger:</span>
          <span className="text-[#e35205] font-bold">{rule.triggerEvent}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-neutral-400 uppercase">Action:</span>
          <span className="text-neutral-800 font-bold">{rule.action}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-neutral-400 border-t border-neutral-100 pt-3">
        <span>Executed: {rule.runCount} times • Last: {rule.lastTriggeredAt || 'Never'}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => onDuplicate(rule.id)} className="text-neutral-600 hover:text-neutral-900 font-bold cursor-pointer">
            Duplicate
          </button>
          <button onClick={() => onDelete(rule.id)} className="text-red-500 hover:text-red-700 font-bold cursor-pointer">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── ApiKeyCard ──────────────────────────────────────────────────────────────
export const ApiKeyCard: React.FC<{
  apiKey: ApiKeyCredentials;
  onRevoke: (id: string) => void;
}> = ({ apiKey, onRevoke }) => {
  const [showFull, setShowFull] = React.useState(false);

  return (
    <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs text-left space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Key size={15} className="text-[#e35205]" />
          <h4 className="text-xs font-black text-neutral-900 font-heading">{apiKey.name}</h4>
        </div>
        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
          apiKey.environment === 'production' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'
        }`}>
          {apiKey.environment}
        </span>
      </div>

      <div className="p-3 rounded-xl bg-neutral-900 text-white font-mono text-xs flex items-center justify-between">
        <span>{showFull && apiKey.fullKeySecret ? apiKey.fullKeySecret : apiKey.keyPrefix}</span>
        {apiKey.fullKeySecret && (
          <button
            onClick={() => setShowFull(!showFull)}
            className="text-[10px] text-neutral-400 hover:text-white font-sans font-bold cursor-pointer"
          >
            {showFull ? 'Hide' : 'Reveal'}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1">
        <span>Scopes: {apiKey.scopes.join(', ')}</span>
        <button onClick={() => onRevoke(apiKey.id)} className="text-red-500 hover:text-red-700 font-bold cursor-pointer">
          Revoke Key
        </button>
      </div>
    </div>
  );
};

// ─── LogTable ────────────────────────────────────────────────────────────────
export const LogTable: React.FC<{ logs: IntegrationActivityLog[] }> = ({ logs }) => {
  return (
    <div className="bg-white border border-neutral-200/90 rounded-2xl shadow-2xs overflow-hidden text-left">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 border-b border-neutral-200/80 text-[10px] font-black uppercase text-neutral-500 font-heading tracking-wider">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Source App</th>
              <th className="px-4 py-3">Event Type</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-neutral-700 font-sans">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-neutral-50/70 transition-colors">
                <td className="px-4 py-3 font-mono text-neutral-400 text-[11px]">{log.timestamp}</td>
                <td className="px-4 py-3 font-bold text-neutral-900">{log.sourceApp}</td>
                <td className="px-4 py-3 font-mono text-neutral-600 text-[11px]">{log.eventType}</td>
                <td className="px-4 py-3">
                  <SeverityBadge severity={log.severity} />
                </td>
                <td className="px-4 py-3 text-neutral-600 max-w-md truncate">{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── MarketplaceCard ─────────────────────────────────────────────────────────
export const MarketplaceCard: React.FC<{
  app: MarketplaceApp;
  onInstall: (id: string) => void;
}> = ({ app, onInstall }) => {
  return (
    <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs text-left space-y-4 flex flex-col justify-between hover:border-neutral-300 transition-all">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-sm font-black text-neutral-900 font-heading">{app.name}</h4>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{app.developer}</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
            {app.priceModel}
          </span>
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed">{app.tagline}</p>

        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase text-neutral-400 block">Key Features:</span>
          <ul className="text-xs text-neutral-600 space-y-0.5">
            {app.features.map((f, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <Check size={11} className="text-emerald-600 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
        <span className="text-xs font-bold text-neutral-800">★ {app.rating} ({app.reviewCount})</span>
        <button
          onClick={() => onInstall(app.id)}
          disabled={app.installed}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            app.installed
              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-3xs'
          }`}
        >
          {app.installed ? 'Installed' : 'Install App'}
        </button>
      </div>
    </div>
  );
};

// ─── IntegrationsEmptyState ──────────────────────────────────────────────────
export const IntegrationsEmptyState: React.FC<{
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ title, description, actionLabel, onAction }) => (
  <div className="p-12 text-center bg-white rounded-2xl border border-neutral-200/90 shadow-2xs space-y-3">
    <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
      <Layers size={22} />
    </div>
    <h4 className="text-sm font-black text-neutral-900 font-heading">{title}</h4>
    <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">{description}</p>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
      >
        <Plus size={13} />
        <span>{actionLabel}</span>
      </button>
    )}
  </div>
);

export default IntegrationsSummaryCard;
