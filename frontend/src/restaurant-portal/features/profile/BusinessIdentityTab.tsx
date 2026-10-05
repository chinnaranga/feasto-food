import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '../../utils/zodResolver';
import { z } from 'zod';
import { usePortalProfileStore } from '../../store/portalProfileStore';
import { FormField } from '../../components/ui/AuthFormFields';
import { SectionDivider } from '../../components/ui/SectionDivider';

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const businessSchema = z.object({
  legalName: z.string().min(3, 'Legal business name is required'),
  taxId: z.string().min(3, 'GST / Tax ID is required'),
  registrationNumber: z.string().optional(),
  businessCategory: z.string().min(1, 'Please select a business category'),
  ownershipType: z.string().min(1, 'Please select an ownership type'),
  contactEmail: z.string().email('Please enter a valid email address'),
  contactPhone: z
    .string()
    .min(7, 'Phone number must be at least 7 digits')
    .regex(/^[+\d\s\-().]+$/, 'Phone number contains invalid characters'),
});

type BusinessFormValues = z.infer<typeof businessSchema>;

const BUSINESS_CATEGORIES = [
  'Full Service Restaurant',
  'Quick Service (QSR)',
  'Cloud Kitchen',
  'Bakehouse / Cafe',
  'Food Truck',
  'Bar & Grill',
  'Fine Dining',
] as const;

const OWNERSHIP_TYPES = [
  'Privately Owned',
  'Public Corporation',
  'Partnership',
  'Sole Proprietor',
  'Franchise',
] as const;

// ─── Component ────────────────────────────────────────────────────────────────
export const BusinessIdentityTab: React.FC = () => {
  const { draft, setDraft } = usePortalProfileStore();

  const {
    register,
    formState: { errors },
    watch,
    reset,
  } = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      legalName: draft.legalName,
      taxId: draft.taxId,
      registrationNumber: draft.registrationNumber,
      businessCategory: draft.businessCategory,
      ownershipType: draft.ownershipType,
      contactEmail: draft.contactEmail,
      contactPhone: draft.contactPhone,
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    reset({
      legalName: draft.legalName,
      taxId: draft.taxId,
      registrationNumber: draft.registrationNumber,
      businessCategory: draft.businessCategory,
      ownershipType: draft.ownershipType,
      contactEmail: draft.contactEmail,
      contactPhone: draft.contactPhone,
    });
  }, [draft.legalName, draft.taxId, draft.registrationNumber, draft.businessCategory, draft.ownershipType, draft.contactEmail, draft.contactPhone, reset]);

  const watched = watch();
  useEffect(() => {
    setDraft({
      legalName: watched.legalName,
      taxId: watched.taxId,
      registrationNumber: watched.registrationNumber ?? '',
      businessCategory: watched.businessCategory,
      ownershipType: watched.ownershipType,
      contactEmail: watched.contactEmail,
      contactPhone: watched.contactPhone,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    watched.legalName, watched.taxId, watched.registrationNumber,
    watched.businessCategory, watched.ownershipType,
    watched.contactEmail, watched.contactPhone,
  ]);

  return (
    <form className="space-y-6 text-left" noValidate>
      {/* Section header */}
      <div>
        <h3 className="text-sm font-bold text-neutral-800">Business Registration</h3>
        <p className="text-xs text-neutral-400 mt-0.5">
          Manage legal corporate name structures, tax identifiers, and official support contacts.
          This information is used for compliance and billing purposes.
        </p>
      </div>

      {/* Legal info */}
      <SectionDivider label="Legal Entity" />
      <div className="space-y-4">
        <FormField
          label="Legal Business Name"
          id="legalName"
          placeholder="e.g. Sora Culinary Group Co. Ltd."
          error={errors.legalName?.message}
          {...register('legalName')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="GST / Tax ID"
            id="taxId"
            placeholder="e.g. GST-99221133"
            error={errors.taxId?.message}
            hint="Required for compliance verification"
            {...register('taxId')}
          />
          <FormField
            label="Registration Number"
            id="registrationNumber"
            placeholder="e.g. CRN-773344"
            error={errors.registrationNumber?.message}
            hint="Optional — corporate registration reference"
            {...register('registrationNumber')}
          />
        </div>
      </div>

      {/* Business classification */}
      <SectionDivider label="Business Classification" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="businessCategory" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
            Business Category
          </label>
          <select
            id="businessCategory"
            {...register('businessCategory')}
            className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:ring-2 focus:ring-[#e35205]/20 focus:outline-none rounded-lg text-xs font-semibold text-neutral-800 transition-all duration-200 cursor-pointer"
          >
            {BUSINESS_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.businessCategory && (
            <span className="text-[10px] font-bold text-red-600">{errors.businessCategory.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="ownershipType" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
            Ownership Model
          </label>
          <select
            id="ownershipType"
            {...register('ownershipType')}
            className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:ring-2 focus:ring-[#e35205]/20 focus:outline-none rounded-lg text-xs font-semibold text-neutral-800 transition-all duration-200 cursor-pointer"
          >
            {OWNERSHIP_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.ownershipType && (
            <span className="text-[10px] font-bold text-red-600">{errors.ownershipType.message}</span>
          )}
        </div>
      </div>

      {/* Contact info */}
      <SectionDivider label="Business Contact" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Contact Email"
          id="contactEmail"
          type="email"
          placeholder="contact@yourrestaurant.com"
          error={errors.contactEmail?.message}
          hint="Public-facing support email"
          {...register('contactEmail')}
        />
        <FormField
          label="Contact Phone"
          id="contactPhone"
          type="tel"
          placeholder="+91 98765 43210"
          error={errors.contactPhone?.message}
          hint="Include country code"
          {...register('contactPhone')}
        />
      </div>

      {/* Info note */}
      <div className="flex items-start gap-2 p-3 bg-neutral-50 border border-neutral-100 rounded-xl">
        <div className="w-1 h-full min-h-[20px] bg-neutral-300 rounded-full shrink-0 mt-0.5" />
        <p className="text-[10px] text-neutral-500 leading-relaxed">
          Business registration details are used for tax compliance and partner verification only. They are not shown on your public restaurant profile.
        </p>
      </div>
    </form>
  );
};

export default BusinessIdentityTab;
