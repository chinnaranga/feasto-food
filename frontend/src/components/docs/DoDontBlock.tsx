import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface DoDontBlockProps {
  doList: string[];
  dontList: string[];
}

export const DoDontBlock: React.FC<DoDontBlockProps> = ({ doList, dontList }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      {/* Do Card */}
      <div className="bg-emerald-500/[0.02] border border-emerald-500/15 rounded-2xl p-5 text-left">
        <div className="flex items-center gap-2 mb-3.5">
          <CheckCircle size={16} className="text-emerald-500 shrink-0" />
          <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Do</h4>
        </div>
        <ul className="flex flex-col gap-2 list-none pl-0">
          {doList.map((item, i) => (
            <li key={i} className="text-xs text-text-secondary leading-relaxed flex items-start gap-2">
              <span className="text-emerald-500 font-bold mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Don't Card */}
      <div className="bg-red-500/[0.02] border border-red-500/15 rounded-2xl p-5 text-left">
        <div className="flex items-center gap-2 mb-3.5">
          <XCircle size={16} className="text-red-500 shrink-0" />
          <h4 className="text-xs font-bold text-red-500 uppercase tracking-wide">Don't</h4>
        </div>
        <ul className="flex flex-col gap-2 list-none pl-0">
          {dontList.map((item, i) => (
            <li key={i} className="text-xs text-text-secondary leading-relaxed flex items-start gap-2">
              <span className="text-red-500 font-bold mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default DoDontBlock;
