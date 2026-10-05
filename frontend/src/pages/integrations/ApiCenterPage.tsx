import React, { useState } from 'react';
import { Key, Plus, Shield, ShieldCheck, Eye, EyeOff, Copy } from 'lucide-react';
import usePortalIntegrationsStore from '../../store/portal/portalIntegrationsStore';
import { ApiKeyCard, IntegrationsEmptyState } from './IntegrationsComponents';

export const ApiCenterPage: React.FC = () => {
  const { apiKeys, generateApiKey, revokeApiKey } = usePortalIntegrationsStore();

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>('production');
  const [selectedScopes, setSelectedScopes] = useState<('read' | 'write' | 'admin')[]>(['read', 'write']);

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName) return;
    generateApiKey(keyName, environment, selectedScopes);
    setKeyName('');
    setShowGenerateModal(false);
  };

  const toggleScope = (scope: 'read' | 'write' | 'admin') => {
    if (selectedScopes.includes(scope)) {
      setSelectedScopes(selectedScopes.filter((s) => s !== scope));
    } else {
      setSelectedScopes([...selectedScopes, scope]);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Bar */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              🔒 Scoped Access & Rate Limited (10,000 req/min)
            </span>
          </div>
          <h3 className="text-base font-black text-neutral-900 font-heading">
            API Keys, Access Credentials & Environment Tokens
          </h3>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Manage REST API secret keys for custom merchant integrations, mobile app frontends, and external POS data ingestion.
          </p>
        </div>

        <button
          onClick={() => setShowGenerateModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#e35205] hover:bg-[#c94804] text-white cursor-pointer flex items-center gap-1.5 transition-colors shadow-3xs shrink-0"
        >
          <Plus size={13} />
          <span>Generate New API Key</span>
        </button>
      </div>

      {/* Keys List */}
      {apiKeys.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {apiKeys.map((key) => (
            <ApiKeyCard key={key.id} apiKey={key} onRevoke={revokeApiKey} />
          ))}
        </div>
      ) : (
        <IntegrationsEmptyState
          title="No API Keys Generated"
          description="Generate a secret API key to start connecting your custom software services to Feasto API."
          actionLabel="Generate API Key"
          onAction={() => setShowGenerateModal(true)}
        />
      )}

      {/* API Scope Reference Guide */}
      <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3">
        <h4 className="text-xs font-black text-neutral-900 font-heading uppercase tracking-wider">
          API Permission Scope Reference
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-150 space-y-1">
            <strong className="text-emerald-700 font-bold block">read</strong>
            <p className="text-neutral-500 text-[11px]">Read-only access to menu items, order history, and guest ratings.</p>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-150 space-y-1">
            <strong className="text-blue-700 font-bold block">write</strong>
            <p className="text-neutral-500 text-[11px]">Create/update kitchen orders, toggle stock availability, and update shift schedules.</p>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-150 space-y-1">
            <strong className="text-purple-700 font-bold block">admin</strong>
            <p className="text-neutral-500 text-[11px]">Full access to payout settings, user management, and security logs.</p>
          </div>
        </div>
      </div>

      {/* Generate API Key Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateKey}
            className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-modal max-w-md w-full text-left space-y-4"
          >
            <h3 className="text-base font-black text-neutral-900 font-heading">Generate New Secret API Key</h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700 block">Key Identification Name</label>
              <input
                type="text"
                required
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="e.g. Mobile POS Sync Service"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-neutral-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-700 block">Environment</label>
              <div className="flex gap-4 text-xs font-bold">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="keyenv"
                    checked={environment === 'production'}
                    onChange={() => setEnvironment('production')}
                  />
                  <span>Production (Live)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="keyenv"
                    checked={environment === 'sandbox'}
                    onChange={() => setEnvironment('sandbox')}
                  />
                  <span>Sandbox (Test)</span>
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 block">Allowed Permission Scopes</label>
              <div className="flex gap-3 text-xs">
                {(['read', 'write', 'admin'] as const).map((s) => (
                  <label key={s} className="flex items-center gap-1.5 cursor-pointer font-mono font-bold">
                    <input
                      type="checkbox"
                      checked={selectedScopes.includes(s)}
                      onChange={() => toggleScope(s)}
                    />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-xl hover:bg-neutral-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#e35205] text-white rounded-xl hover:bg-[#c94804] cursor-pointer shadow-3xs"
              >
                Generate Key
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ApiCenterPage;
