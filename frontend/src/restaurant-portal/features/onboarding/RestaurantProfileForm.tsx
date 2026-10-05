import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { FormField } from '../../components/ui/AuthFormFields';
import OnboardingStepHeader from '../../components/ui/OnboardingStepHeader';
import UploadPlaceholder from '../../components/ui/UploadPlaceholder';
import StepNavigation from '../../components/ui/StepNavigation';
import { usePortalOnboardingStore } from '../../store/portalOnboardingStore';
import { zodResolver } from '../../utils/zodResolver';

const profileSchema = z.object({
  cuisineType: z.string().min(2, 'Cuisine descriptor must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  address: z.string().min(5, 'Please enter a valid business address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  email: z.string().email('Please enter a valid email address'),
});

type ProfileSchemaType = z.infer<typeof profileSchema>;

export const RestaurantProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const { drafts, setStepDraft, markStepComplete, setStepIndex } = usePortalOnboardingStore();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema),
    defaultValues: drafts.profile,
  });

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStepDraft('profile', {
        ...drafts.profile,
        ...getValues(),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = async (data: ProfileSchemaType) => {
    setStepDraft('profile', {
      ...drafts.profile,
      ...data,
    });
    markStepComplete('profile');
    setStepIndex(3);
    navigate('/restaurant-portal/onboarding/business');
  };

  return (
    <div className="text-left">
      <OnboardingStepHeader
        title="Restaurant Brand Profile"
        description="Configure how your brand appears to customers. You can customize logo branding overlays and menu descriptions."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Upload grids placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <UploadPlaceholder
            label="Restaurant Logo"
            hint="1:1 Ratio (500x500)"
            aspectRatio="square"
          />
          <UploadPlaceholder
            label="Cover Image Banner"
            hint="16:9 Landscape (1600x900)"
            aspectRatio="wide"
          />
        </div>

        <FormField
          label="Primary Cuisine Descriptor"
          id="cuisineType"
          placeholder="e.g. Japanese fusion, Contemporary Ramen"
          error={errors.cuisineType?.message}
          {...register('cuisineType')}
        />

        <div className="flex flex-col gap-1 w-full text-left">
          <label htmlFor="description" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
            Restaurant Description
          </label>
          <textarea
            id="description"
            placeholder="Introduce your culinary background and branch atmosphere..."
            rows={3}
            className={`w-full px-3 py-2 bg-white border ${
              errors.description ? 'border-red-500 focus:ring-red-500/20' : 'border-neutral-200 focus:border-[#e35205] focus:ring-[#e35205]/20'
            } focus:outline-none focus:ring-2 rounded-lg text-xs text-neutral-800 transition-all duration-200 placeholder:text-neutral-400`}
            {...register('description')}
          />
          {errors.description && (
            <span className="text-[10px] font-bold text-red-600 mt-1 block" role="alert">
              {errors.description.message}
            </span>
          )}
        </div>

        <FormField
          label="Physical Address"
          id="address"
          placeholder="120 Shinjuku, Tokyo, Japan"
          error={errors.address?.message}
          {...register('address')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Business Contact Number"
            id="phone"
            placeholder="+81-3-1234-5678"
            error={errors.phone?.message}
            {...register('phone')}
          />

          <FormField
            label="Business Email"
            id="email"
            placeholder="contact@sora-sushi.com"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <StepNavigation
          onBack={() => {
            setStepIndex(1);
            navigate('/restaurant-portal/onboarding/workspace');
          }}
          onSaveDraft={handleSaveDraft}
          isDraftSaving={isSaving}
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
};
export default RestaurantProfileForm;
