import React, { useState } from 'react';
import { Webhook, Plus, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import usePortalIntegrationsStore from '../../store/portal/portalIntegrationsStore';
import { WebhookCard, LogTable, IntegrationsEmptyState } from './IntegrationsComponents';
import { TRIGGER_DEFINITIONS } from '../../constants/integrations';

export const WebhooksPage: React.FC = () => {
  const {
    webhooks,
    deliveryLogs,
    addWebhook,
    toggleWebhookStatus,
    deleteWebhook,
    retryFailedWebhooks,
  } = usePortalIntegrationsStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>('production');
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['order.created']);

  const handleCreateWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;
    addWebhook({
      name,
      url,
      secret: `whsec_${Math.random().toString(36).substring(2, 18)}`,
      status: 'active',
      subscribedEvents: selectedEvents,
      environment,
    });
    setName('');
    setUrl('');
    setShowAddModal(false);
  };

  const toggleEvent = (evt: string) => {
    if (selectedEvents.includes(evt)) {
      setSelectedEvents(selectedEvents.filter((e) => e !== evt));
    } else {
      setSelectedEvents([...selectedEvents, evt]);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Bar */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● HMAC SHA-256 Signature Verification
            </span>
          </div>
          <h3 className="text-base font-black text-neutral-900 font-heading">
            Incoming & Outgoing Webhook Endpoint Subscriptions
          </h3>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Dispatch HTTP POST payload notifications for order updates, stock status, refund events, and review submissions.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={retryFailedWebhooks}
            className="px-3 py-2 rounded-xl text-xs font-bold border border-neutral-200 hover:bg-neutral-50 text-neutral-700 cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw size={13} />
            <span>Retry Failed (1)</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#e35205] hover:bg-[#c94804] text-white cursor-pointer flex items-center gap-1.5 transition-colors shadow-3xs"
          >
            <Plus size={13} />
            <span>Add Endpoint</span>
          </button>
        </div>
      </div>

      {/* Webhook Endpoints List */}
      {webhooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {webhooks.map((w) => (
            <WebhookCard
              key={w.id}
              endpoint={w}
              onToggleStatus={toggleWebhookStatus}
              onDelete={deleteWebhook}
            />
          ))}
        </div>
      ) : (
        <IntegrationsEmptyState
          title="No Webhook Endpoints"
          description="You have not registered any webhook endpoints yet."
          actionLabel="Create Webhook Endpoint"
          onAction={() => setShowAddModal(true)}
        />
      )}

      {/* Recent Delivery Logs */}
      <div className="space-y-3 pt-4">
        <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider font-heading">
          Recent Webhook Delivery Payload Logs
        </h3>
        <LogTable
          logs={deliveryLogs.map((l) => ({
            id: l.id,
            sourceApp: l.endpointName,
            eventType: l.event,
            message: `${l.statusCode} HTTP • ${l.executionTimeMs}ms • ${l.payloadSnippet}`,
            severity: l.status === 'success' ? 'success' : 'error',
            timestamp: l.timestamp,
          }))}
        />
      </div>

      {/* Add Webhook Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateWebhook}
            className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-modal max-w-lg w-full text-left space-y-4"
          >
            <h3 className="text-base font-black text-neutral-900 font-heading">Register New Webhook Endpoint</h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700 block">Endpoint Label Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. ERP Invoicing Endpoint"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700 block">Destination URL (HTTPS)</label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.yourdomain.com/v1/webhook"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700 block">Target Environment</label>
              <div className="flex gap-4 text-xs font-bold">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="env"
                    checked={environment === 'production'}
                    onChange={() => setEnvironment('production')}
                  />
                  <span>Production</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="env"
                    checked={environment === 'sandbox'}
                    onChange={() => setEnvironment('sandbox')}
                  />
                  <span>Sandbox</span>
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 block">Subscribed Event Topics</label>
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {TRIGGER_DEFINITIONS.map((t) => (
                  <label key={t.type} className="flex items-center gap-2 p-1.5 rounded-lg border border-neutral-200 text-[11px] font-mono cursor-pointer hover:bg-neutral-50">
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(t.type)}
                      onChange={() => toggleEvent(t.type)}
                    />
                    <span className="truncate">{t.type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-xl hover:bg-neutral-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#e35205] text-white rounded-xl hover:bg-[#c94804] cursor-pointer shadow-3xs"
              >
                Save Endpoint
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default WebhooksPage;
