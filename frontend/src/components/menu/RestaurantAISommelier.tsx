import React, { useState } from 'react';
import { Sparkles, Send, Loader2, HelpCircle } from 'lucide-react';
import { aiApi } from '@/services/api/aiApi';

interface RestaurantAISommelierProps {
  restaurantId: string;
  restaurantName: string;
}

export const RestaurantAISommelier: React.FC<RestaurantAISommelierProps> = ({
  restaurantId,
  restaurantName,
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const quickPrompts = [
    'What is 100% vegetarian?',
    'What is the spiciest dish?',
    'Best meal under ₹500?',
  ];

  const handleAsk = async (queryText: string) => {
    if (!queryText.trim() || isAsking) return;
    setIsAsking(true);
    setAnswer(null);

    try {
      const res = await aiApi.restaurantAssist({
        restaurantId,
        question: queryText.trim(),
      });
      setAnswer(res.answer);
    } catch {
      setAnswer(
        'Our kitchen sommelier is verifying ingredients right now. Please browse the item details or ask our staff!'
      );
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-[#EBE7DC] border border-[#DCD6C8] shadow-xs flex flex-col gap-3 font-mono text-xs text-[#141518]">
      <div className="flex items-center justify-between border-b border-[#DCD6C8] pb-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#141518] text-[#F3F0E8] flex items-center justify-center">
            <Sparkles size={11} className="text-[#E07A5F]" />
          </div>
          <span className="font-heading font-bold uppercase tracking-wider text-[11px]">
            Menu Sommelier
          </span>
        </div>
        <span className="text-[9px] text-[#8A8D98] tracking-widest uppercase">
          AI Verified
        </span>
      </div>

      <p className="text-[11px] text-[#52555F] leading-relaxed font-sans">
        Ask questions about ingredients, spice profiles, or dietary details for {restaurantName}.
      </p>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-1.5">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setQuestion(p);
              handleAsk(p);
            }}
            className="px-2 py-1 rounded-md bg-[#F3F0E8] hover:bg-[#141518] hover:text-[#F3F0E8] border border-[#DCD6C8] text-[10px] text-[#141518] transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(question);
        }}
        className="flex items-center gap-1.5 mt-1"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. Is it cooked in butter?"
          className="flex-grow px-2.5 py-1.5 rounded-lg bg-[#F3F0E8] text-[#141518] placeholder-[#8A8D98] border border-[#DCD6C8] text-[11px] focus:outline-none focus:border-[#141518]"
        />
        <button
          type="submit"
          disabled={!question.trim() || isAsking}
          className="p-1.5 rounded-lg bg-[#141518] hover:bg-[#2A2C32] disabled:opacity-40 text-[#F3F0E8] transition-colors"
          aria-label="Submit Question"
        >
          {isAsking ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
        </button>
      </form>

      {/* Answer Box */}
      {answer && (
        <div className="p-3 rounded-xl bg-[#F3F0E8] border border-[#DCD6C8] text-[11px] text-[#141518] font-sans leading-relaxed animate-in fade-in duration-200">
          <p className="font-semibold font-mono text-[10px] text-[#E07A5F] uppercase mb-1">
            Kitchen Verification:
          </p>
          {answer}
        </div>
      )}
    </div>
  );
};
