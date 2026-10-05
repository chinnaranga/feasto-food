import React from 'react';
import { ComponentProp } from '../../types/docs';

interface PropTableProps {
  props: ComponentProp[];
}

export const PropTable: React.FC<PropTableProps> = ({ props }) => {
  if (!props || props.length === 0) return null;

  return (
    <div className="my-6 border border-border-main rounded-2xl overflow-hidden shadow-sm bg-primary-bg">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-secondary-bg border-b border-border-main">
              <th className="px-5 py-3 font-bold text-text-primary w-1/4">Property</th>
              <th className="px-5 py-3 font-bold text-text-primary w-1/4">Type</th>
              <th className="px-5 py-3 font-bold text-text-primary w-1/6">Default</th>
              <th className="px-5 py-3 font-bold text-text-primary w-1/3">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-main/50">
            {props.map((prop, i) => (
              <tr key={i} className="hover:bg-surface-bg/30 transition-main">
                <td className="px-5 py-3 font-mono font-bold text-brand-orange">{prop.name}</td>
                <td className="px-5 py-3 font-mono text-text-secondary">{prop.type}</td>
                <td className="px-5 py-3 font-mono text-text-muted">{prop.defaultValue || '—'}</td>
                <td className="px-5 py-3 text-text-secondary leading-relaxed">{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default PropTable;
