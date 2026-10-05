import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { FormField, CheckboxField } from '../../components/ui/AuthFormFields';
import OnboardingStepHeader from '../../components/ui/OnboardingStepHeader';
import StepNavigation from '../../components/ui/StepNavigation';
import { usePortalOnboardingStore } from '../../store/portalOnboardingStore';
import { zodResolver } from '../../utils/zodResolver';

const operationsSchema = z
  .object({
    dineIn: z.boolean(),
    takeaway: z.boolean(),
    delivery: z.boolean(),
    prepTimeMin: z.coerce.number().min(5, 'Minimum preparation time is 5 minutes'),
    prepTimeMax: z.coerce.number().min(5, 'Maximum preparation time is 5 minutes'),
  })
  .refine((data) => data.prepTimeMax >= data.prepTimeMin, {
    message: 'Maximum preparation limit must exceed minimum threshold',
    path: ['prepTimeMax'],
  });

type OperationsSchemaType = z.infer<typeof operationsSchema>;

export const OperationsPreferencesForm: React.FC = () => {
  const navigate = useNavigate();
  const { drafts, setStepDraft, markStepComplete, setStepIndex } = usePortalOnboardingStore();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<OperationsSchemaType>({
    resolver: zodResolver(operationsSchema),
    defaultValues: drafts.operations,
  });

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStepDraft('operations', getValues());
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = async (data: OperationsSchemaType) => {
    setStepDraft('operations', data);
    markStepComplete('operations');
    setStepIndex(5);
    navigate('/restaurant-portal/onboarding/team');
  };

  return (
    <div className="text-left">
      <OnboardingStepHeader
        title="Operational Rules & Service Channels"
        description="Establish operational time bounds and delivery support settings. These variables control live SLA tracking timers on order logs."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Service availability options */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
            Supported Service Channels
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-neutral-100 bg-[#fafafb]/30 p-4 rounded-xl">
            <CheckboxField
              label="Dine-in (POS Tables)"
              id="dineIn"
              {...register('dineIn')}
            />
            <CheckboxField
              label="Takeaway (Pick-up)"
              id="takeaway"
              {...register('takeaway')}
            />
            <CheckboxField
              label="Home Delivery"
              id="delivery"
              {...register('delivery')}
            />
          </div>
        </div>

        {/* Preparation SLA bounds */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
            Estimated Order Prep Times (Minutes)
          </span>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Minimum Prep Time"
              id="prepTimeMin"
              type="number"
              placeholder="15"
              error={errors.prepTimeMin?.message}
              {...register('prepTimeMin')}
            />

            <FormField
              label="Maximum Prep Time"
              id="prepTimeMax"
              type="number"
              placeholder="30"
              error={errors.prepTimeMax?.message}
              {...register('prepTimeMax')}
            />
          </div>
        </div>

        <StepNavigation
          onBack={() => {
            setStepIndex(3);
            navigate('/restaurant-portal/onboarding/business');
          }}
          onSaveDraft={handleSaveDraft}
          isDraftSaving={isSaving}
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
};
export default OperationsPreferencesForm;
