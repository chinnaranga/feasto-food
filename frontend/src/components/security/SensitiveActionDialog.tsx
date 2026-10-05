import React, { useState, useEffect } from 'react';
import { useSensitiveActionConfirm } from '../../hooks/security/useSensitiveActionConfirm';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ShieldAlert } from 'lucide-react';

export const SensitiveActionDialog: React.FC = () => {
  const { isConfirmOpen, actionConfig, confirmAction, cancelAction } = useSensitiveActionConfirm();
  const [isChecked, setIsChecked] = useState(false);
  const [phraseInput, setPhraseInput] = useState('');

  // Reset inputs when dialog status changes
  useEffect(() => {
    if (!isConfirmOpen) {
      setIsChecked(false);
      setPhraseInput('');
    }
  }, [isConfirmOpen]);

  if (!isConfirmOpen || !actionConfig) return null;

  const requiresPhrase = !!actionConfig.verificationPhrase;
  const isPhraseMatch = !requiresPhrase || phraseInput.trim() === actionConfig.verificationPhrase;
  const canConfirm = isChecked && isPhraseMatch;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-modal flex items-center justify-center p-6 animate-fade-in select-none">
      <div className="bg-primary-bg max-w-md w-full border border-border-main p-6 rounded-3xl shadow-xl text-left">
        
        {/* Severity Header icon */}
        <div className="flex items-center gap-3 border-b border-border-main/55 pb-4 mb-4">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
            ${
              actionConfig.severity === 'high'
                ? 'bg-error-main/10 text-error-main'
                : 'bg-amber-500/10 text-amber-600'
            }`}
          >
            <ShieldAlert size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              {actionConfig.severity} Severity Verification
            </span>
            <h3 className="text-sm font-extrabold text-text-primary tracking-tight font-heading mt-0.5">
              {actionConfig.title}
            </h3>
          </div>
        </div>

        {/* Warning Copy */}
        <p className="text-xs text-text-secondary leading-relaxed mb-5">
          {actionConfig.description}
        </p>

        {/* Action checks inputs */}
        <div className="space-y-4 mb-6">
          <label className="flex items-start gap-3 p-3 border border-border-main bg-surface-bg/30 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mt-0.5 rounded border-border-main text-brand-orange focus:ring-brand-orange cursor-pointer"
            />
            <span className="text-[11px] text-text-primary leading-relaxed font-semibold">
              I understand the consequences and wish to proceed with this irreversible action.
            </span>
          </label>

          {requiresPhrase && (
            <div className="animate-fade-in text-xs">
              <p className="text-[10px] font-bold text-text-secondary mb-2 uppercase">
                Type <span className="font-extrabold text-error-main select-all">"{actionConfig.verificationPhrase}"</span> below to confirm:
              </p>
              <Input
                placeholder={`Type exact confirmation phrase`}
                value={phraseInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhraseInput(e.target.value)}
                className="text-xs font-mono"
              />
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border-main/55">
          <Button
            variant="ghost"
            size="sm"
            onClick={cancelAction}
            className="border border-border-main text-xs font-bold px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            variant={actionConfig.severity === 'high' ? 'danger' : 'primary'}
            size="sm"
            disabled={!canConfirm}
            onClick={confirmAction}
            className="text-xs font-bold px-5 py-2"
          >
            Confirm Action
          </Button>
        </div>
      </div>
    </div>
  );
};
export default SensitiveActionDialog;
