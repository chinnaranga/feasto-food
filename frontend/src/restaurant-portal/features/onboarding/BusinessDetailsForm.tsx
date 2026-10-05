import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { FormField } from '../../components/ui/AuthFormFields';
import OnboardingStepHeader from '../../components/ui/OnboardingStepHeader';
import StepNavigation from '../../components/ui/StepNavigation';
import { usePortalOnboardingStore } from '../../store/portalOnboardingStore';
import { zodResolver } from '../../utils/zodResolver';

const businessSchema = z.object({
  legalName: z.string().min(3, 'Official legal name must be at least 3 characters'),
  taxId: z.string().min(5, 'Tax Registry Identifier must be at least 5 characters'),
  registrationNumber: z.string().min(5, 'Official registration code must be at least 5 characters'),
});

type BusinessSchemaType = z.infer<typeof businessSchema>;

export const BusinessDetailsForm: React.FC = () => {
  const navigate = useNavigate();
  const { drafts, setStepDraft, markStepComplete, setStepIndex } = usePortalOnboardingStore();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<BusinessSchemaType>({
    resolver: zodResolver(businessSchema),
    defaultValues: drafts.business,
  });

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStepDraft('business', getValues());
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = async (data: BusinessSchemaType) => {
    setStepDraft('business', data);
    markStepComplete('business');
    setStepIndex(4);
    navigate('/restaurant-portal/onboarding/operations');
  };

  return (
    <div className="text-left">
      <OnboardingStepHeader
        title="Business Identification & Tax Profile"
        description="Provide official registry identifiers to verify merchant status. This details are required for setting up daily financial payout transfers."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <FormField
          label="Legal Business Name"
          id="legalName"
          placeholder="e.g. Sora Culinary Enterprise Inc."
          error={errors.legalName?.message}
          {...register('legalName')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="GST / Tax ID"
            id="taxId"
            placeholder="e.g. GST-99882211"
            error={errors.taxId?.message}
            {...register('taxId')}
          />

          <FormField
            label="Corporate Registration Number"
            id="registrationNumber"
            placeholder="e.g. CRN-11002233"
            error={errors.registrationNumber?.message}
            {...register('registrationNumber')}
          />
        </div>

        {/* Mock payout notification */}
        <div className="p-4 border border-neutral-100 bg-neutral-50/50 rounded-xl flex flex-col gap-1.5 select-none">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Payout Bank Account Readiness
          </span>
          <p className="text-[10px] text-neutral-500 leading-relaxed">
            Payout configuration wizard links securely via **Stripe Merchant Desk**. You will configure payout routing destinations directly inside your billing settings panel after completes this workspace wizard.
          </p>
        </div>

        <StepNavigation
          onBack={() => {
            setStepIndex(2);
            navigate('/restaurant-portal/onboarding/profile');
          }}
          onSaveDraft={handleSaveDraft}
          isDraftSaving={isSaving}
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
};
export default BusinessDetailsForm;
