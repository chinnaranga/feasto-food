import React from 'react';
import { DesignToken } from '../../types/docs';

interface TokenTableProps {
  tokens: DesignToken[];
}

export const TokenTable: React.FC<TokenTableProps> = ({ tokens }) => {
  if (!tokens || tokens.length === 0) return null;

  const renderPreview = (token: DesignToken) => {
    if (token.previewType === 'color') {
      return (
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-md border border-border-main shrink-0"
            style={{ backgroundColor: token.value }}
          />
          <span className="font-mono text-[10px] text-text-muted">{token.value}</span>
        </div>
      );
    }

    if (token.previewType === 'spacing') {
      return (
        <div className="flex items-center gap-2">
          <div
            className="h-2 bg-brand-orange/40 rounded-sm shrink-0"
            style={{ width: token.value.includes('4px') ? '4px' : token.value.includes('8px') ? '8px' : token.value.includes('16px') ? '16px' : '24px' }}
          />
          <span className="font-mono text-[10px] text-text-muted">{token.value}</span>
        </div>
      );
    }

    if (token.previewType === 'radius') {
      return (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 border-2 border-dashed border-text-muted shrink-0"
            style={{ borderRadius: token.value.split(' ')[0] }}
          />
          <span className="font-mono text-[10px] text-text-muted">{token.value}</span>
        </div>
      );
    }

    return <span className="font-mono text-[10px] text-text-muted">{token.value}</span>;
  };

  return (
    <div className="my-6 border border-border-main rounded-2xl overflow-hidden shadow-sm bg-primary-bg">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-secondary-bg border-b border-border-main">
              <th className="px-5 py-3 font-bold text-text-primary w-2/5">Variable Name</th>
              <th className="px-5 py-3 font-bold text-text-primary w-1/4">Preview / Value</th>
              <th className="px-5 py-3 font-bold text-text-primary w-1/3">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-main/50">
            {tokens.map((token, i) => (
              <tr key={i} className="hover:bg-surface-bg/30 transition-main">
                <td className="px-5 py-3 font-mono font-bold text-brand-orange">{token.name}</td>
                <td className="px-5 py-3">{renderPreview(token)}</td>
                <td className="px-5 py-3 text-text-secondary leading-relaxed">{token.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TokenTable;
