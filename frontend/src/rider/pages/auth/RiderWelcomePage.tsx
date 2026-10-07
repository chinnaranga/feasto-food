import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bike, ShieldCheck, ArrowRight, Globe, Zap, Clock, Wallet } from 'lucide-react';
import useRiderAuthStore from '../../store/useRiderAuthStore';
import { RiderButton } from '../../components/RiderUIComponents';

export const RiderWelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, setCurrentStep } = useRiderAuthStore();

  const handleStartRegister = () => {
    setCurrentStep('register');
    navigate('/rider/register');
  };

  const handleSignIn = () => {
    setCurrentStep('otp');
    navigate('/rider/login');
  };

  return (
    <div className="min-h-screen bg-[#F3F0E8] flex flex-col justify-between p-4 sm:p-6 text-left selection:bg-[#D7F04A] selection:text-[#141518]">
      {/* Top Telemetry Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-2 border-b border-[#141518]/15">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#141518] text-[#D7F04A] flex items-center justify-center font-mono font-black text-xs border border-[#141518]">
            FC
          </div>
          <span className="font-mono text-xs font-black uppercase tracking-widest text-[#141518]">
            FEASTO // COURIER DISPATCH NETWORK
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#55565B] hidden sm:inline">
          PROTOCOL V2.4 · LIVE TELEMETRY
        </span>
      </header>

      {/* Main Welcome Card */}
      <main className="my-auto py-8">
        <div className="w-full max-w-md mx-auto bg-[#FAF8F5] p-6 sm:p-8 border border-[#141518] shadow-[6px_6px_0px_#141518] space-y-6">
          {/* Brand & Badge */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#D7F04A] border border-[#141518] text-[10px] font-mono font-black uppercase tracking-wider text-[#141518] shadow-[2px_2px_0px_#141518]">
                <Zap size={11} className="fill-[#141518]" /> HIGH-DEMAND NETWORK
              </span>
              <span className="font-mono text-[10px] text-[#55565B] uppercase">BANDRA / BKC METRO</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-heading font-black text-[#141518] uppercase tracking-tight leading-none">
                FEASTO COURIER
              </h1>
              <p className="text-xs sm:text-sm text-[#55565B] font-sans leading-relaxed mt-2">
                Deliver premium orders with India’s highest courier payout rates. Instant daily settlements,
                EV green bonuses & comprehensive ₹5L insurance cover.
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#141518]/15 font-mono">
            <div className="p-2 bg-[#F3F0E8] border border-[#141518]/20">
              <span className="text-[9px] uppercase text-[#55565B] block">AVG / WK</span>
              <strong className="text-xs font-black text-[#141518] block mt-0.5">₹12,450</strong>
            </div>
            <div className="p-2 bg-[#F3F0E8] border border-[#141518]/20">
              <span className="text-[9px] uppercase text-[#55565B] block">PAYOUT</span>
              <strong className="text-xs font-black text-[#141518] block mt-0.5">INSTANT</strong>
            </div>
            <div className="p-2 bg-[#F3F0E8] border border-[#141518]/20">
              <span className="text-[9px] uppercase text-[#55565B] block">COVER</span>
              <strong className="text-xs font-black text-[#141518] block mt-0.5">₹5,00,000</strong>
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#141518] flex items-center gap-1.5">
              <Globe size={13} />
              <span>Operating Language</span>
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#141518] text-xs font-mono font-bold text-[#141518] focus:outline-none focus:ring-1 focus:ring-[#141518] cursor-pointer shadow-[2px_2px_0px_#141518]"
            >
              <option value="English">English (Primary / Technical)</option>
              <option value="Hindi">हिंदी (Hindi)</option>
              <option value="Marathi">मराठी (Marathi)</option>
              <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
              <option value="Telugu">తెలుగు (Telugu)</option>
            </select>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <RiderButton variant="primary" size="lg" fullWidth onClick={handleStartRegister}>
              REGISTER AS COURIER PARTNER →
            </RiderButton>
            <RiderButton variant="outline" size="md" fullWidth onClick={handleSignIn}>
              EXISTING PARTNER LOGIN (SMS 2FA)
            </RiderButton>
          </div>
        </div>
      </main>

      {/* Footer Audit */}
      <footer className="max-w-4xl mx-auto w-full flex items-center justify-between py-3 border-t border-[#141518]/15 font-mono text-[10px] text-[#55565B]">
        <span>FEASTO LOGISTICS CORP · INDIA</span>
        <span>ZERO COMMISSION COURIER TIERS</span>
      </footer>
    </div>
  );
};

export default RiderWelcomePage;
