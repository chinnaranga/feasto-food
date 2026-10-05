import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '../../utils/zodResolver';
import { z } from 'zod';
import { usePortalProfileStore } from '../../store/portalProfileStore';
import { FormField } from '../../components/ui/AuthFormFields';
import { SectionDivider } from '../../components/ui/SectionDivider';
import { ToggleRow } from '../../components/ui/ToggleRow';

// ─── Schema ───────────────────────────────────────────────────────────────────
const workspaceSchema = z.object({
  workspaceName: z.string().min(3, 'Workspace name must be at least 3 characters'),
  language: z.string().min(1),
  currency: z.string().min(1),
  region: z.string().min(1),
});

type WorkspaceFormValues = z.infer<typeof workspaceSchema>;

const LANGUAGES = [
  { value: 'English',    label: 'English' },
  { value: 'Japanese',   label: '日本語 (Japanese)' },
  { value: 'Hindi',      label: 'हिन्दी (Hindi)' },
  { value: 'German',     label: 'Deutsch (German)' },
  { value: 'French',     label: 'Français (French)' },
  { value: 'Spanish',    label: 'Español (Spanish)' },
  { value: 'Arabic',     label: 'العربية (Arabic)' },
] as const;

const CURRENCIES = [
  { value: 'INR', label: '₹ Indian Rupee (INR)' },
  { value: 'JPY', label: '¥ Japanese Yen (JPY)' },
  { value: 'USD', label: '$ US Dollar (USD)' },
  { value: 'GBP', label: '£ British Pound (GBP)' },
  { value: 'EUR', label: '€ Euro (EUR)' },
  { value: 'AUD', label: 'A$ Australian Dollar (AUD)' },
  { value: 'SGD', label: 'S$ Singapore Dollar (SGD)' },
  { value: 'AED', label: 'AED UAE Dirham (AED)' },
] as const;

const REGIONS = [
  { value: 'IN', label: 'India' },
  { value: 'JP', label: 'Japan' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'EU', label: 'Europe' },
  { value: 'AU', label: 'Australia' },
  { value: 'SG', label: 'Singapore' },
  { value: 'AE', label: 'UAE' },
] as const;

type OperationalMode = 'online' | 'paused' | 'offline';
type TeamVisibility = 'all' | 'managers-only' | 'owner-only';

const MODE_OPTIONS: { value: OperationalMode; label: string; description: string; color: string }[] = [
  { value: 'online',  label: 'Online',  description: 'Accepting all orders normally',  color: 'border-emerald-500 bg-emerald-50' },
  { value: 'paused',  label: 'Paused',  description: 'Temporarily halting new orders', color: 'border-amber-400 bg-amber-50' },
  { value: 'offline', label: 'Offline', description: 'Restaurant not taking any orders', color: 'border-neutral-300 bg-neutral-50' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export const WorkspaceSettingsTab: React.FC = () => {
  const { draft, setDraftField, setDraft } = usePortalProfileStore();

  const {
    register,
    formState: { errors },
    watch,
    reset,
  } = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      workspaceName: draft.workspaceName,
      language: draft.language,
      currency: draft.currency,
      region: draft.region,
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    reset({
      workspaceName: draft.workspaceName,
      language: draft.language,
      currency: draft.currency,
      region: draft.region,
    });
  }, [draft.workspaceName, draft.language, draft.currency, draft.region, reset]);

  const watched = watch();
  useEffect(() => {
    setDraft({
      workspaceName: watched.workspaceName,
      language: watched.language,
      currency: watched.currency,
      region: watched.region,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watched.workspaceName, watched.language, watched.currency, watched.region]);

  return (
    <form className="space-y-6 text-left" noValidate>
      {/* Header */}
      <div>
        <h3 className="text-sm font-bold text-neutral-800">Workspace Settings</h3>
        <p className="text-xs text-neutral-400 mt-0.5">
          Configure your workspace identity, regional preferences, notification rules, and default
          operational mode. These settings affect all team members in this workspace.
        </p>
      </div>

      {/* Workspace identity */}
      <SectionDivider label="Workspace Identity" />
      <FormField
        label="Workspace Name"
        id="workspaceName"
        placeholder="e.g. Sora Sushi — Delhi Operations"
        error={errors.workspaceName?.message}
        hint="Visible to all team members in the portal header"
        {...register('workspaceName')}
      />

      {/* Regional config */}
      <SectionDivider label="Regional Configuration" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Language */}
        <div className="flex flex-col gap-1">
          <label htmlFor="language" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
            Interface Language
          </label>
          <select
            id="language"
            {...register('language')}
            className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:ring-2 focus:ring-[#e35205]/20 focus:outline-none rounded-lg text-xs font-semibold text-neutral-800 cursor-pointer transition-all duration-150"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>

        {/* Currency */}
        <div className="flex flex-col gap-1">
          <label htmlFor="currency" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
            Display Currency
          </label>
          <select
            id="currency"
            {...register('currency')}
            className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:ring-2 focus:ring-[#e35205]/20 focus:outline-none rounded-lg text-xs font-semibold text-neutral-800 cursor-pointer transition-all duration-150"
          >
            {CURRENCIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Region */}
        <div className="flex flex-col gap-1">
          <label htmlFor="region" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
            Operating Region
          </label>
          <select
            id="region"
            {...register('region')}
            className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:ring-2 focus:ring-[#e35205]/20 focus:outline-none rounded-lg text-xs font-semibold text-neutral-800 cursor-pointer transition-all duration-150"
          >
            {REGIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Notifications */}
      <SectionDivider label="Notification Preferences" />
      <div className="rounded-xl border border-neutral-100 bg-neutral-50/40 px-4 divide-y divide-neutral-100">
        <ToggleRow
          label="New Order Alerts"
          description="Receive instant notifications when a new order is placed."
          checked={draft.notifyOrderNew}
          onChange={(val) => setDraftField('notifyOrderNew', val)}
        />
        <ToggleRow
          label="Order Status Updates"
          description="Notify team when order moves through kitchen and dispatch stages."
          checked={draft.notifyOrderStatus}
          onChange={(val) => setDraftField('notifyOrderStatus', val)}
        />
        <ToggleRow
          label="Customer Review Alerts"
          description="Get notified when customers leave ratings and written reviews."
          checked={draft.notifyReviews}
          onChange={(val) => setDraftField('notifyReviews', val)}
        />
      </div>

      {/* Operational mode */}
      <SectionDivider label="Default Operational Mode" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {MODE_OPTIONS.map((mode) => {
          const isActive = draft.operationalMode === mode.value;
          return (
            <button
              key={mode.value}
              type="button"
              onClick={() => setDraftField('operationalMode', mode.value as OperationalMode)}
              className={`text-left p-4 rounded-xl border-2 transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e35205]/30 ${
                isActive ? mode.color : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${
                  mode.value === 'online'  ? 'bg-emerald-500' :
                  mode.value === 'paused'  ? 'bg-amber-400' :
                  'bg-neutral-400'
                }`} />
                <span className="text-xs font-bold text-neutral-800">{mode.label}</span>
              </div>
              <p className="text-[10px] text-neutral-500 leading-relaxed">{mode.description}</p>
            </button>
          );
        })}
      </div>

      {/* Team visibility */}
      <SectionDivider label="Team Visibility" />
      <div className="flex flex-col gap-1">
        <label htmlFor="teamVisibility" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
          Who can see this workspace?
        </label>
        <select
          id="teamVisibility"
          value={draft.teamVisibility}
          onChange={(e) => setDraftField('teamVisibility', e.target.value as TeamVisibility)}
          className="w-full max-w-xs px-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:ring-2 focus:ring-[#e35205]/20 focus:outline-none rounded-lg text-xs font-semibold text-neutral-800 cursor-pointer transition-all duration-150"
        >
          <option value="all">All Team Members</option>
          <option value="managers-only">Managers & Owners Only</option>
          <option value="owner-only">Owner Only</option>
        </select>
        <p className="text-[9px] text-neutral-400">
          Controls which roles can access this restaurant's workspace configuration.
        </p>
      </div>
    </form>
  );
};

export default WorkspaceSettingsTab;
