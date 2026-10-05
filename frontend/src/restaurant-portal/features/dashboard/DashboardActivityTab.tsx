import React, { useState } from 'react';
import { Search, UserCheck } from 'lucide-react';
import usePortalDashboardStore from '../../store/portalDashboardStore';
import Card from '../../components/ui/Card';

export const DashboardActivityTab: React.FC = () => {
  const { activities } = usePortalDashboardStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActivities = activities.filter((act) => {
    const query = searchQuery.toLowerCase();
    return (
      act.user.toLowerCase().includes(query) ||
      act.role.toLowerCase().includes(query) ||
      act.action.toLowerCase().includes(query)
    );
  });

  const getElapsedTime = (isoStr: string) => {
    const elapsedMs = Date.now() - new Date(isoStr).getTime();
    const elapsedMins = Math.floor(elapsedMs / (60 * 1000));
    if (elapsedMins < 1) return 'Just now';
    if (elapsedMins < 60) return `${elapsedMins}m ago`;
    return `${Math.floor(elapsedMins / 60)}h ago`;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      Owner: 'text-indigo-700 bg-indigo-50 border-indigo-100',
      Manager: 'text-emerald-700 bg-emerald-50 border-emerald-100',
      Finance: 'text-amber-700 bg-amber-50 border-amber-100',
      System: 'text-neutral-600 bg-neutral-100 border-neutral-200',
    };
    return colors[role] || 'text-neutral-500 bg-neutral-50 border-neutral-100';
  };

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Activity Timeline Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-800">Workspace Activity Log</h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Audit trail of operations updates, menu adjustments, and merchant panel updates.
          </p>
        </div>

        {/* Local search field */}
        <div className="relative w-full sm:w-64">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:ring-2 focus:ring-[#e35205]/20 focus:outline-none rounded-xl text-xs font-semibold text-neutral-800 transition-all placeholder:text-neutral-400"
          />
        </div>
      </div>

      {/* Timeline entries list */}
      {filteredActivities.length > 0 ? (
        <div className="relative border-l border-neutral-200 pl-5 ml-2.5 space-y-6 py-1">
          {filteredActivities.map((act) => (
            <div key={act.id} className="relative group text-left">
              {/* Timeline marker */}
              <div className="absolute -left-[26px] top-0.5 w-3 h-3 rounded-full bg-white border-2 border-[#e35205] group-hover:bg-[#e35205] transition-colors" />

              <div className="space-y-1">
                {/* Meta details row */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-neutral-800">{act.user}</span>
                  <span className={`px-1.5 py-0.5 rounded border text-[8px] font-black uppercase tracking-wider ${getRoleColor(act.role)}`}>
                    {act.role}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium ml-auto">
                    {getElapsedTime(act.timestamp)}
                  </span>
                </div>

                {/* Audit action text */}
                <p className="text-xs text-neutral-500 font-medium leading-relaxed max-w-2xl">
                  {act.action}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2">
          <div className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-400 mb-4">
            <UserCheck size={16} />
          </div>
          <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            No Logs Found
          </h4>
          <p className="text-[10px] text-neutral-400 mt-1 max-w-sm leading-relaxed">
            There are no activity logs matching your search parameters.
          </p>
        </Card>
      )}

    </div>
  );
};

export default DashboardActivityTab;
