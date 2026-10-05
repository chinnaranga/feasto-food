import React from 'react';
import { Globe, CheckCircle2 } from 'lucide-react';

export const BrowserMatrix: React.FC = () => {
  const browserList = [
    { name: 'Google Chrome', version: 'v120.0+', status: 'pass', engine: 'Blink' },
    { name: 'Apple Safari', version: 'v17.2+', status: 'pass', engine: 'WebKit' },
    { name: 'Mozilla Firefox', version: 'v121.0+', status: 'pass', engine: 'Gecko' },
    { name: 'Microsoft Edge', version: 'v120.0+', status: 'pass', engine: 'Blink' },
    { name: 'iOS Safari (Mobile)', version: 'iOS 17.2+', status: 'pass', engine: 'WebKit' },
    { name: 'Android Chrome (Mobile)', version: 'v120.0+', status: 'pass', engine: 'Blink' },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● Cross-Browser Engine Compatibility
            </span>
            <span className="text-xs text-neutral-400 font-bold">WebKit, Blink & Gecko</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Cross-Browser Compatibility & Engine Matrix
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Verify layout rendering, CSS Grid support, flexbox alignment, and JavaScript feature execution across modern desktop and mobile browsers.
          </p>
        </div>
      </div>

      {/* Browser List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {browserList.map((b) => (
          <div key={b.name} className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-neutral-900 font-heading">{b.name}</span>
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {b.status}
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-mono">Version: {b.version} ({b.engine})</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowserMatrix;
