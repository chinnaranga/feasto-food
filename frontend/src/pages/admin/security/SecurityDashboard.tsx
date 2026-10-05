import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, Activity, Key, Lock, Sparkles, AlertTriangle, ArrowUpRight } from 'lucide-react';
import useAdminSecurityStore from '../../../store/admin/adminSecurityStore';
import { SecuritySummaryCard, SeverityBadge } from './SecurityComponents';

export const SecurityDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { incidents, complianceItems, privacyRequests, accessEvents, threatInsights } = useAdminSecurityStore();

  const openIncidents = incidents.filter((i) => i.status !== 'resolved' && i.status !== 'closed');
  const pendingPrivacy = privacyRequests.filter((p) => p.status !== 'completed');
  const suspiciousLogins = accessEvents.filter((a) => a.eventType === 'suspicious_login');

  return (
    <div className="space-y-6 text-left">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SecuritySummaryCard
          title="Active Security Incidents"
          value={openIncidents.length}
          subtitle="1 High Severity Incident"
          statusBadge={{ text: openIncidents.length > 0 ? 'Action Required' : 'Nominal', variant: openIncidents.length > 0 ? 'danger' : 'success' }}
          icon={<ShieldAlert size={16} className="text-red-600" />}
          actionLabel="Incident Desk"
          onAction={() => navigate('/admin/security/incidents')}
        />

        <SecuritySummaryCard
          title="Pending Privacy Requests"
          value={pendingPrivacy.length}
          subtitle="DPDP & GDPR statutory SLA"
          statusBadge={{ text: `${pendingPrivacy.length} Active`, variant: 'warning' }}
          icon={<Key size={16} className="text-purple-600" />}
          actionLabel="Fulfill Requests"
          onAction={() => navigate('/admin/security/privacy-requests')}
        />

        <SecuritySummaryCard
          title="Suspicious Sign-In Alerts"
          value={suspiciousLogins.length}
          subtitle="Subnet anomaly detected"
          statusBadge={{ text: 'Flagged', variant: 'danger' }}
          icon={<Lock size={16} className="text-amber-600" />}
          actionLabel="Access Security"
          onAction={() => navigate('/admin/security/access')}
        />

        <SecuritySummaryCard
          title="DPDP / GDPR Compliance Score"
          value="98.4%"
          subtitle="All regions compliant"
          statusBadge={{ text: 'Audited', variant: 'success' }}
          icon={<ShieldCheck size={16} className="text-emerald-600" />}
          actionLabel="Compliance Audit"
          onAction={() => navigate('/admin/security/compliance')}
        />
      </div>

      {/* AI Threat Alerts */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-[#e35205]" />
          <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
            AI Threat Anomaly & Risk Alerts
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {threatInsights.map((ti) => (
            <div
              key={ti.id}
              className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex items-start justify-between gap-3 text-left"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className={ti.severity === 'critical' ? 'text-red-600' : 'text-amber-600'} />
                  <h4 className="text-xs font-black text-neutral-900">{ti.title}</h4>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">{ti.description}</p>
              </div>

              <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 shrink-0">
                {ti.recommendedAction}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Split Grid: Open Incidents & Login Anomalies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Incidents */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-4 text-left">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
              Active Security Incident Queue
            </h4>
            <button onClick={() => navigate('/admin/security/incidents')} className="text-[10px] font-bold text-[#e35205] cursor-pointer">
              View All →
            </button>
          </div>

          <div className="space-y-3">
            {incidents.map((inc) => (
              <div key={inc.id} className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-150 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-neutral-900">{inc.title}</span>
                    <span className="text-[9px] font-mono text-neutral-400">({inc.ticketNumber})</span>
                  </div>
                  <SeverityBadge severity={inc.severity} />
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">{inc.description}</p>
                <div className="text-[9px] text-neutral-400 flex justify-between pt-1">
                  <span>Assigned: {inc.assignedTo || 'Unassigned'}</span>
                  <span>Reported: {inc.reportedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suspicious Sign-Ins Stream */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-4 text-left">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
              Suspicious Sign-In Anomaly Stream
            </h4>
            <button onClick={() => navigate('/admin/security/access')} className="text-[10px] font-bold text-[#e35205] cursor-pointer">
              Access Log →
            </button>
          </div>

          <div className="space-y-2.5">
            {accessEvents.map((acc) => (
              <div key={acc.id} className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900">{acc.userEmail}</span>
                    <span className="text-[9px] text-neutral-400">({acc.userRole})</span>
                  </div>
                  <span className="text-[10px] text-neutral-500">
                    IP: {acc.ipAddress} ({acc.location})
                  </span>
                </div>

                <span
                  className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    acc.eventType === 'suspicious_login'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  Risk {acc.riskScore}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;
