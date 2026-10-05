import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Webhook, Zap, Activity, Key, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import usePortalIntegrationsStore from '../../store/portal/portalIntegrationsStore';
import {
  IntegrationsSummaryCard,
  AppCard,
  WebhookCard,
  AutomationCard,
} from './IntegrationsComponents';

export const IntegrationsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    connectors,
    webhooks,
    automations,
    syncHealth,
    aiInsights,
    toggleConnectorStatus,
    toggleWebhookStatus,
    deleteWebhook,
    toggleAutomationStatus,
    duplicateAutomation,
    deleteAutomation,
  } = usePortalIntegrationsStore();

  const connectedAppsCount = connectors.filter((c) => c.status === 'connected').length;
  const activeWebhooksCount = webhooks.filter((w) => w.status === 'active').length;
  const activeAutomationsCount = automations.filter((a) => a.isActive).length;

  return (
    <div className="space-y-6 text-left">
      {/* 4 Primary Summary Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <IntegrationsSummaryCard
          title="Connected Apps"
          value={`${connectedAppsCount} Active`}
          subtitle={`${connectors.length} Total Available`}
          icon={<Layers size={18} />}
          statusTag="● Sync Operational"
          statusVariant="success"
        />
        <IntegrationsSummaryCard
          title="Active Webhooks"
          value={`${activeWebhooksCount} Endpoints`}
          subtitle="Avg Latency 114ms"
          icon={<Webhook size={18} />}
          statusTag="99.8% Success Rate"
          statusVariant="success"
        />
        <IntegrationsSummaryCard
          title="Active Automations"
          value={`${activeAutomationsCount} Rules`}
          subtitle="1,300+ Executions"
          icon={<Zap size={18} />}
          statusTag="● Event Driven"
          statusVariant="success"
        />
        <IntegrationsSummaryCard
          title="Sync Health Engine"
          value={`${syncHealth.syncSuccessRatePct}%`}
          subtitle={`Lag: ${syncHealth.avgSyncLagMs}ms`}
          icon={<RefreshCw size={18} />}
          statusTag="● System Healthy"
          statusVariant="success"
        />
      </div>

      {/* AI Integration Optimization Banner */}
      {aiInsights.length > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#e35205] animate-pulse" />
              <h4 className="text-xs font-black uppercase text-neutral-900 tracking-wider font-heading">
                AI Optimization Suggestion: {aiInsights[0].title}
              </h4>
            </div>
            <p className="text-xs text-neutral-600 max-w-2xl leading-relaxed">
              {aiInsights[0].description}
            </p>
          </div>
          <button
            onClick={() => navigate('/restaurant/integrations/webhooks')}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
          >
            {aiInsights[0].actionLabel}
          </button>
        </div>
      )}

      {/* Featured Apps & Connectors Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider font-heading">
            Active Enterprise Connectors
          </h3>
          <button
            onClick={() => navigate('/restaurant/integrations/apps')}
            className="text-xs font-bold text-[#e35205] hover:underline cursor-pointer"
          >
            View All Apps ({connectors.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectors.slice(0, 3).map((c) => (
            <AppCard key={c.id} connector={c} onToggleStatus={toggleConnectorStatus} />
          ))}
        </div>
      </div>

      {/* Webhooks & Active Automations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Webhooks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider font-heading">
              Webhook Endpoints Status
            </h3>
            <button
              onClick={() => navigate('/restaurant/integrations/webhooks')}
              className="text-xs font-bold text-[#e35205] hover:underline cursor-pointer"
            >
              All Webhooks ({webhooks.length}) →
            </button>
          </div>

          <div className="space-y-3">
            {webhooks.slice(0, 2).map((w) => (
              <WebhookCard
                key={w.id}
                endpoint={w}
                onToggleStatus={toggleWebhookStatus}
                onDelete={deleteWebhook}
              />
            ))}
          </div>
        </div>

        {/* Workflow Automations */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider font-heading">
              Trigger-Action Automations
            </h3>
            <button
              onClick={() => navigate('/restaurant/integrations/automations')}
              className="text-xs font-bold text-[#e35205] hover:underline cursor-pointer"
            >
              All Automations ({automations.length}) →
            </button>
          </div>

          <div className="space-y-3">
            {automations.slice(0, 2).map((a) => (
              <AutomationCard
                key={a.id}
                rule={a}
                onToggle={toggleAutomationStatus}
                onDuplicate={duplicateAutomation}
                onDelete={deleteAutomation}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsDashboard;
