import React from 'react';
import { Eye } from 'lucide-react';

interface AccessibilityNoteProps {
  notes: string[];
}

export const AccessibilityNote: React.FC<AccessibilityNoteProps> = ({ notes }) => {
  if (!notes || notes.length === 0) return null;

  return (
    <div className="bg-emerald-500/[0.03] border border-emerald-500/20 rounded-2xl p-5 flex gap-4 text-left my-6">
      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
        <Eye size={18} className="text-emerald-500 animate-pulse" />
      </div>

      <div>
        <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-2">
          Accessibility (A11y) Guidance
        </h4>
        <ul className="flex flex-col gap-1.5 list-disc pl-4">
          {notes.map((note, i) => (
            <li key={i} className="text-xs text-text-secondary leading-relaxed">
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default AccessibilityNote;
