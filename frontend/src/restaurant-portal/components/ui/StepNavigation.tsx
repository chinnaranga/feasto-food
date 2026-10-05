import React from 'react';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import Button from './Button';

interface StepNavigationProps {
  onBack?: () => void;
  nextLabel?: string;
  isSubmitting?: boolean;
  onSkip?: () => void;
  onSaveDraft?: () => void;
  isDraftSaving?: boolean;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  onBack,
  nextLabel = 'Continue',
  isSubmitting = false,
  onSkip,
  onSaveDraft,
  isDraftSaving = false,
}) => {
  return (
    <div className="flex items-center justify-between border-t border-neutral-100 pt-6 mt-8 select-none">
      {/* Left controls */}
      <div className="flex items-center gap-2">
        {onBack ? (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-1.5"
            disabled={isSubmitting}
          >
            <ArrowLeft size={11} />
            Back
          </Button>
        ) : (
          <div />
        )}

        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="px-3 py-2 text-xs font-semibold text-neutral-400 hover:text-neutral-600 transition-main cursor-pointer"
            disabled={isSubmitting}
          >
            Skip for now
          </button>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {onSaveDraft && (
          <Button
            type="button"
            variant="outline"
            onClick={onSaveDraft}
            isLoading={isDraftSaving}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-700"
          >
            <Save size={11} />
            Save Draft
          </Button>
        ) as any}

        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="flex items-center gap-1.5 min-w-[90px]"
        >
          {nextLabel}
          <ArrowRight size={11} />
        </Button>
      </div>
    </div>
  );
};
export default StepNavigation;
