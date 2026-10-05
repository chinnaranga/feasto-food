import React from 'react';
import { Smartphone, Monitor, CheckCircle2 } from 'lucide-react';
import usePortalQualityStore from '../../store/portal/portalQualityStore';

export const ResponsivenessMatrix: React.FC = () => {
  const { deviceMatrix } = usePortalQualityStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● Multi-Viewport Responsive Matrix
            </span>
            <span className="text-xs text-neutral-400 font-bold">Mobile, Tablet & Desktop</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Cross-Viewport Responsiveness & Layout Matrix
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Validate sidebar drawer collapse behaviors, topbar responsive triggers, table horizontal scrolling, and fluid card grid layouts across device sizes.
          </p>
        </div>
      </div>

      {/* Device Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {deviceMatrix.map((item) => (
          <div key={item.deviceName} className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-neutral-900 font-heading">{item.deviceName}</span>
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {item.status}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-150 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400 font-bold">Viewport:</span>
                <span className="font-mono font-bold text-neutral-800">{item.screenSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 font-bold">Target Engine:</span>
                <span className="font-bold text-neutral-800">{item.browser}</span>
              </div>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">{item.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResponsivenessMatrix;
