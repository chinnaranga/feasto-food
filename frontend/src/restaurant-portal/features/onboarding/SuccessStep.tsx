import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import { usePortalOnboardingStore } from '../../store/portalOnboardingStore';

export const SuccessStep: React.FC = () => {
  const navigate = useNavigate();
  const { resetOnboarding } = usePortalOnboardingStore();

  const handleFinish = () => {
    resetOnboarding();
    navigate('/restaurant-portal/dashboard');
  };

  return (
    <div className="flex flex-col items-center text-center py-6 select-none max-w-sm mx-auto">
      <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-500 mb-5 shrink-0 animate-bounce">
        <CheckCircle2 size={28} />
      </div>

      <h2 className="text-xl font-black text-neutral-900 tracking-tight mb-2">
        Workspace Ready!
      </h2>
      <p className="text-xs text-neutral-500 leading-relaxed mb-8">
        Your merchant group has been initialized successfully. The dashboard operations desk is now open. You can begin adding menus, settings, and staff credentials.
      </p>

      <Button
        onClick={handleFinish}
        variant="primary"
        className="w-full flex items-center justify-center gap-1.5"
      >
        Go to Dashboard
        <ArrowRight size={11} />
      </Button>
    </div>
  );
};
export default SuccessStep;
