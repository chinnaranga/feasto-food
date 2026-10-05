import React from 'react';
import { ShieldCheck, Cookie, Sliders, ExternalLink } from 'lucide-react';
import { usePrivacyConsent } from '../../hooks/security/usePrivacyConsent';
import { COOKIE_CATEGORIES_CONFIG } from '../../types/privacyConsent';
import { ConsentStatusBadge } from './ConsentStatusBadge';
import { Button } from '../ui/Button';

export const PrivacyPreferencesPanel: React.FC = () => {
  const {
    consent,
    openPreferencesModal,
  } = usePrivacyConsent();

  const activeCategoriesCount = [
    consent.necessary,
    consent.functional,
    consent.analytics,
    consent.personalization,
    consent.marketing,
  ].filter(Boolean).length;

  return (
    <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs flex flex-col text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2">
            <Cookie size={18} className="text-brand-orange" />
            <h3 className="text-sm font-extrabold text-neutral-900 tracking-tight font-heading">
              Privacy & Cookie Preferences
            </h3>
          </div>
          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
            Configure how Feasto uses cookies, analytics, personalization, and marketing tags across your devices.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={openPreferencesModal}
          className="rounded-xl text-xs font-bold px-4 py-2 flex items-center gap-2 border-neutral-300 text-neutral-800 hover:bg-neutral-50 shrink-0 shadow-2xs"
        >
          <Sliders size={13} className="text-brand-orange" />
          <span>Manage Preferences</span>
        </Button>
      </div>

      {/* Categories Status Overview */}
      <div className="space-y-3">
        {COOKIE_CATEGORIES_CONFIG.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between gap-4 p-3.5 border border-neutral-100 rounded-xl bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900">{cat.title}</span>
                <ConsentStatusBadge
                  isAlwaysActive={cat.isStrictlyNecessary}
                  isActive={consent[cat.id]}
                />
              </div>
              <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                {cat.shortDescription}
              </p>
            </div>

            <button
              type="button"
              onClick={openPreferencesModal}
              className="text-[11px] font-bold text-brand-orange hover:underline shrink-0 cursor-pointer"
            >
              Configure
            </button>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-5 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-neutral-400">
        <span>{activeCategoriesCount} of 5 Categories Active</span>
        {consent.updatedAt && (
          <span>
            Last updated: {new Date(consent.updatedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </span>
        )}
      </div>
    </div>
  );
};

export default PrivacyPreferencesPanel;
