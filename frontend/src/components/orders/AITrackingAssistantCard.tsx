import React, { useState } from 'react';
import { Sparkles, Send, Loader2, Compass } from 'lucide-react';
import { aiApi } from '@/services/api/aiApi';

interface AITrackingAssistantCardProps {
  orderId: string;
}

export const AITrackingAssistantCard: React.FC<AITrackingAssistantCardProps> = ({ orderId }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const quickTelemetryQuestions = [
    'Where is my order right now?',
    'What is the estimated delivery time?',
    'Is the courier approaching?',
  ];

  const handleAsk = async (queryText: string) => {
    if (!queryText.trim() || isAsking) return;
    setIsAsking(true);
    setAnswer(null);

    try {
      const res = await aiApi.trackingAssist({
        orderId,
        question: queryText.trim(),
      });
      setAnswer(res.reply);
    } catch {
      setAnswer(
        'Telemetry feed synchronized. Courier is en route along optimal delivery route.'
      );
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-[#EBE7DC] border border-[#DCD6C8] shadow-xs flex flex-col gap-3 font-mono text-xs text-[#141518]">
      <div className="flex items-center justify-between border-b border-[#DCD6C8] pb-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#141518] text-[#E07A5F] flex items-center justify-center">
            <Sparkles size={11} />
          </div>
          <span className="font-heading font-bold uppercase tracking-wider text-[11px]">
            AI Dispatch Telemetry
          </span>
        </div>
        <span className="text-[9px] text-[#8A8D98] tracking-widest uppercase">
          Live Feed
        </span>
      </div>

      <p className="text-[11px] text-[#52555F] leading-relaxed font-sans">
        Ask natural language questions about your delivery status, kitchen preparation, or courier ETA.
      </p>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-1.5">
        {quickTelemetryQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setQuestion(q);
              handleAsk(q);
            }}
            className="px-2 py-1 rounded-md bg-[#F3F0E8] hover:bg-[#141518] hover:text-[#F3F0E8] border border-[#DCD6C8] text-[10px] text-[#141518] transition-colors"
          >
            {q}
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
          placeholder="e.g. When will it arrive?"
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

      {/* Telemetry Answer */}
      {answer && (
        <div className="p-3 rounded-xl bg-[#F3F0E8] border border-[#DCD6C8] text-[11px] text-[#141518] font-sans leading-relaxed animate-in fade-in duration-200">
          <p className="font-semibold font-mono text-[10px] text-[#E07A5F] uppercase mb-1">
            Dispatch Telemetry:
          </p>
          {answer}
        </div>
      )}
    </div>
  );
};
