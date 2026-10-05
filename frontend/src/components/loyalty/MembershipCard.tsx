import React from 'react';
import { ShieldCheck, Sparkles, Award } from 'lucide-react';
import { useMembershipPlan } from '@/hooks/loyalty/useMembershipPlan';

export const MembershipCard: React.FC = () => {
  const { tier, renewalDate, planDetails, perks } = useMembershipPlan();

  const getTierDetails = () => {
    switch (tier) {
      case 'elite':
        return {
          icon: <Award size={20} className="text-amber-500 animate-pulse" />,
          colorClass: 'from-amber-50 to-amber-100/50 border-amber-200 text-amber-900',
          badgeText: 'Elite VIP',
        };
      case 'plus':
        return {
          icon: <Sparkles size={20} className="text-brand-orange animate-pulse" />,
          colorClass: 'from-brand-orange/[0.03] to-brand-orange/[0.08] border-brand-orange/20 text-brand-orange',
          badgeText: 'Plus Member',
        };
      default:
        return {
          icon: <ShieldCheck size={20} className="text-text-muted" />,
          colorClass: 'bg-secondary-bg border-border-main text-text-primary',
          badgeText: 'Basic',
        };
    }
  };

  const ui = getTierDetails();

  return (
    <div className={`p-6 border rounded-3xl bg-gradient-to-r ${ui.colorClass} shadow-xs text-left flex flex-col justify-between w-full`}>
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            {ui.icon}
            <h3 className="text-base font-black tracking-tight">{planDetails.name}</h3>
          </div>
          <span className="text-[9px] font-black uppercase tracking-wider bg-white/80 border border-current px-2.5 py-0.5 rounded-full">
            {ui.badgeText}
          </span>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed mb-4">
          Status: {tier === 'free' ? 'Unlock unlimited free delivery and 1.5x rewards by upgrading to Plus.' : 'Auto-renews on ' + renewalDate + '.'}
        </p>

        <div className="flex flex-col gap-2 mb-4">
          <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted">Included perks</h4>
          <ul className="flex flex-col gap-1.5">
            {perks.slice(0, 3).map((perk, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-text-secondary font-medium">
                <span className="text-emerald-500 font-extrabold shrink-0">✓</span>
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-4 border-t border-current/10 flex justify-between items-center">
        <div>
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Price</span>
          <span className="text-base font-black text-text-primary">
            ₹{planDetails.price} <span className="text-xs font-normal text-text-secondary">{planDetails.billing}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
