import React from 'react';
import { Key, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import useAdminReleaseStore from '../../../store/admin/adminReleaseStore';
import { EnvironmentCard } from './ReleaseComponents';

export const EnvironmentSafety: React.FC = () => {
  const { envVars } = useAdminReleaseStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              ● Environment Variable Safety Gate
            </span>
            <span className="text-xs text-neutral-400 font-bold">VITE_ Environment Isolation</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Environment Variable Audit & Secret Safety
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Verify required environment variables, validate secret protection, inspect client-side vs. server-side configs, and check runtime env integrity.
          </p>
        </div>
      </div>

      {/* Env Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {envVars.map((env) => (
          <EnvironmentCard key={env.key} env={env} />
        ))}
      </div>
    </div>
  );
};

export default EnvironmentSafety;
