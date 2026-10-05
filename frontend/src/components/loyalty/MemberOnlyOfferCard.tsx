import React from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { useMembershipPlan } from '@/hooks/loyalty/useMembershipPlan';
import { Button } from '@/components/ui/Button';
import { useToastStore } from '@/store/toastStore';

interface MemberOnlyOfferCardProps {
  offer: {
    id: string;
    title: string;
    description: string;
    discountCode: string;
    minTierRequired: 'plus' | 'elite';
  };
}

export const MemberOnlyOfferCard: React.FC<MemberOnlyOfferCardProps> = ({ offer }) => {
  const { tier } = useMembershipPlan();
  const { addToast } = useToastStore();

  const hasAccess =
    tier === 'elite' ||
    (tier === 'plus' && offer.minTierRequired === 'plus');

  const handleClaim = () => {
    if (!hasAccess) return;
    navigator.clipboard.writeText(offer.discountCode);
    addToast({
      message: `Discount code ${offer.discountCode} copied to clipboard!`,
      type: 'success',
    });
  };

  return (
    <div
      className={`p-5 border rounded-2xl flex flex-col justify-between text-left relative bg-white transition-main
        ${hasAccess
          ? 'border-brand-orange/30 hover:border-brand-orange/50 shadow-xs'
          : 'border-border-main/50 bg-secondary-bg/20'
        }`}
    >
      {!hasAccess && (
        <div className="absolute top-3 right-3 flex items-center gap-1 text-[8px] font-black text-text-muted bg-border-main px-1.5 py-0.5 rounded uppercase">
          <Lock size={8} />
          <span>Locked</span>
        </div>
      )}

      {hasAccess && (
        <span className="absolute top-3 right-3 flex items-center gap-1 text-[8px] font-black text-brand-orange bg-brand-orange/5 border border-brand-orange/15 px-1.5 py-0.5 rounded uppercase">
          <Sparkles size={8} />
          <span>Special Offer</span>
        </span>
      )}

      <div>
        <h4 className="text-xs font-black text-text-primary uppercase tracking-wider pr-14 mb-1">
          {offer.title}
        </h4>
        <p className="text-[10px] text-text-secondary leading-relaxed mb-4">
          {offer.description}
        </p>
      </div>

      <div className="pt-3 border-t border-border-main/50 flex justify-between items-center gap-4">
        <div>
          <span className="text-[8px] font-bold text-text-muted uppercase tracking-wider block">Min tier required</span>
          <span className="text-[10px] font-black text-text-primary uppercase">Feasto {offer.minTierRequired}</span>
        </div>
        <Button
          variant={hasAccess ? 'primary' : 'outline'}
          onClick={handleClaim}
          disabled={!hasAccess}
          className="rounded-lg text-[9px] font-extrabold px-3 py-1.5 uppercase"
        >
          {hasAccess ? 'Copy Code' : 'Upgrade to Unlock'}
        </Button>
      </div>
    </div>
  );
};
