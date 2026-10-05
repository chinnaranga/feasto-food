import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquareText, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const ContactSupportCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-brand-orange/[0.02] to-brand-accent/[0.01] bg-primary-bg border border-border-main rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-soft text-left">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-2 bg-brand-orange/5 border border-brand-orange/15 rounded-xl text-brand-orange">
            <MessageSquareText size={18} />
          </span>
          <div className="flex items-center gap-1 bg-brand-orange/5 border border-brand-orange/15 px-2 py-0.5 rounded-full text-[9px] font-extrabold text-brand-orange uppercase tracking-wide">
            <Sparkles size={10} />
            <span>AI Router Enabled</span>
          </div>
        </div>
        <h3 className="font-extrabold text-base text-text-primary tracking-tight mb-1">
          Still need assistance?
        </h3>
        <p className="text-xs text-text-secondary leading-relaxed max-w-xl">
          Submit a support request. Our smart ticketing system automatically matches your query with the right technical agent or processes simple refund requests instantly.
        </p>
      </div>

      <Button
        variant="primary"
        size="md"
        onClick={() => navigate('/support/contact')}
        className="rounded-xl text-xs font-bold px-6 shrink-0 flex items-center gap-2"
      >
        <span>Submit a Ticket</span>
        <ArrowRight size={14} />
      </Button>
    </div>
  );
};
