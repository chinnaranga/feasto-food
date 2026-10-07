import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Bike, Zap, ArrowRight } from 'lucide-react';
import { RiderButton } from '../../components/RiderUIComponents';

export const RiderAccountApprovedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F3F0E8] flex items-center justify-center p-4 sm:p-6 text-left selection:bg-[#D7F04A] selection:text-[#141518]">
      <div className="w-full max-w-md bg-[#FAF8F5] p-6 sm:p-8 border border-[#141518] shadow-[6px_6px_0px_#141518] space-y-6 text-center">
        {/* Approved Stamp */}
        <div className="w-16 h-16 bg-[#D7F04A] text-[#141518] border border-[#141518] shadow-[3px_3px_0px_#141518] flex items-center justify-center mx-auto">
          <CheckCircle2 size={36} strokeWidth={2.5} />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-2.5 py-0.5 bg-[#141518] text-[#D7F04A] text-[10px] font-mono font-black uppercase tracking-widest">
            AUTHENTICATION COMPLETE
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#141518] uppercase tracking-tight">
            PARTNER ACCOUNT APPROVED!
          </h2>
          <p className="text-xs text-[#55565B] max-w-xs mx-auto leading-relaxed font-sans">
            Congratulations. Your courier credential dossier has passed all compliance audits.
            You are now authorized to turn On Duty and receive priority food delivery offers.
          </p>
        </div>

        <div className="p-4 bg-[#F3F0E8] border border-[#141518] text-xs font-mono text-left space-y-1">
          <div className="flex justify-between text-[#55565B]">
            <span>COURIER IDENTIFIER:</span>
            <strong className="text-[#141518]">RDR-8802</strong>
          </div>
          <div className="flex justify-between text-[#55565B]">
            <span>HOME SECTOR:</span>
            <strong className="text-[#141518]">BANDRA WEST METRO</strong>
          </div>
          <div className="flex justify-between text-[#55565B]">
            <span>FLEET STATUS:</span>
            <strong className="text-[#10B981]">ACTIVE & DISPATCH-READY</strong>
          </div>
        </div>

        <RiderButton
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate('/rider/dashboard')}
        >
          ENTER DISPATCH CONSOLE →
        </RiderButton>
      </div>
    </div>
  );
};

export default RiderAccountApprovedPage;
