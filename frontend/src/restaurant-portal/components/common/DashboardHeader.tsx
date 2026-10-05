import React from 'react';
import { Download, RefreshCw, Radio } from 'lucide-react';
import usePortalStore from '../../store/portalStore';
import usePortalAuthStore from '../../store/portalAuthStore';
import usePortalDashboardStore from '../../store/portalDashboardStore';

export const DashboardHeader: React.FC = () => {
  const { selectedRestaurant } = usePortalStore();
  const { user } = usePortalAuthStore();
  const { rangeFilter, setRangeFilter, addActivity } = usePortalDashboardStore();

  const handleExport = () => {
    // Record audit event
    addActivity({
      user: user?.displayName || 'Merchant',
      role: user?.role || 'Owner',
      action: `Exported business summary report for range filter "${rangeFilter}".`,
    });
    
    // Simulate file download
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      restaurant: selectedRestaurant,
      exportedAt: new Date().toISOString(),
      filter: rangeFilter
    }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href",     dataStr);
    downloadAnchor.setAttribute("download", `feasto_report_${rangeFilter}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-5 select-none text-left">
      {/* Greeter metadata */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <h2 className="text-xl font-black tracking-tight text-neutral-800 font-heading">
            {getGreeting()}, {user?.displayName || 'Merchant'}
          </h2>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-bold border border-emerald-100 animate-pulse">
            <Radio size={9} />
            <span>Terminal Sync Live</span>
          </div>
        </div>
        <p className="text-xs text-neutral-400">
          Operational telemetry and performance analytics dashboard for{' '}
          <span className="font-bold text-neutral-700">{selectedRestaurant?.name || 'your store'}</span>.
        </p>
      </div>

      {/* Control panel buttons */}
      <div className="flex items-center gap-2 self-start md:self-center">
        {/* Time Segmented Filter */}
        <div className="bg-neutral-100 p-0.5 rounded-xl flex items-center border border-neutral-200/40">
          {(['today', 'yesterday', 'week'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setRangeFilter(range)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                rangeFilter === range
                  ? 'bg-white text-neutral-800 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Sync Indicator */}
        <button
          type="button"
          onClick={() => {
            addActivity({
              user: user?.displayName || 'Merchant',
              role: user?.role || 'Owner',
              action: 'Manually refreshed workspace telemetry signals.',
            });
          }}
          className="p-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer"
          title="Force telemetry refresh"
        >
          <RefreshCw size={13} className="hover:rotate-180 transition-transform duration-300" />
        </button>

        {/* Export trigger */}
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#e35205] hover:bg-[#c94804] text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Download size={11} />
          <span>Export Summary</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
