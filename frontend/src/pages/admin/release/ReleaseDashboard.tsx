import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, CheckCircle2, Key, GitBranch, ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';
import useAdminReleaseStore from '../../../store/admin/adminReleaseStore';
import { ReleaseSummaryCard, BuildCheckItemWidget, ReleaseNotesCard } from './ReleaseComponents';

export const ReleaseDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { buildChecks, envVars, version, deploymentGate, rollbackState, releaseNotes, insights } = useAdminReleaseStore();

  const passingChecks = buildChecks.filter((c) => c.status === 'pass').length;
  const configuredEnvs = envVars.filter((e) => e.isConfigured).length;

  return (
    <div className="space-y-6 text-left">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReleaseSummaryCard
          title="Production Gate Status"
          value="APPROVED"
          subtitle={`Verified by ${deploymentGate.validatedBy}`}
          statusBadge={{ text: 'READY', variant: 'success' }}
          icon={<ShieldCheck size={16} className="text-emerald-600" />}
          actionLabel="Production Gate"
          onAction={() => navigate('/admin/release/deployments')}
        />

        <ReleaseSummaryCard
          title="Build Verification Suite"
          value={`${passingChecks} / ${buildChecks.length} PASS`}
          subtitle="TypeScript, ESLint, Bundle size ok"
          statusBadge={{ text: '100% Pass', variant: 'success' }}
          icon={<CheckCircle2 size={16} className="text-blue-600" />}
          actionLabel="Build Details"
          onAction={() => navigate('/admin/release/builds')}
        />

        <ReleaseSummaryCard
          title="Environment Variable Safety"
          value={`${configuredEnvs} / ${envVars.length} Verified`}
          subtitle="Secrets protected & validated"
          statusBadge={{ text: 'Clean', variant: 'success' }}
          icon={<Key size={16} className="text-purple-600" />}
          actionLabel="Env Variables"
          onAction={() => navigate('/admin/release/environment')}
        />

        <ReleaseSummaryCard
          title="Release Version"
          value={version.appVersion}
          subtitle={`Commit ${version.commitHash} (${version.channel})`}
          statusBadge={{ text: version.channel.toUpperCase(), variant: 'info' }}
          icon={<GitBranch size={16} className="text-neutral-800" />}
          actionLabel="Version Specs"
          onAction={() => navigate('/admin/release/versions')}
        />
      </div>

      {/* AI Release Insights */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-[#e35205]" />
          <h3 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
            AI Release Risk & Deployment Predictions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((ins) => (
            <div
              key={ins.id}
              className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex items-start justify-between gap-3 text-left"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <h4 className="text-xs font-black text-neutral-900">{ins.title}</h4>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">{ins.description}</p>
              </div>

              <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                Risk Score: {ins.riskScore}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Split Grid: Build Check Suite & Active Release Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Build Verification Checks */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
              Build Verification Suite Status
            </h4>
            <button onClick={() => navigate('/admin/release/builds')} className="text-[10px] font-bold text-[#e35205] cursor-pointer">
              All Checks →
            </button>
          </div>

          <div className="space-y-3">
            {buildChecks.slice(0, 3).map((check) => (
              <BuildCheckItemWidget key={check.id} check={check} />
            ))}
          </div>
        </div>

        {/* Release Notes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider font-heading">
              Active Production Release Notes ({version.appVersion})
            </h4>
            <button onClick={() => navigate('/admin/release/notes')} className="text-[10px] font-bold text-[#e35205] cursor-pointer">
              All Notes →
            </button>
          </div>

          <div>
            {releaseNotes[0] && <ReleaseNotesCard notes={releaseNotes[0]} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReleaseDashboard;
