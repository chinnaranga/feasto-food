import React from 'react';
import { GitBranch, CheckCircle2, Terminal, Clock, ShieldCheck } from 'lucide-react';
import useAdminReleaseStore from '../../../store/admin/adminReleaseStore';

export const VersioningManagement: React.FC = () => {
  const { version } = useAdminReleaseStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              ● Semantic Versioning Control
            </span>
            <span className="text-xs text-neutral-400 font-bold">SemVer 2.0 Standard</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Application Release Versioning & Commit Specifications
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Inspect semantic app versions (`v2.4.1`), build compilation timestamps, Git commit hashes, release channel tags, and version drift detectors.
          </p>
        </div>
      </div>

      {/* Version Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Semantic App Version</span>
          <h3 className="text-2xl font-black text-neutral-900 font-mono">{version.appVersion}</h3>
          <span className="text-[10px] text-emerald-600 font-bold">● Channel: {version.channel}</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Git Commit SHA</span>
          <h3 className="text-2xl font-black text-neutral-900 font-mono">{version.commitHash}</h3>
          <span className="text-[10px] text-neutral-400">Branch: {version.gitBranch}</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Build Timestamp</span>
          <h3 className="text-lg font-black text-neutral-900">{version.buildTimestamp}</h3>
          <span className="text-[10px] text-emerald-600 font-bold">Zero Version Drift</span>
        </div>
      </div>
    </div>
  );
};

export default VersioningManagement;
