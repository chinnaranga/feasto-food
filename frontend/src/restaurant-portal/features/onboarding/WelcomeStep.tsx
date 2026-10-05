import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Utensils, Users, Settings, ClipboardList } from 'lucide-react';
import { usePortalOnboardingStore } from '../../store/portalOnboardingStore';
import Button from '../../components/ui/Button';

export const WelcomeStep: React.FC = () => {
  const navigate = useNavigate();
  const { setStepIndex } = usePortalOnboardingStore();

  const handleStart = () => {
    setStepIndex(1);
    navigate('/restaurant-portal/onboarding/workspace');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="space-y-2">
        <h2 className="text-xl font-black text-neutral-900 tracking-tight leading-tight">
          Welcome to Feasto Merchant Services
        </h2>
        <p className="text-xs text-neutral-500 leading-relaxed">
          Set up your restaurant brand workspace in a few simple steps. You will configure tax profiles, invitations, operational hours, and customize catalog views.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">
        
        <div className="flex gap-3 items-start p-4 border border-neutral-100 bg-neutral-50/30 rounded-xl">
          <Utensils size={16} className="text-[#e35205] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-neutral-800">Customize catalog brand</h4>
            <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">Upload logo markers, background banners, and define cuisine category options.</p>
          </div>
        </div>

        <div className="flex gap-3 items-start p-4 border border-neutral-100 bg-neutral-50/30 rounded-xl">
          <Settings size={16} className="text-blue-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-neutral-800">Operational settings</h4>
            <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">Toggle delivery, pick-up, takeaway, order prep limits, and default kitchen schedules.</p>
          </div>
        </div>

        <div className="flex gap-3 items-start p-4 border border-neutral-100 bg-neutral-50/30 rounded-xl">
          <Users size={16} className="text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-neutral-800">Invite team members</h4>
            <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">Distribute invite keys to kitchen managers, cashiers, managers, and finance staff.</p>
          </div>
        </div>

        <div className="flex gap-3 items-start p-4 border border-neutral-100 bg-neutral-50/30 rounded-xl">
          <ClipboardList size={16} className="text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-neutral-800">Legal verification</h4>
            <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">Enter billing addresses, official business identification numbers, and tax registry codes.</p>
          </div>
        </div>

      </div>

      <div className="flex justify-between items-center border-t border-neutral-100 pt-6 mt-4">
        <span className="text-[10px] text-neutral-400 font-medium">You can save your draft and resume this setup at any time.</span>
        <Button
          onClick={handleStart}
          variant="primary"
          className="flex items-center gap-1.5"
        >
          Start Setup
          <ArrowRight size={11} />
        </Button>
      </div>
    </div>
  );
};
export default WelcomeStep;
