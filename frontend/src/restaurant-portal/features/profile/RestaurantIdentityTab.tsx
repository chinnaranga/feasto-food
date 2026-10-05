import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '../../utils/zodResolver';
import { z } from 'zod';
import { usePortalProfileStore } from '../../store/portalProfileStore';
import { FormField, FormError } from '../../components/ui/AuthFormFields';
import { UploadPlaceholder } from '../../components/ui/UploadPlaceholder';
import { SectionDivider } from '../../components/ui/SectionDivider';
import { ToggleRow } from '../../components/ui/ToggleRow';

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const identitySchema = z.object({
  restaurantName: z.string().min(2, 'Restaurant name must be at least 2 characters'),
  tagline: z.string().min(5, 'Tagline must be at least 5 characters').max(120, 'Tagline is too long'),
  cuisineType: z.string().min(2, 'Please enter a cuisine type'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(600, 'Description cannot exceed 600 characters'),
});

type IdentityFormValues = z.infer<typeof identitySchema>;

// ─── Component ────────────────────────────────────────────────────────────────
export const RestaurantIdentityTab: React.FC = () => {
  const { draft, setDraftField, setDraft } = usePortalProfileStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<IdentityFormValues>({
    resolver: zodResolver(identitySchema),
    defaultValues: {
      restaurantName: draft.restaurantName,
      tagline: draft.tagline,
      cuisineType: draft.cuisineType,
      description: draft.description,
    },
    mode: 'onBlur',
  });

  // Sync form defaults when saved profile changes
  useEffect(() => {
    reset({
      restaurantName: draft.restaurantName,
      tagline: draft.tagline,
      cuisineType: draft.cuisineType,
      description: draft.description,
    });
  }, [draft.restaurantName, draft.tagline, draft.cuisineType, draft.description, reset]);

  // Live sync each field to store on change (for SaveChangesBar)
  const watched = watch();
  useEffect(() => {
    setDraft({
      restaurantName: watched.restaurantName,
      tagline: watched.tagline,
      cuisineType: watched.cuisineType,
      description: watched.description,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watched.restaurantName, watched.tagline, watched.cuisineType, watched.description]);

  return (
    <form
      onSubmit={handleSubmit(() => { /* SaveChangesBar handles save */ })}
      className="space-y-6 text-left"
      noValidate
    >
      {/* Section header */}
      <div>
        <h3 className="text-sm font-bold text-neutral-800">Restaurant Identity</h3>
        <p className="text-xs text-neutral-400 mt-0.5">
          Define your brand name, cuisine type, tagline, and catalog visibility. Your restaurant profile
          helps partners and staff understand your business.
        </p>
      </div>

      {/* Media uploads */}
      <SectionDivider label="Brand Media" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        <UploadPlaceholder
          label="Brand Logo"
          hint="Square format recommended — 512×512px minimum"
          aspectRatio="square"
          previewUrl={draft.logoUrl}
          onUpload={(url) => setDraftField('logoUrl', url)}
          onClear={() => setDraftField('logoUrl', '')}
        />
        <UploadPlaceholder
          label="Cover Image"
          hint="Wide banner — 1200×400px recommended"
          aspectRatio="banner"
          previewUrl={draft.coverUrl}
          onUpload={(url) => setDraftField('coverUrl', url)}
          onClear={() => setDraftField('coverUrl', '')}
        />
      </div>

      {/* Identity fields */}
      <SectionDivider label="Brand Details" />
      <div className="space-y-4">
        <FormField
          label="Restaurant Name"
          id="restaurantName"
          placeholder="e.g. Sora Sushi Restaurant"
          error={errors.restaurantName?.message}
          {...register('restaurantName')}
        />

        <FormField
          label="Brand Tagline"
          id="tagline"
          placeholder="e.g. Handmade ramen, fresh noodles daily"
          error={errors.tagline?.message}
          hint="This appears on your public listing card"
          {...register('tagline')}
        />

        <FormField
          label="Cuisine Descriptor"
          id="cuisineType"
          placeholder="e.g. Japanese Fusion, Modern Italian"
          error={errors.cuisineType?.message}
          {...register('cuisineType')}
        />

        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="description" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
            Restaurant Description
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Describe what makes your restaurant unique — cuisine, atmosphere, specialities…"
            className={`w-full px-3 py-2 bg-white border ${
              errors.description ? 'border-red-500 focus:ring-red-500/20' : 'border-neutral-200 focus:border-[#e35205] focus:ring-[#e35205]/20'
            } focus:outline-none focus:ring-2 rounded-lg text-xs text-neutral-800 resize-none transition-all duration-200 placeholder:text-neutral-400`}
            {...register('description')}
          />
          <div className="flex justify-between items-center mt-0.5">
            {errors.description ? (
              <FormError message={errors.description.message} />
            ) : (
              <span className="text-[9px] text-neutral-400">Minimum 20 characters</span>
            )}
            <span className="text-[9px] text-neutral-400">
              {(watched.description ?? '').length} / 600
            </span>
          </div>
        </div>
      </div>

      {/* Visibility toggle */}
      <SectionDivider label="Catalog Visibility" />
      <div className="rounded-xl border border-neutral-100 bg-neutral-50/40 px-4 divide-y divide-neutral-100">
        <ToggleRow
          label="Public Catalog Visibility"
          description="Toggle off to temporarily hide your brand from customer search results."
          checked={draft.isVisible}
          onChange={(val) => setDraftField('isVisible', val)}
        />
      </div>

      <p className="text-[10px] text-neutral-400">
        You can update these details anytime. Changes take effect immediately after saving.
      </p>
    </form>
  );
};

export default RestaurantIdentityTab;
