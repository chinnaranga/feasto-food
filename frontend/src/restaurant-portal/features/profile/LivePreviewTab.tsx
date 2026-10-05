import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed, Bike, ShoppingBag, Globe, AlertCircle, CheckCircle2, Clock, ArrowRight
} from 'lucide-react';
import { usePortalProfileStore } from '../../store/portalProfileStore';
import { PublishReadyBadge } from '../../components/ui/PublishReadyBadge';

// ─── Service Badge ────────────────────────────────────────────────────────────
interface ServiceBadgeProps { label: string; icon: React.ReactNode; active: boolean }

const ServiceBadge: React.FC<ServiceBadgeProps> = ({ label, icon, active }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold ${
    active
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : 'bg-neutral-50 text-neutral-400 border-neutral-200 line-through'
  }`}>
    {icon}
    {label}
  </span>
);

// ─── Missing Field Row ────────────────────────────────────────────────────────
interface MissingFieldRowProps { label: string; tabPath: string }

const MissingFieldRow: React.FC<MissingFieldRowProps> = ({ label, tabPath }) => {
  const navigate = useNavigate();

  return (
    <li className="flex items-center justify-between gap-3 py-2 border-b border-neutral-100 last:border-0">
      <div className="flex items-center gap-2">
        <AlertCircle size={11} className="text-amber-500 shrink-0" />
        <span className="text-[11px] text-neutral-600 font-medium">Add {label}</span>
      </div>
      <button
        type="button"
        onClick={() => navigate(tabPath)}
        className="flex items-center gap-1 text-[10px] font-bold text-[#e35205] hover:text-[#c94804] transition-colors cursor-pointer"
      >
        Complete <ArrowRight size={10} />
      </button>
    </li>
  );
};

// ─── Publish Button ───────────────────────────────────────────────────────────
interface PublishButtonProps {
  score: number;
  isPublished: boolean;
  onPublish: () => void;
}

const PublishButton: React.FC<PublishButtonProps> = ({ score, isPublished, onPublish }) => {
  const isReady = score === 100;

  if (isPublished && isReady) {
    return (
      <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
        <div>
          <p className="text-xs font-bold text-emerald-800">Profile is Live</p>
          <p className="text-[10px] text-emerald-600">
            Your restaurant is visible on all Feasto customer catalogs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={!isReady}
      onClick={onPublish}
      className={`w-full py-2.5 rounded-xl text-xs font-black transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e35205]/30 ${
        isReady
          ? 'bg-[#e35205] hover:bg-[#c94804] text-white shadow-sm cursor-pointer'
          : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
      }`}
    >
      {isReady ? 'Publish Profile' : `Complete profile to publish (${score}%)`}
    </button>
  );
};

// ─── Tab → Path mapping for missing fields ────────────────────────────────────
const FIELD_TAB_MAP: Record<string, string> = {
  'Restaurant Name':        '/restaurant-portal/profile',
  'Brand Tagline':          '/restaurant-portal/profile',
  'Cuisine Type':           '/restaurant-portal/profile',
  'Profile Description':    '/restaurant-portal/profile',
  'Brand Logo Photo':       '/restaurant-portal/profile/branding',
  'Cover Image Banner':     '/restaurant-portal/profile/branding',
  'GST / Tax ID':           '/restaurant-portal/profile/business',
  'Physical Address':       '/restaurant-portal/profile/location',
  'Business Contact Email': '/restaurant-portal/profile/business',
  'Business Contact Phone': '/restaurant-portal/profile/business',
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const LivePreviewTab: React.FC = () => {
  const { draft, getCompleteness, publishProfile } = usePortalProfileStore();
  const { score, missing } = getCompleteness();

  const publishStatus = draft.isPublished && score === 100 ? 'live' : score === 100 ? 'ready' : 'draft';

  const dayAbbrev = (day: string) => day.slice(0, 3);
  const openDays = draft.openingHours.filter((h) => !h.isClosed);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-800">Public Profile Preview</h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            This is how your restaurant appears to customers on Feasto. Completing all sections unlocks your public listing.
          </p>
        </div>
        <PublishReadyBadge status={publishStatus} />
      </div>

      {/* Preview card */}
      <div className="rounded-2xl border border-neutral-200 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        {/* Cover */}
        {draft.coverUrl ? (
          <div className="aspect-[3/1] w-full overflow-hidden">
            <img src={draft.coverUrl} alt="Cover" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="aspect-[3/1] w-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
            <p className="text-[10px] font-semibold text-neutral-400">Cover image not set</p>
          </div>
        )}

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Logo + name row */}
          <div className="flex items-start gap-3">
            {draft.logoUrl ? (
              <img
                src={draft.logoUrl}
                alt="Logo"
                className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0 shadow-sm"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0 shadow-sm"
                style={{ backgroundColor: draft.brandColor }}
              >
                {draft.restaurantName.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="text-sm font-black text-neutral-900">{draft.restaurantName || '—'}</h4>
              <p className="text-[10px] text-neutral-500 mt-0.5">{draft.cuisineType || '—'}</p>
              {draft.tagline && (
                <p className="text-[11px] text-neutral-600 italic mt-0.5">"{draft.tagline}"</p>
              )}
            </div>
          </div>

          {/* Description */}
          {draft.description ? (
            <p className="text-[11px] text-neutral-600 leading-relaxed line-clamp-3">
              {draft.description}
            </p>
          ) : (
            <p className="text-[11px] text-neutral-400 italic">No description provided</p>
          )}

          {/* Service badges */}
          <div className="flex flex-wrap gap-2">
            <ServiceBadge label="Dine-In"  icon={<UtensilsCrossed size={10} />} active={draft.dineIn} />
            <ServiceBadge label="Takeaway" icon={<ShoppingBag size={10} />}     active={draft.takeaway} />
            <ServiceBadge label="Delivery" icon={<Bike size={10} />}            active={draft.delivery} />
          </div>

          {/* Prep time + location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-neutral-50 border border-neutral-100 p-3">
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Prep Time</p>
              <p className="text-xs font-black text-neutral-800">{draft.prepTimeMin}–{draft.prepTimeMax} min</p>
            </div>
            <div className="rounded-xl bg-neutral-50 border border-neutral-100 p-3">
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Location</p>
              <p className="text-xs font-black text-neutral-800">{draft.city || '—'}, {draft.country || '—'}</p>
            </div>
          </div>

          {/* Hours summary */}
          {openDays.length > 0 && (
            <div className="rounded-xl bg-neutral-50 border border-neutral-100 p-3">
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Clock size={9} />
                Opening Hours
              </p>
              <div className="flex flex-wrap gap-1">
                {openDays.map((h) => (
                  <span key={h.day} className="text-[9px] font-semibold text-neutral-600 bg-white border border-neutral-200 px-1.5 py-0.5 rounded">
                    {dayAbbrev(h.day)} {h.open}–{h.close}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Visibility */}
          <div className="flex items-center gap-1.5">
            <Globe size={11} className={draft.isVisible ? 'text-emerald-500' : 'text-neutral-400'} />
            <span className={`text-[10px] font-semibold ${draft.isVisible ? 'text-emerald-600' : 'text-neutral-400'}`}>
              {draft.isVisible ? 'Publicly visible on Feasto' : 'Hidden from search results'}
            </span>
          </div>
        </div>
      </div>

      {/* Completeness + missing fields */}
      <div className="rounded-xl border border-neutral-200 p-5 space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-700">Profile completeness</span>
            <span className={`text-xs font-black ${score === 100 ? 'text-emerald-600' : 'text-[#e35205]'}`}>
              {score}%
            </span>
          </div>
          <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${score === 100 ? 'bg-emerald-500' : 'bg-[#e35205]'}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Missing list */}
        {missing.length > 0 ? (
          <div>
            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Remaining to complete:
            </p>
            <ul className="space-y-0">
              {missing.map((item) => (
                <MissingFieldRow
                  key={item}
                  label={item}
                  tabPath={FIELD_TAB_MAP[item] ?? '/restaurant-portal/profile'}
                />
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
            <p className="text-[10px] text-emerald-700 font-semibold">
              All required fields are complete. Your profile is ready to publish.
            </p>
          </div>
        )}

        {/* Publish CTA */}
        <PublishButton
          score={score}
          isPublished={draft.isPublished}
          onPublish={publishProfile}
        />
      </div>
    </div>
  );
};

export default LivePreviewTab;
