import React from 'react';
import { Check } from 'lucide-react';
import { useMembershipPlan } from '@/hooks/loyalty/useMembershipPlan';
import { Button } from '@/components/ui/Button';
import { MEMBERSHIP_PRICING, TIER_PERKS } from '@/constants/loyalty';
import { MembershipTier } from '@/types/loyalty';
import { useToastStore } from '@/store/toastStore';
import { useTrackEvent } from '@/hooks/analytics/useTrackEvent';

export const MembershipTierCompare: React.FC = () => {
  const { tier, upgradePlan } = useMembershipPlan();
  const { addToast } = useToastStore();
  const trackEvent = useTrackEvent();

  const handleSelectTier = (selectedTier: MembershipTier) => {
    if (selectedTier === tier) return;
    upgradePlan(selectedTier);
    trackEvent('settings_updated', {
      section: 'privacy',
      settingKey: 'membership_tier',
      newValue: selectedTier,
    });
    addToast({
      message: `Successfully switched to ${MEMBERSHIP_PRICING[selectedTier].name}!`,
      type: 'success',
    });
  };

  const tiers: MembershipTier[] = ['free', 'plus', 'elite'];

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="pb-3 border-b border-border-main/50">
        <h3 className="text-sm font-extrabold text-text-primary uppercase tracking-wider">Compare Tiers</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((t) => {
          const isCurrent = t === tier;
          const pricing = MEMBERSHIP_PRICING[t];
          const perks = TIER_PERKS[t];

          return (
            <div
              key={t}
              className={`p-6 border rounded-3xl flex flex-col justify-between transition-main relative bg-white
                ${isCurrent
                  ? 'border-brand-orange shadow-soft ring-1 ring-brand-orange/30'
                  : 'border-border-main hover:border-text-secondary/30'
                }`}
            >
              {isCurrent && (
                <span className="absolute -top-2.5 right-6 text-[8px] font-black text-white bg-brand-orange px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Active
                </span>
              )}
              <div>
                <h4 className="text-xs font-black text-text-primary uppercase tracking-wider mb-1">{pricing.name}</h4>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-xl font-black text-text-primary">₹{pricing.price}</span>
                  <span className="text-[10px] text-text-secondary font-medium">{pricing.billing}</span>
                </div>

                <ul className="flex flex-col gap-2.5 mb-6">
                  {perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs leading-normal text-text-secondary font-medium">
                      <Check size={12} className="text-brand-orange shrink-0 mt-0.5 font-bold" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant={isCurrent ? 'outline' : t === 'elite' ? 'primary' : 'secondary'}
                disabled={isCurrent}
                onClick={() => handleSelectTier(t)}
                className="w-full justify-center rounded-xl text-xs font-bold py-2.5"
              >
                {isCurrent ? 'Current Plan' : `Select ${pricing.name}`}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
