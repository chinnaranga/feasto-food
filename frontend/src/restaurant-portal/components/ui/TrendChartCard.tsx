import React from 'react';
import Card from './Card';

interface TrendChartCardProps {
  title: string;
  type?: 'line' | 'bar';
  data: number[];
  labels: string[];
  yAxisLabel?: string;
  loading?: boolean;
}

export const TrendChartCard: React.FC<TrendChartCardProps> = ({
  title,
  type = 'line',
  data,
  labels,
  yAxisLabel,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card className="text-left animate-pulse flex flex-col gap-4 min-h-[220px]">
        <div className="h-3 w-32 bg-neutral-100 rounded-full" />
        <div className="flex-1 bg-neutral-50/50 rounded-xl" />
      </Card>
    );
  }

  const maxVal = Math.max(...data, 1);
  const minVal = Math.min(...data, 0);
  const range = maxVal - minVal;

  const width = 500;
  const height = 140;
  const padding = 20;

  // Chart boundaries
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Calculate coordinates
  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * chartWidth;
    // Invert y axis for SVG coordinates
    const y = padding + chartHeight - ((val - minVal) / range) * chartHeight;
    return { x, y };
  });

  const renderChart = () => {
    if (type === 'line') {
      const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
      const fillD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${(height - padding).toFixed(1)} L ${points[0].x.toFixed(1)} ${(height - padding).toFixed(1)} Z`;

      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e35205" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#e35205" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f5f5f5" strokeWidth={1} />
          <line x1={padding} y1={padding + chartHeight / 2} x2={width - padding} y2={padding + chartHeight / 2} stroke="#f5f5f5" strokeWidth={1} />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#ebebeb" strokeWidth={1} />

          {/* Area fill */}
          <path d={fillD} fill="url(#chartGradient)" />

          {/* Trend line */}
          <path d={pathD} fill="none" stroke="#e35205" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

          {/* Data point dots */}
          {points.map((p, idx) => (
            <g key={idx} className="group/dot cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r={4}
                className="fill-[#e35205] stroke-white stroke-2 transition-all duration-150 group-hover/dot:r-5 group-hover/dot:stroke-neutral-800"
              />
              {/* Tooltip trigger */}
              <title>{`${labels[idx]}: ${yAxisLabel || ''}${data[idx]}`}</title>
            </g>
          ))}
        </svg>
      );
    }

    // Bar chart rendering
    const barWidth = Math.max(4, (chartWidth / data.length) * 0.6);
    const gap = (chartWidth - barWidth * data.length) / (data.length - 1 || 1);

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f5f5f5" strokeWidth={1} />
        <line x1={padding} y1={padding + chartHeight / 2} x2={width - padding} y2={padding + chartHeight / 2} stroke="#f5f5f5" strokeWidth={1} />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#ebebeb" strokeWidth={1} />

        {data.map((val, idx) => {
          const barHeight = ((val - minVal) / range) * chartHeight;
          const x = padding + idx * (barWidth + gap);
          const y = padding + chartHeight - barHeight;

          return (
            <g key={idx} className="group/bar cursor-pointer">
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, 2)}
                rx={Math.min(barWidth / 2, 4)}
                className="fill-neutral-200 hover:fill-[#e35205] transition-colors duration-150"
              />
              <title>{`${labels[idx]}: ${data[idx]} orders`}</title>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <Card className="text-left select-none flex flex-col gap-4 h-full min-h-[220px]">
      <div>
        <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">{title}</h4>
      </div>

      {/* Chart wrapper */}
      <div className="flex-1 w-full relative">{renderChart()}</div>

      {/* Footer labels */}
      <div className="flex justify-between items-center px-5 border-t border-neutral-100/60 pt-3 text-[9px] font-bold text-neutral-400 uppercase tracking-widest shrink-0">
        <span>{labels[0]}</span>
        <span>{labels[labels.length - 1]}</span>
      </div>
    </Card>
  );
};

export default TrendChartCard;
