import React from 'react';
import { Sparkles } from 'lucide-react';

export const TimeAnalytics: React.FC = () => {
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const SLOTS = ['Morning (08-12)', 'Noon (12-16)', 'Afternoon (16-19)', 'Evening (19-22)', 'Night (22-24)'];

  // Heatmap values representing sales volume density (0-9 color scale)
  // Rows: Mon, Tue, Wed, Thu, Fri, Sat, Sun
  // Columns: Morning, Noon, Afternoon, Evening, Night
  const HEATMAP_DATA = [
    [2, 5, 2, 6, 3], // Mon
    [1, 4, 3, 5, 2], // Tue
    [2, 5, 2, 6, 2], // Wed
    [3, 6, 3, 7, 4], // Thu
    [4, 7, 4, 8, 6], // Fri
    [5, 8, 5, 9, 8], // Sat (Busiest slots!)
    [5, 8, 4, 9, 7], // Sun
  ];

  const getColorClass = (value: number) => {
    if (value <= 2) return 'fill-orange-50 stroke-neutral-200/50';
    if (value <= 4) return 'fill-orange-100 stroke-neutral-200/50';
    if (value <= 6) return 'fill-orange-300 stroke-neutral-200/50';
    if (value <= 8) return 'fill-orange-500 stroke-neutral-200/50';
    return 'fill-[#e35205] stroke-neutral-200/50'; // Peak rush
  };

  return (
    <div className="space-y-6 text-left select-none">

      {/* Title */}
      <div className="border-b border-neutral-100 pb-3">
        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-heading">Rush Hour Load Heatmap</h4>
        <p className="text-xs text-neutral-400 mt-0.5">Hour of day vs day of week traffic density matrix.</p>
      </div>

      {/* SVG Heatmap visualizer */}
      <div className="w-full overflow-x-auto bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col items-center">
        <div className="min-w-[500px] w-full max-w-2xl">
          <svg className="w-full h-auto" viewBox="0 0 600 280">
            {/* Header X labels */}
            {SLOTS.map((slot, i) => (
              <text
                key={slot}
                x={100 + i * 95 + 40}
                y="20"
                className="text-[9px] font-black text-neutral-400 uppercase tracking-wider text-center"
                textAnchor="middle"
              >
                {slot.split(' ')[0]}
              </text>
            ))}

            {/* Y labels and Grid squares */}
            {DAYS.map((day, rowIdx) => {
              const yVal = 40 + rowIdx * 30;
              return (
                <g key={day}>
                  {/* Day Label */}
                  <text
                    x="40"
                    y={yVal + 18}
                    className="text-[10px] font-black text-neutral-500 uppercase tracking-wider"
                    textAnchor="end"
                  >
                    {day}
                  </text>

                  {/* Squares */}
                  {HEATMAP_DATA[rowIdx].map((val, colIdx) => {
                    const xVal = 100 + colIdx * 95;
                    return (
                      <rect
                        key={colIdx}
                        x={xVal}
                        y={yVal}
                        width="85"
                        height="24"
                        rx="6"
                        className={`transition-all duration-300 ${getColorClass(val)}`}
                      >
                        <title>{`Density rating: ${val}`}</title>
                      </rect>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 border-t border-neutral-100 pt-4 w-full mt-3 justify-center text-[10px] font-semibold text-neutral-500">
          <span>Low Traffic</span>
          <div className="flex gap-1 select-none">
            <span className="w-4 h-4 rounded bg-orange-50 border border-neutral-200/30" />
            <span className="w-4 h-4 rounded bg-orange-100 border border-neutral-200/30" />
            <span className="w-4 h-4 rounded bg-orange-300 border border-neutral-200/30" />
            <span className="w-4 h-4 rounded bg-orange-500 border border-neutral-200/30" />
            <span className="w-4 h-4 rounded bg-[#e35205]" />
          </div>
          <span>Peak Rush</span>
        </div>
      </div>

      {/* AI suggestions */}
      <div className="p-3.5 bg-neutral-50 border border-neutral-200/50 rounded-xl flex items-start gap-2.5">
        <Sparkles size={13} className="text-[#e35205] shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest font-heading">AI Rush Hour Prediction</p>
          <p className="text-[9px] text-neutral-400 mt-0.5 leading-relaxed">
            Saturday evening (19:00 - 22:00) represents the highest traffic slot (rating 9/9). Running a 10% auto-discount campaign during low activity Wednesday afternoons can balance shift utilization.
          </p>
        </div>
      </div>

    </div>
  );
};

export default TimeAnalytics;
