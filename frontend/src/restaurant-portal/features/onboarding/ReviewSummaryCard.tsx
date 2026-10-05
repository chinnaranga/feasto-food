import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Edit2, ShieldAlert } from 'lucide-react';
import OnboardingStepHeader from '../../components/ui/OnboardingStepHeader';
import StepNavigation from '../../components/ui/StepNavigation';
import { usePortalOnboardingStore } from '../../store/portalOnboardingStore';
import { usePortalAuthStore } from '../../store/portalAuthStore';

export const ReviewSummaryCard: React.FC = () => {
  const navigate = useNavigate();
  const { drafts, markStepComplete, setStepIndex } = usePortalOnboardingStore();
  const { loginMerchant } = usePortalAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      markStepComplete('review');
      // Simulate registering merchant login session now that onboarding completes!
      await loginMerchant(drafts.profile.email || 'onboarded@restaurant.com', 'Owner');
      setStepIndex(7);
      navigate('/restaurant-portal/onboarding/success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasServices = drafts.operations.dineIn || drafts.operations.takeaway || drafts.operations.delivery;

  return (
    <div className="text-left">
      <OnboardingStepHeader
        title="Review Workspace Setup Details"
        description="Verify all configuration details before saving. These selections will initialize your menu catalog workspace."
      />

      <form onSubmit={onSubmit} className="space-y-6">
        
        <div className="space-y-4">
          
          {/* Workspace summary block */}
          <div className="border border-neutral-100 p-4 rounded-xl space-y-3 bg-neutral-50/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#e35205] uppercase tracking-wider">
                Workspace & Regional Configs
              </span>
              <Link to="/restaurant-portal/onboarding/workspace" className="p-1 text-neutral-400 hover:text-neutral-600 transition-main">
                <Edit2 size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-y-2 text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 block">Workspace Name</span>
                <span className="font-semibold text-neutral-700">{drafts.workspace.workspaceName || 'Not configured'}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">Base Currency / Timezone</span>
                <span className="font-semibold text-neutral-700">
                  {drafts.workspace.currency} · {drafts.workspace.timezone}
                </span>
              </div>
            </div>
          </div>

          {/* Profile summary block */}
          <div className="border border-neutral-100 p-4 rounded-xl space-y-3 bg-neutral-50/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#e35205] uppercase tracking-wider">
                Brand Descriptor & Contacts
              </span>
              <Link to="/restaurant-portal/onboarding/profile" className="p-1 text-neutral-400 hover:text-neutral-600 transition-main">
                <Edit2 size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-y-2 text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 block">Cuisine type</span>
                <span className="font-semibold text-neutral-700">{drafts.profile.cuisineType || 'Not configured'}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">Description</span>
                <span className="font-semibold text-neutral-700 truncate block max-w-[200px]">{drafts.profile.description || 'Not configured'}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">Support phone / email</span>
                <span className="font-semibold text-neutral-700">
                  {drafts.profile.phone || 'N/A'} · {drafts.profile.email || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">Physical Address</span>
                <span className="font-semibold text-neutral-700 truncate block max-w-[200px]">{drafts.profile.address || 'Not configured'}</span>
              </div>
            </div>
          </div>

          {/* Business details summary block */}
          <div className="border border-neutral-100 p-4 rounded-xl space-y-3 bg-neutral-50/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#e35205] uppercase tracking-wider">
                Business & Tax Registry
              </span>
              <Link to="/restaurant-portal/onboarding/business" className="p-1 text-neutral-400 hover:text-neutral-600 transition-main">
                <Edit2 size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-y-2 text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 block">Legal Entity Name</span>
                <span className="font-semibold text-neutral-700">{drafts.business.legalName || 'Not configured'}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">VAT / Tax ID</span>
                <span className="font-semibold text-neutral-700">{drafts.business.taxId || 'Not configured'}</span>
              </div>
            </div>
          </div>

          {/* Operations summary block */}
          <div className="border border-neutral-100 p-4 rounded-xl space-y-3 bg-neutral-50/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#e35205] uppercase tracking-wider">
                Service Channels & SLAs
              </span>
              <Link to="/restaurant-portal/onboarding/operations" className="p-1 text-neutral-400 hover:text-neutral-600 transition-main">
                <Edit2 size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-y-2 text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 block">Prep Time range</span>
                <span className="font-semibold text-neutral-700">
                  {drafts.operations.prepTimeMin} - {drafts.operations.prepTimeMax} mins
                </span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">Active Channels</span>
                <span className="font-semibold text-neutral-700 flex gap-1">
                  {drafts.operations.dineIn && 'DineIn'}
                  {drafts.operations.takeaway && ' · Takeaway'}
                  {drafts.operations.delivery && ' · Delivery'}
                  {!hasServices && 'None'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Legal checkbox confirm warning overlay */}
        <div className="p-4 bg-amber-50/60 border border-amber-200/50 rounded-xl flex gap-3 text-xs leading-relaxed text-amber-800">
          <ShieldAlert size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <p>
            By completing this onboarding setup, you confirm that all provided corporate tax identifiers represent verified registration details. False registry fields will result in immediate suspension of POS checkout payouts.
          </p>
        </div>

        <StepNavigation
          onBack={() => {
            setStepIndex(5);
            navigate('/restaurant-portal/onboarding/team');
          }}
          nextLabel="Complete Setup"
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
};
export default ReviewSummaryCard;
