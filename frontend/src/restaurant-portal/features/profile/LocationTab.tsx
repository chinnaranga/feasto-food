import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '../../utils/zodResolver';
import { z } from 'zod';
import { MapPin } from 'lucide-react';
import { usePortalProfileStore } from '../../store/portalProfileStore';
import { FormField } from '../../components/ui/AuthFormFields';
import { SectionDivider } from '../../components/ui/SectionDivider';
import { ToggleRow } from '../../components/ui/ToggleRow';

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const locationSchema = z.object({
  address: z.string().min(5, 'Please enter a complete address'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State / Region is required'),
  country: z.string().min(1, 'Please select a country'),
  timezone: z.string().min(1, 'Please select a timezone'),
});

type LocationFormValues = z.infer<typeof locationSchema>;

const COUNTRIES = [
  { value: 'IN', label: 'India' },
  { value: 'JP', label: 'Japan' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'AU', label: 'Australia' },
  { value: 'SG', label: 'Singapore' },
  { value: 'AE', label: 'United Arab Emirates' },
] as const;

const TIMEZONES = [
  { value: 'Asia/Kolkata',   label: 'India Time (IST, UTC+5:30)' },
  { value: 'Asia/Tokyo',     label: 'Japan Time (JST, UTC+9)' },
  { value: 'America/New_York', label: 'Eastern Time (EST, UTC-5)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PST, UTC-8)' },
  { value: 'Europe/London',  label: 'London Time (GMT, UTC+0)' },
  { value: 'Europe/Berlin',  label: 'Berlin Time (CET, UTC+1)' },
  { value: 'Australia/Sydney', label: 'Sydney Time (AEST, UTC+10)' },
  { value: 'Asia/Singapore', label: 'Singapore Time (SGT, UTC+8)' },
  { value: 'Asia/Dubai',     label: 'Dubai Time (GST, UTC+4)' },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────
export const LocationTab: React.FC = () => {
  const { draft, setDraft, setDraftField } = usePortalProfileStore();

  const {
    register,
    formState: { errors },
    watch,
    reset,
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      address: draft.address,
      city: draft.city,
      state: draft.state,
      country: draft.country,
      timezone: draft.timezone,
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    reset({
      address: draft.address,
      city: draft.city,
      state: draft.state,
      country: draft.country,
      timezone: draft.timezone,
    });
  }, [draft.address, draft.city, draft.state, draft.country, draft.timezone, reset]);

  const watched = watch();
  useEffect(() => {
    setDraft({
      address: watched.address,
      city: watched.city,
      state: watched.state,
      country: watched.country,
      timezone: watched.timezone,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watched.address, watched.city, watched.state, watched.country, watched.timezone]);

  return (
    <form className="space-y-6 text-left" noValidate>
      {/* Section header */}
      <div>
        <h3 className="text-sm font-bold text-neutral-800">Location & Contact</h3>
        <p className="text-xs text-neutral-400 mt-0.5">
          Configure your physical restaurant address, delivery support zones, and regional timezone settings.
        </p>
      </div>

      {/* Address */}
      <SectionDivider label="Physical Address" />
      <div className="space-y-4">
        <FormField
          label="Street Address"
          id="address"
          placeholder="e.g. 1-16 Shinjuku, Shinjuku-ku"
          error={errors.address?.message}
          {...register('address')}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="City"
            id="city"
            placeholder="e.g. Tokyo"
            error={errors.city?.message}
            {...register('city')}
          />
          <FormField
            label="State / Region"
            id="state"
            placeholder="e.g. Kanto"
            error={errors.state?.message}
            {...register('state')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Country select */}
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="country" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              Country
            </label>
            <select
              id="country"
              {...register('country')}
              className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:ring-2 focus:ring-[#e35205]/20 focus:outline-none rounded-lg text-xs font-semibold text-neutral-800 cursor-pointer transition-all duration-150"
            >
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.label}>{c.label}</option>
              ))}
            </select>
            {errors.country && (
              <span className="text-[10px] font-bold text-red-600">{errors.country.message}</span>
            )}
          </div>

          {/* Timezone select */}
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="timezone" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              Timezone
            </label>
            <select
              id="timezone"
              {...register('timezone')}
              className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:ring-2 focus:ring-[#e35205]/20 focus:outline-none rounded-lg text-xs font-semibold text-neutral-800 cursor-pointer transition-all duration-150"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
            {errors.timezone && (
              <span className="text-[10px] font-bold text-red-600">{errors.timezone.message}</span>
            )}
          </div>
        </div>
      </div>

      {/* Delivery zone */}
      <SectionDivider label="Delivery Zone" />
      <div className="rounded-xl border border-neutral-100 bg-neutral-50/40 px-4 divide-y divide-neutral-100">
        <ToggleRow
          label="Delivery Zone Enabled"
          description="Allow the system to compute delivery ranges from your address coordinates."
          checked={draft.hasDeliveryZone}
          onChange={(val) => setDraftField('hasDeliveryZone', val)}
        />
      </div>

      {/* Map placeholder */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
          Coordinates Preview
        </span>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 flex items-center justify-center gap-4 select-none">
          <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
            <MapPin size={16} className="text-[#e35205]" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-700">
              {draft.city}, {draft.country}
            </p>
            <p className="text-[10px] text-neutral-400 mt-0.5">
              Delivery search radius is automatically computed from this base location marker.
              Coordinate precision is synchronized with your address.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LocationTab;
