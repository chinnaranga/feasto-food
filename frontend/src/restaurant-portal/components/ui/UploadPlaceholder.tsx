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
      const url = URL.createObjectURL(file);
      onUpload(url);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full text-left font-mono">
      <span className="text-[10px] font-bold text-[#52555F] uppercase tracking-wider">{label}</span>

      <div
        className={`relative overflow-hidden border-2 border-dashed transition-colors duration-200 ${ASPECT_CLASSES[aspectRatio]} ${
          previewUrl
            ? 'border-[#141518]/30 bg-[#FAF8F5]'
            : 'border-[#141518]/25 bg-[#FAF8F5] hover:border-[#141518] hover:bg-[#F3F0E8]'
        }`}
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt={label}
              className="w-full h-full object-cover"
            />
            {/* Overlay actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-1 bg-[#FAF8F5] text-[#141518] text-[10px] font-mono font-bold px-2.5 py-1.5 border border-[#141518] shadow-[2px_2px_0px_#141518] hover:bg-[#D7F04A] transition-colors cursor-pointer"
              >
                <Upload size={11} />
                Change
              </button>
              {onClear && (
                <button
                  type="button"
                  onClick={onClear}
                  className="p-1.5 bg-[#991B1B] text-white hover:bg-red-700 transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 cursor-pointer group"
          >
            <div className="w-10 h-10 border border-[#141518]/20 bg-[#FAF8F5] group-hover:bg-[#141518] group-hover:text-[#D7F04A] text-[#141518] flex items-center justify-center transition-colors">
              <Upload size={16} />
            </div>
            <div className="text-center">
              <span className="text-xs font-mono font-bold text-[#141518] block group-hover:underline">
                Upload image
              </span>
              <span className="text-[9px] font-mono text-[#52555F] block mt-0.5">
                {hint || 'PNG, JPG, or WEBP up to 5MB'}
              </span>
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default UploadPlaceholder;
