import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '../../utils/zodResolver';
import { z } from 'zod';
import { UtensilsCrossed, Bike, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import { usePortalProfileStore } from '../../store/portalProfileStore';
import type { HoursEntry } from '../../store/portalProfileStore';
import { SectionDivider } from '../../components/ui/SectionDivider';
import { ToggleRow } from '../../components/ui/ToggleRow';
import { HoursRow } from '../../components/ui/HoursRow';

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const opsSchema = z.object({
  prepTimeMin: z.coerce
    .number()
    .min(1, 'Minimum prep time must be at least 1 minute')
    .max(120, 'Maximum 120 minutes'),
  prepTimeMax: z.coerce
    .number()
    .min(1, 'Maximum prep time must be at least 1 minute')
    .max(180, 'Maximum 180 minutes'),
}).refine((d) => d.prepTimeMax > d.prepTimeMin, {
  message: 'Maximum prep time must be greater than minimum',
  path: ['prepTimeMax'],
});

type OpsFormValues = z.infer<typeof opsSchema>;

// ─── Hours Section ────────────────────────────────────────────────────────────
type HoursScope = 'openingHours' | 'kitchenHours' | 'pickupHours' | 'deliveryHours';

interface HoursSectionProps {
  scope: HoursScope;
  label: string;
  icon: React.ReactNode;
  hours: HoursEntry[];
  onChangeEntry: (scope: HoursScope, index: number, patch: Partial<HoursEntry>) => void;
}

const HoursSection: React.FC<HoursSectionProps> = ({ scope, label, icon, hours, onChangeEntry }) => {
  const [expanded, setExpanded] = useState(scope === 'openingHours');

  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50/60 hover:bg-neutral-50 transition-colors duration-150 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-[#e35205]">{icon}</span>
          <span className="text-xs font-bold text-neutral-700">{label}</span>
          <span className="text-[9px] font-semibold text-neutral-400">
            {hours.filter((h) => !h.isClosed).length} days open
          </span>
        </div>
        {expanded ? <ChevronUp size={13} className="text-neutral-400" /> : <ChevronDown size={13} className="text-neutral-400" />}
      </button>

      {expanded && (
        <div className="px-4 pb-2 pt-1">
          {hours.map((entry, idx) => (
            <HoursRow
              key={entry.day}
              entry={entry}
              onChange={(patch) => onChangeEntry(scope, idx, patch)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const OperationsTab: React.FC = () => {
  const { draft, setDraftField, setHoursEntry } = usePortalProfileStore();

  const {
    register,
    formState: { errors },
    watch,
  } = useForm<OpsFormValues>({
    resolver: zodResolver(opsSchema),
    defaultValues: {
      prepTimeMin: draft.prepTimeMin,
      prepTimeMax: draft.prepTimeMax,
    },
    mode: 'onBlur',
  });

  const watchedMin = watch('prepTimeMin');
  const watchedMax = watch('prepTimeMax');

  // Sync prepTime to store on change
  React.useEffect(() => {
    if (watchedMin !== undefined) setDraftField('prepTimeMin', Number(watchedMin));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedMin]);

  React.useEffect(() => {
    if (watchedMax !== undefined) setDraftField('prepTimeMax', Number(watchedMax));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedMax]);

  const serviceModesAny = draft.dineIn || draft.takeaway || draft.delivery;

  return (
    <form className="space-y-6 text-left" noValidate>
      {/* Header */}
      <div>
        <h3 className="text-sm font-bold text-neutral-800">Operational Identity</h3>
        <p className="text-xs text-neutral-400 mt-0.5">
          Configure service modes, default preparation times, and operating hours for each channel.
          Complete this section to publish your public profile.
        </p>
      </div>

      {/* Service Modes */}
      <SectionDivider label="Service Modes" />
      <div className="rounded-xl border border-neutral-100 bg-neutral-50/40 px-4 divide-y divide-neutral-100">
        <ToggleRow
          label="Dine-In Service"
          description="Accept walk-in and reservations for in-house dining."
          checked={draft.dineIn}
          onChange={(val) => setDraftField('dineIn', val)}
        />
        <ToggleRow
          label="Takeaway / Self-Pickup"
          description="Allow customers to order ahead and collect from your counter."
          checked={draft.takeaway}
          onChange={(val) => setDraftField('takeaway', val)}
        />
        <ToggleRow
          label="Delivery Service"
          description="Accept orders for delivery to customer addresses."
          checked={draft.delivery}
          onChange={(val) => setDraftField('delivery', val)}
        />
      </div>

      {!serviceModesAny && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
          <p className="text-[10px] text-amber-700 font-semibold">
            At least one service mode must be enabled for your restaurant to accept orders.
          </p>
        </div>
      )}

      {/* Prep Time */}
      <SectionDivider label="Default Preparation Time" />
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="prepTimeMin" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
            Minimum Prep Time (min)
          </label>
          <input
            id="prepTimeMin"
            type="number"
            min={1}
            max={120}
            className={`w-full px-3 py-2 bg-white border ${
              errors.prepTimeMin ? 'border-red-400 focus:ring-red-400/20' : 'border-neutral-200 focus:border-[#e35205] focus:ring-[#e35205]/20'
            } focus:outline-none focus:ring-2 rounded-lg text-xs font-semibold text-neutral-800 transition-all duration-150`}
            {...register('prepTimeMin')}
          />
          {errors.prepTimeMin && (
            <span className="text-[10px] font-bold text-red-600">{errors.prepTimeMin.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="prepTimeMax" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
            Maximum Prep Time (min)
          </label>
          <input
            id="prepTimeMax"
            type="number"
            min={1}
            max={180}
            className={`w-full px-3 py-2 bg-white border ${
              errors.prepTimeMax ? 'border-red-400 focus:ring-red-400/20' : 'border-neutral-200 focus:border-[#e35205] focus:ring-[#e35205]/20'
            } focus:outline-none focus:ring-2 rounded-lg text-xs font-semibold text-neutral-800 transition-all duration-150`}
            {...register('prepTimeMax')}
          />
          {errors.prepTimeMax && (
            <span className="text-[10px] font-bold text-red-600">{errors.prepTimeMax.message}</span>
          )}
        </div>
      </div>

      {/* Prep time display badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-full">
        <span className="text-[10px] font-semibold text-neutral-500">Estimated wait time shown to customers:</span>
        <span className="text-[10px] font-black text-neutral-800">
          {watchedMin ?? draft.prepTimeMin}–{watchedMax ?? draft.prepTimeMax} min
        </span>
      </div>

      {/* Operating Hours */}
      <SectionDivider label="Operating Hours" />
      <div className="space-y-3">
        <HoursSection
          scope="openingHours"
          label="Restaurant Opening Hours"
          icon={<UtensilsCrossed size={14} />}
          hours={draft.openingHours}
          onChangeEntry={setHoursEntry}
        />
        <HoursSection
          scope="kitchenHours"
          label="Kitchen Hours"
          icon={<UtensilsCrossed size={14} />}
          hours={draft.kitchenHours}
          onChangeEntry={setHoursEntry}
        />
        <HoursSection
          scope="pickupHours"
          label="Pickup Hours"
          icon={<ShoppingBag size={14} />}
          hours={draft.pickupHours}
          onChangeEntry={setHoursEntry}
        />
        <HoursSection
          scope="deliveryHours"
          label="Delivery Hours"
          icon={<Bike size={14} />}
          hours={draft.deliveryHours}
          onChangeEntry={setHoursEntry}
        />
      </div>

      <p className="text-[10px] text-neutral-400">
        Hours are displayed in your selected workspace timezone. Customers see adjusted local times automatically.
      </p>
    </form>
  );
};

export default OperationsTab;
