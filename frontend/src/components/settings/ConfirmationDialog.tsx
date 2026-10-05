import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
}) => {
  const footerContent = (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        onClick={onClose}
        disabled={isLoading}
        className="rounded-xl text-xs font-bold px-5 py-2.5 border border-border-main"
      >
        {cancelLabel}
      </Button>
      <Button
        variant={isDestructive ? 'primary' : 'primary'}
        onClick={onConfirm}
        disabled={isLoading}
        className={`rounded-xl text-xs font-bold px-6 py-2.5 flex items-center gap-2 min-w-[100px] justify-center
          ${isDestructive ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
      >
        {isLoading ? (
          <>
            <Loader2 size={13} className="animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <span>{confirmLabel}</span>
        )}
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footerContent} size="sm">
      <div className="flex gap-4 items-start text-left pt-2">
        {isDestructive && (
          <div className="p-2.5 bg-red-50 text-red-600 rounded-xl shrink-0">
            <AlertTriangle size={20} />
          </div>
        )}
        <div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {message}
          </p>
          {isDestructive && (
            <p className="text-xs text-red-500 font-bold mt-3 border border-red-100 bg-red-50/50 p-2.5 rounded-lg">
              Warning: This action is irreversible. All associated data will be deleted immediately.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};
