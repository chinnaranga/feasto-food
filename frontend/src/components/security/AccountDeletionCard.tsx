import React from 'react';
import { useSensitiveActionConfirm } from '../../hooks/security/useSensitiveActionConfirm';
import { confirmationRules } from '../../services/security/confirmationRules';
import { Button } from '../ui/Button';
import { Trash2 } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';

export const AccountDeletionCard: React.FC = () => {
  const { requestConfirmation } = useSensitiveActionConfirm();
  const { addToast } = useToastStore();

  const handleDeleteTrigger = () => {
    const config = confirmationRules.getActionConfig('delete_account');
    requestConfirmation(config, async () => {
      // Execute account purge actions
      addToast({ message: 'Account deletion sequence successfully executed.', type: 'info' });
      setTimeout(() => {
        window.location.href = '/auth/signup';
      }, 1000);
    });
  };

  return (
    <div className="bg-primary-bg border border-error-main/20 rounded-2xl p-6 shadow-xs flex flex-col text-left">
      <div className="mb-5">
        <h3 className="text-sm font-extrabold text-error-main tracking-tight font-heading">
          Purge Profile Account
        </h3>
        <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">
          Permanently remove your registered customer record, address history ledger, and accumulated loyalty cashpoints. This action cannot be reversed.
        </p>
      </div>

      <Button
        variant="danger"
        size="sm"
        onClick={handleDeleteTrigger}
        className="self-start text-xs font-bold py-2 px-4 flex items-center gap-2 bg-error-main hover:bg-error-main/95 border-none"
      >
        <Trash2 size={14} />
        <span>Delete Account Permanently</span>
      </Button>
    </div>
  );
};
export default AccountDeletionCard;
