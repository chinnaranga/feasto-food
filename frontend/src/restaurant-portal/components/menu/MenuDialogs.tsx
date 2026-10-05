import React from 'react';
import { AlertTriangle, HelpCircle, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';

// ─── Publish Dialog ───────────────────────────────────────────────────────────
interface PublishDialogProps {
  isOpen: boolean;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PublishDialog: React.FC<PublishDialogProps> = ({
  isOpen,
  itemName,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-3xs z-[10000] flex items-center justify-center p-4 select-none">
      <div className="bg-white border border-neutral-200 rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4 text-left">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Eye size={15} />
          </div>
          <h4 className="text-sm font-bold text-neutral-800">Publish Menu Item?</h4>
        </div>
        <p className="text-xs text-neutral-500 leading-relaxed font-medium">
          Are you sure you want to publish <strong className="text-neutral-800">"{itemName}"</strong> to your live menu? Customers will be able to order this item immediately.
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-neutral-500 font-bold">
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={onConfirm} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black">
            Publish Live
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── Delete Dialog ────────────────────────────────────────────────────────────
interface DeleteDialogProps {
  isOpen: boolean;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  itemName,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-3xs z-[10000] flex items-center justify-center p-4 select-none">
      <div className="bg-white border border-neutral-200 rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4 text-left">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={15} />
          </div>
          <h4 className="text-sm font-bold text-neutral-800">Delete Menu Item?</h4>
        </div>
        <p className="text-xs text-neutral-500 leading-relaxed font-medium">
          Are you sure you want to permanently delete <strong className="text-neutral-800">"{itemName}"</strong>? This action is irreversible and will remove this item from all historical catalog categories.
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-neutral-500 font-bold">
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white font-black">
            Delete Item
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── Duplicate Dialog ─────────────────────────────────────────────────────────
interface DuplicateDialogProps {
  isOpen: boolean;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DuplicateDialog: React.FC<DuplicateDialogProps> = ({
  isOpen,
  itemName,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-3xs z-[10000] flex items-center justify-center p-4 select-none">
      <div className="bg-white border border-neutral-200 rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4 text-left">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <HelpCircle size={15} />
          </div>
          <h4 className="text-sm font-bold text-neutral-800">Duplicate Menu Item?</h4>
        </div>
        <p className="text-xs text-neutral-500 leading-relaxed font-medium">
          Create a copy of <strong className="text-neutral-800">"{itemName}"</strong>? The new item will be created in **Draft Mode** with cloned pricing, variant arrays, and descriptions.
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-neutral-500 font-bold">
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={onConfirm} className="bg-indigo-600 hover:bg-indigo-700 text-white font-black">
            Duplicate
          </Button>
        </div>
      </div>
    </div>
  );
};
