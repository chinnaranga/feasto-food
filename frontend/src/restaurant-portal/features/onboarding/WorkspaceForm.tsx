import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { FormField } from '../../components/ui/AuthFormFields';
import OnboardingStepHeader from '../../components/ui/OnboardingStepHeader';
import StepNavigation from '../../components/ui/StepNavigation';
import { usePortalOnboardingStore } from '../../store/portalOnboardingStore';
import { zodResolver } from '../../utils/zodResolver';

const workspaceSchema = z.object({
  workspaceName: z.string().min(3, 'Workspace name must be at least 3 characters'),
  region: z.string().min(1, 'Please select a country/region'),
  currency: z.string().min(1, 'Please select a currency'),
  timezone: z.string().min(1, 'Please select a timezone'),
});

type WorkspaceSchemaType = z.infer<typeof workspaceSchema>;

export const WorkspaceForm: React.FC = () => {
  const navigate = useNavigate();
  const { drafts, setStepDraft, markStepComplete, setStepIndex } = usePortalOnboardingStore();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<WorkspaceSchemaType>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: drafts.workspace,
  });

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStepDraft('workspace', getValues());
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = async (data: WorkspaceSchemaType) => {
    setStepDraft('workspace', data);
    markStepComplete('workspace');
    setStepIndex(2);
    navigate('/restaurant-portal/onboarding/profile');
  };

  return (
    <div className="text-left">
      <OnboardingStepHeader
        title="Workspace Configuration"
        description="Establish your brand's workspace environment. These settings will control tax regions and financial calculations."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Workspace Name"
          id="workspaceName"
          placeholder="e.g. Kenji's Kitchen Group"
          error={errors.workspaceName?.message}
          {...register('workspaceName')}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="region" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              Country / Region
            </label>
            <select
              id="region"
              className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:ring-2 focus:ring-[#e35205]/20 rounded-lg text-xs font-bold text-neutral-800 transition-all duration-200 cursor-pointer"
              {...register('region')}
            >
              <option value="United States">United States</option>
              <option value="Japan">Japan</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="India">India</option>
              <option value="Germany">Germany</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="currency" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              Currency
            </label>
            <select
              id="currency"
              className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:ring-2 focus:ring-[#e35205]/20 rounded-lg text-xs font-bold text-neutral-800 transition-all duration-200 cursor-pointer"
              {...register('currency')}
            >
              <option value="USD">USD ($)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="EUR">EUR (€)</option>
              <option value="INR">INR (₹)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="timezone" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              Timezone
            </label>
            <select
              id="timezone"
              className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:ring-2 focus:ring-[#e35205]/20 rounded-lg text-xs font-bold text-neutral-800 transition-all duration-200 cursor-pointer"
              {...register('timezone')}
            >
              <option value="America/New_York">Eastern Time (EST)</option>
              <option value="Asia/Tokyo">Japan Time (JST)</option>
              <option value="Europe/London">London Time (GMT)</option>
              <option value="Asia/Kolkata">India Time (IST)</option>
              <option value="Europe/Berlin">Berlin Time (CET)</option>
            </select>
          </div>
        </div>

        <StepNavigation
          onBack={() => {
            setStepIndex(0);
            navigate('/restaurant-portal/onboarding');
          }}
          onSaveDraft={handleSaveDraft}
          isDraftSaving={isSaving}
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
};
export default WorkspaceForm;
