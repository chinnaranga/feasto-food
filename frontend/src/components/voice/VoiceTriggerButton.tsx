import React from 'react';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import { useVoiceStore } from '@/store/voiceStore';

interface VoiceTriggerButtonProps {
  variant?: 'floating' | 'inline' | 'compact';
  label?: string;
  className?: string;
}

export const VoiceTriggerButton: React.FC<VoiceTriggerButtonProps> = ({
  variant = 'compact',
  label = 'Voice',
  className = '',
}) => {
  const { openVoice, state, isOpen } = useVoiceStore();

  if (variant === 'floating') {
    return (
      <motion.button
        type="button"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={openVoice}
        aria-label="Activate Feasto Real-Time Voice"
        className={`fixed bottom-20 left-6 z-[600] flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#161820]/95 backdrop-blur-md text-[#FAF8F5] shadow-lg shadow-black/50 border border-white/10 hover:border-[#E07A5F]/50 transition-all cursor-pointer group ${className}`}
      >
        <span className="relative flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-[#E07A5F] group-hover:animate-ping absolute opacity-75" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F]" />
        </span>
        <Mic size={14} className="text-[#E07A5F]" />
        <span className="text-xs font-semibold font-sans tracking-wide">
          Feasto Voice
        </span>
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono rounded bg-white/10 text-[#A7ACB8] border border-white/10">
          ⌘M
        </kbd>
      </motion.button>
    );
  }

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={openVoice}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#FAF8F5] border border-white/10 hover:border-[#E07A5F]/40 transition-all cursor-pointer ${className}`}
      >
        <Mic size={13} className="text-[#E07A5F]" />
        <span>{label}</span>
        <kbd className="text-[10px] font-mono text-[#A7ACB8]">⌘M</kbd>
      </button>
    );
  }

  // Compact icon button (ideal for search bars & navbars)
  return (
    <button
      type="button"
      onClick={openVoice}
      title="Speak with Feasto Voice (⌘M)"
      aria-label="Activate Voice Assistant"
      className={`p-2 rounded-xl text-[#A7ACB8] hover:text-[#FAF8F5] hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer ${
        isOpen ? 'bg-[#E07A5F]/20 text-[#E07A5F]' : ''
      } ${className}`}
    >
      <Mic size={15} />
    </button>
  );
};
