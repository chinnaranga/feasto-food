import React, { useState } from 'react';
import { Settings, ShieldCheck, Globe, Database, Save, Lock } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [platformName, setPlatformName] = useState<string>('Feasto Enterprise Food System');
  const [supportSlaHours, setSupportSlaHours] = useState<number>(2);
  const [auditLogRetentionDays, setAuditLogRetentionDays] = useState<number>(365);
  const [mandatoryMfa, setMandatoryMfa] = useState<boolean>(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert('System settings updated and synchronized across all platform microservices.');
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
              ● Global System Governance Configuration
            </span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Platform Settings & Compliance Policies
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Configure platform branding parameters, security policy parameters, SLA escalation thresholds, and data retention windows.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Brand & Regional Defaults */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Globe size={16} className="text-[#e35205]" />
            <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
              Platform Identity & Regional Defaults
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Platform Name
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#e35205]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Default Currency & Locale
              </label>
              <input
                type="text"
                disabled
                value="INR (₹) — Asia/Kolkata (IST)"
                className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Security & SLA Policies */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Lock size={16} className="text-amber-600" />
            <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
              Security & SLA Policies
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Support Ticket SLA Escalation Threshold (Hours)
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={supportSlaHours}
                onChange={(e) => setSupportSlaHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#e35205]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Mandatory Multi-Factor Authentication (MFA)
              </label>
              <div className="flex items-center justify-between p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl">
                <span className="font-bold text-neutral-800">Require MFA for Super Admin Access</span>
                <input
                  type="checkbox"
                  checked={mandatoryMfa}
                  onChange={(e) => setMandatoryMfa(e.target.checked)}
                  className="w-4 h-4 accent-[#e35205] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data Retention Policies */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Database size={16} className="text-blue-600" />
            <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
              Compliance Data Retention Windows
            </h3>
          </div>

          <div className="text-xs">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Audit Log History Retention (Days)
            </label>
            <input
              type="number"
              min="30"
              max="3650"
              value={auditLogRetentionDays}
              onChange={(e) => setAuditLogRetentionDays(Number(e.target.value))}
              className="w-full max-w-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#e35205]"
            />
            <p className="text-[10px] text-neutral-400 mt-1">
              Audit logs older than {auditLogRetentionDays} days will be archived to encrypted cold storage.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs"
          >
            <Save size={14} />
            <span>Save System Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
