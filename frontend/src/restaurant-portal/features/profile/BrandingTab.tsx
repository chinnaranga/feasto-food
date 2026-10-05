import React from 'react';
import { usePortalProfileStore } from '../../store/portalProfileStore';
import { UploadPlaceholder } from '../../components/ui/UploadPlaceholder';
import { ColorSwatchPicker } from '../../components/ui/ColorSwatchPicker';
import { SectionDivider } from '../../components/ui/SectionDivider';

// ─── Live Color Preview ───────────────────────────────────────────────────────
interface BrandColorPreviewProps {
  color: string;
  restaurantName: string;
}

const BrandColorPreview: React.FC<BrandColorPreviewProps> = ({ color, restaurantName }) => (
  <div className="flex flex-col gap-2">
    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
      Brand Color Preview
    </span>
    <div className="rounded-xl border border-neutral-200 p-5 bg-neutral-50/40 space-y-3">
      {/* Badge sample */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-sm"
          style={{ backgroundColor: color }}
        >
          {restaurantName.slice(0, 1).toUpperCase()}
        </div>
        <div>
          <p className="text-xs font-bold text-neutral-800">{restaurantName}</p>
          <p className="text-[9px] text-neutral-400">Brand identity preview</p>
        </div>
      </div>

      {/* Color pill */}
      <div className="flex items-center gap-2">
        <span
          className="text-[10px] font-bold text-white px-3 py-1 rounded-full shadow-sm"
          style={{ backgroundColor: color }}
        >
          Order Now
        </span>
        <span
          className="text-[10px] font-bold px-3 py-1 rounded-full border shadow-sm"
          style={{ borderColor: color, color: color }}
        >
          View Menu
        </span>
      </div>

      {/* Color bar */}
      <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: color }} />

      <p className="text-[9px] text-neutral-400">
        This color will be applied to buttons, badges, and accents in your public profile.
      </p>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const BrandingTab: React.FC = () => {
  const { draft, setDraftField } = usePortalProfileStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div>
        <h3 className="text-sm font-bold text-neutral-800">Branding & Visual Identity</h3>
        <p className="text-xs text-neutral-400 mt-0.5">
          Upload your logo and cover image, select your brand color, and preview how your business
          appears to customers on the Feasto platform.
        </p>
      </div>

      {/* Cover image */}
      <SectionDivider label="Cover Banner" />
      <UploadPlaceholder
        label="Restaurant Cover Image"
        hint="Recommended: 1200×400px — JPG or PNG, max 5MB. This is the first image customers see."
        aspectRatio="banner"
        previewUrl={draft.coverUrl}
        onUpload={(url) => setDraftField('coverUrl', url)}
        onClear={() => setDraftField('coverUrl', '')}
      />

      {/* Logo */}
      <SectionDivider label="Brand Logo" />
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <UploadPlaceholder
          label="Restaurant Logo"
          hint="Square format — 512×512px minimum, PNG with transparent background preferred."
          aspectRatio="square"
          previewUrl={draft.logoUrl}
          onUpload={(url) => setDraftField('logoUrl', url)}
          onClear={() => setDraftField('logoUrl', '')}
        />

        {/* Logo usage tips */}
        <div className="flex-1 space-y-3 pt-5">
          <div className="rounded-xl bg-neutral-50 border border-neutral-100 p-4 space-y-2.5">
            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-wider">
              Logo Guidelines
            </p>
            {[
              'Use a square transparent PNG for best results',
              'Minimum 512×512px for crisp display at all sizes',
              'Avoid logos with white or light backgrounds',
              'Your logo appears on listing cards, receipts, and notifications',
            ].map((tip) => (
              <div key={tip} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-[#e35205] mt-1.5 shrink-0" />
                <p className="text-[10px] text-neutral-500 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brand color */}
      <SectionDivider label="Brand Color" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-neutral-700">
            Select your primary brand color
          </p>
          <p className="text-[10px] text-neutral-400">
            This color is applied to action buttons and accent elements on your public profile.
          </p>
          <ColorSwatchPicker
            value={draft.brandColor}
            onChange={(color) => setDraftField('brandColor', color)}
          />
        </div>

        <BrandColorPreview
          color={draft.brandColor}
          restaurantName={draft.restaurantName}
        />
      </div>

      {/* Tagline re-edit */}
      <SectionDivider label="Tagline" />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="brandTagline" className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
          Public Tagline
        </label>
        <input
          id="brandTagline"
          type="text"
          value={draft.tagline}
          onChange={(e) => setDraftField('tagline', e.target.value)}
          maxLength={120}
          placeholder="e.g. Authentic Tokyo Sushi Experience"
          className="w-full px-3 py-2 bg-white border border-neutral-200 focus:border-[#e35205] focus:ring-2 focus:ring-[#e35205]/20 focus:outline-none rounded-lg text-xs text-neutral-800 transition-all duration-150 placeholder:text-neutral-400"
        />
        <div className="flex justify-between items-center">
          <p className="text-[9px] text-neutral-400">
            This tagline appears beneath your restaurant name on listing cards.
          </p>
          <span className="text-[9px] text-neutral-400">{draft.tagline.length} / 120</span>
        </div>
      </div>
    </div>
  );
};

export default BrandingTab;
