import React, { useState } from 'react';
import { Copy, Check, FileText, Download } from 'lucide-react';
import { useSupportContextSnapshot } from '../../hooks/observability/useSupportContextSnapshot';

export const SupportContextPanel: React.FC = () => {
  const { isCopied, getSnapshot, copyToClipboard } = useSupportContextSnapshot();
  const [showPreview, setShowPreview] = useState(false);

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(getSnapshot());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `feasto-diagnostic-snapshot-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-primary-bg border border-border-main rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-border-main bg-secondary-bg flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FileText size={15} className="text-brand-orange" />
          <h3 className="text-sm font-bold text-text-primary">Diagnostic Support Snapshot</h3>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="text-xs font-semibold text-brand-orange hover:text-[#c94804] cursor-pointer"
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
      </div>

      <div className="p-5 flex flex-col gap-4">
        <p className="text-xs text-text-secondary leading-relaxed">
          Sharing anonymized client diagnostic information helps support agents diagnose cart errors, device network blocks, or localization bugs much faster.
        </p>

        {showPreview && (
          <div className="relative">
            <pre className="text-[10px] font-mono text-text-secondary p-4 bg-secondary-bg rounded-xl border border-border-main overflow-x-auto max-h-48 scrollbar-thin">
              {getSnapshot()}
            </pre>
            <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-bold uppercase text-emerald-500">
              PII Redacted
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={copyToClipboard}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-orange hover:bg-[#c94804] text-white text-xs font-bold rounded-xl transition-main cursor-pointer"
          >
            {isCopied ? <Check size={14} /> : <Copy size={14} />}
            {isCopied ? 'Copied to Clipboard' : 'Copy Support Snapshot'}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-surface-bg hover:bg-secondary-bg border border-border-main text-text-secondary text-xs font-semibold rounded-xl transition-main cursor-pointer"
          >
            <Download size={14} />
            Download JSON
          </button>
        </div>
      </div>
    </div>
  );
};
export default SupportContextPanel;
