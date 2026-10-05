import React from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';

interface UploadPlaceholderProps {
  label: string;
  hint?: string;
  previewUrl?: string;
  aspectRatio?: 'square' | 'wide' | 'banner';
  onClear?: () => void;
  /** Called with a fake URL when user picks a file. In production wire to real upload. */
  onUpload?: (url: string) => void;
}

const ASPECT_CLASSES: Record<string, string> = {
  square: 'aspect-square max-w-[140px]',
  wide:   'aspect-video w-full',
  banner: 'aspect-[3/1] w-full',
};

export const UploadPlaceholder: React.FC<UploadPlaceholderProps> = ({
  label,
  hint,
  previewUrl,
  aspectRatio = 'wide',
  onClear,
  onUpload,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      // Create object URL for local preview
      const url = URL.createObjectURL(file);
      onUpload(url);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{label}</span>

      <div className={`relative rounded-xl overflow-hidden border-2 border-dashed transition-colors duration-200 ${ASPECT_CLASSES[aspectRatio]} ${previewUrl ? 'border-neutral-200' : 'border-neutral-200 bg-neutral-50 hover:border-[#e35205]/40 hover:bg-orange-50/30'}`}>
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt={label}
              className="w-full h-full object-cover"
            />
            {/* Overlay actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-1 bg-white text-neutral-800 text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <Upload size={11} />
                Change
              </button>
              {onClear && (
                <button
                  type="button"
                  onClick={onClear}
                  className="flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm hover:bg-red-700 transition-colors cursor-pointer"
                >
                  <X size={11} />
                  Remove
                </button>
              )}
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer group"
            aria-label={`Upload ${label}`}
          >
            <div className="w-8 h-8 rounded-lg bg-neutral-100 group-hover:bg-orange-100 flex items-center justify-center transition-colors duration-200">
              <ImageIcon size={15} className="text-neutral-400 group-hover:text-[#e35205] transition-colors duration-200" />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-neutral-500 group-hover:text-neutral-700">
                Click to upload
              </p>
              <p className="text-[9px] text-neutral-400">PNG, JPG, WEBP up to 5MB</p>
            </div>
          </button>
        )}
      </div>

      {hint && <p className="text-[9px] text-neutral-400">{hint}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleChange}
        aria-label={`Upload ${label} file`}
      />
    </div>
  );
};

export default UploadPlaceholder;
