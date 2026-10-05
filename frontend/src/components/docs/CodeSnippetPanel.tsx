import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeSnippetPanelProps {
  code: string;
}

export const CodeSnippetPanel: React.FC<CodeSnippetPanelProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // Silently swallow clip failure
    }
  };

  return (
    <div className="relative group border border-border-main rounded-xl overflow-hidden bg-secondary-bg my-4">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-main bg-primary-bg/50">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono">
          JSX Usage Example
        </span>
        <button
          onClick={handleCopy}
          className="p-1 rounded-lg hover:bg-surface-bg text-text-muted hover:text-text-primary transition-main cursor-pointer"
          aria-label="Copy code block"
        >
          {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
        </button>
      </div>

      <pre className="text-xs font-mono text-text-secondary p-4 overflow-x-auto scrollbar-thin text-left">
        <code>{code}</code>
      </pre>
    </div>
  );
};
export default CodeSnippetPanel;
