import React, { useState } from 'react';
import { Settings, ShieldCheck, Bell, Lock } from 'lucide-react';

export const IntegrationSettingsPage: React.FC = () => {
  const [retryAttempts, setRetryAttempts] = useState('3');
  const [signatureEnforced, setSignatureEnforced] = useState(true);
  const [emailFailureAlerts, setEmailFailureAlerts] = useState(true);
  const [rateLimitThreshold, setRateLimitThreshold] = useState('10000');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-6 max-w-2xl">
        <div className="space-y-1 border-b border-neutral-100 pb-4">
          <h3 className="text-base font-black text-neutral-900 font-heading">
            Global Integration & Webhook Security Settings
          </h3>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Configure global Webhook retry policies, payload signing secrets, failure alert notifications, and API rate limiting quotas.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5 text-xs">
          {/* Retry Attempts */}
          <div className="space-y-1.5">
            <label className="font-bold text-neutral-800 block">Automatic Webhook Retry Limit</label>
            <select
              value={retryAttempts}
              onChange={(e) => setRetryAttempts(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-800 focus:outline-none"
            >
              <option value="1">1 Retry Attempt</option>
              <option value="3">3 Retry Attempts (Exponential Backoff)</option>
              <option value="5">5 Retry Attempts</option>
            </select>
          </div>

          {/* Signature Enforcement */}
          <div className="flex items-center justify-between py-2 border-y border-neutral-100">
            <div>
              <span className="font-bold text-neutral-800 block">Enforce HMAC SHA-256 Signature Header</span>
              <span className="text-[11px] text-neutral-500 block">Reject unsigned incoming webhook dispatches.</span>
            </div>
            <input
              type="checkbox"
              checked={signatureEnforced}
              onChange={(e) => setSignatureEnforced(e.target.checked)}
              className="w-4 h-4 text-[#e35205] cursor-pointer"
            />
          </div>

          {/* Failure Alerts */}
          <div className="flex items-center justify-between py-2 border-b border-neutral-100">
            <div>
              <span className="font-bold text-neutral-800 block">Email Alerts on Endpoint Failure</span>
              <span className="text-[11px] text-neutral-500 block">Send immediate alert email if an endpoint fails 3 consecutive times.</span>
            </div>
            <input
              type="checkbox"
              checked={emailFailureAlerts}
              onChange={(e) => setEmailFailureAlerts(e.target.checked)}
              className="w-4 h-4 text-[#e35205] cursor-pointer"
            />
          </div>

          {/* Rate Limit Quotas */}
          <div className="space-y-1.5">
            <label className="font-bold text-neutral-800 block">REST API Rate Limit Quota (Requests per Minute)</label>
            <select
              value={rateLimitThreshold}
              onChange={(e) => setRateLimitThreshold(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-800 focus:outline-none"
            >
              <option value="1000">1,000 requests / min (Standard)</option>
              <option value="10000">10,000 requests / min (Enterprise)</option>
              <option value="50000">50,000 requests / min (High Throughput)</option>
            </select>
          </div>

          <div className="pt-3 flex items-center gap-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#e35205] hover:bg-[#c94804] text-white font-bold rounded-xl transition-colors cursor-pointer shadow-3xs"
            >
              Save Settings
            </button>
            {saved && <span className="text-xs font-bold text-emerald-600">✓ Settings saved successfully</span>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default IntegrationSettingsPage;
