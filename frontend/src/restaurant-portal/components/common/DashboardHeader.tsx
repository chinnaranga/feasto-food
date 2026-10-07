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
    downloadAnchor.setAttribute("href", dataStr);
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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#141518]/15 pb-5 select-none text-left">
      {/* Greeter metadata */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[10px] font-bold text-[#1B3BFF] uppercase tracking-widest">
            [01 // TELEMETRY HUB]
          </span>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#D7F04A] text-[#141518] border border-[#141518] text-[9px] font-mono font-bold uppercase">
            <Radio size={9} />
            <span>SYNC LIVE</span>
          </div>
        </div>
        <h2 className="font-heading font-black text-2xl uppercase tracking-tight text-[#141518]">
          {getGreeting()}, {user?.displayName || 'Merchant'}
        </h2>
        <p className="font-mono text-xs text-[#52555F] mt-0.5">
          Operational control and throughput telemetry for{' '}
          <span className="font-bold text-[#141518]">{selectedRestaurant?.name || 'STUDIO ALPHA'}</span>.
        </p>
      </div>

      {/* Control panel buttons */}
      <div className="flex items-center gap-2 self-start md:self-center font-mono">
        {/* Time Segmented Filter */}
        <div className="bg-[#FAF8F5] p-0.5 flex items-center border border-[#141518]/20">
          {(['today', 'yesterday', 'week'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setRangeFilter(range)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                rangeFilter === range
                  ? 'bg-[#141518] text-[#D7F04A]'
                  : 'text-[#52555F] hover:text-[#141518]'
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
          className="p-2 border border-[#141518]/20 bg-[#FAF8F5] hover:bg-[#141518] text-[#141518] hover:text-[#FAF8F5] transition-colors cursor-pointer"
          title="Force telemetry refresh"
        >
          <RefreshCw size={13} className="hover:rotate-180 transition-transform duration-300" />
        </button>

        {/* Export trigger */}
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#141518] hover:bg-[#D7F04A] text-[#FAF8F5] hover:text-[#141518] border border-[#141518] text-[10px] font-bold uppercase tracking-wider shadow-[2px_2px_0px_#141518] transition-colors cursor-pointer"
        >
          <Download size={11} />
          <span>Export Summary</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
