import React from 'react';
import { FileText, Plus } from 'lucide-react';
import useAdminReleaseStore from '../../../store/admin/adminReleaseStore';
import { ReleaseNotesCard } from './ReleaseComponents';

export const ReleaseNotes: React.FC = () => {
  const { releaseNotes } = useAdminReleaseStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              ● Changelog & Release Communications
            </span>
            <span className="text-xs text-neutral-400 font-bold">Platform Release Log</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Release Notes & Feature Changelog Publisher
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Document platform feature releases, bug fix summaries, performance optimizations, and security patches for merchant operators and internal teams.
          </p>
        </div>
      </div>

      {/* Release Notes List */}
      <div className="space-y-4">
        {releaseNotes.map((rn) => (
          <ReleaseNotesCard key={rn.id} notes={rn} />
        ))}
      </div>
    </div>
  );
};

export default ReleaseNotes;
