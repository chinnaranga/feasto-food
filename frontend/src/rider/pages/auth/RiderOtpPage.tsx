import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, PhoneCall, Lock, Key, Zap } from 'lucide-react';
import useRiderAuthStore from '../../store/useRiderAuthStore';
import { RiderButton, RiderPageHeader } from '../../components/RiderUIComponents';
import { OTPInput, VerificationStepper } from '../../components/auth/RiderAuthComponents';

export const RiderOtpPage: React.FC = () => {
  const navigate = useNavigate();
  const { phone, otpCode, setOtpCode, verifyOtp, setCurrentStep } = useRiderAuthStore();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    verifyOtp();
    setCurrentStep('identity');
    navigate('/rider/identity');
  };

  return (
    <div className="min-h-screen bg-[#F3F0E8] flex flex-col justify-between text-left py-4 sm:py-8 px-4 sm:px-6 selection:bg-[#D7F04A] selection:text-[#141518]">
      {/* Header Bar */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between pb-3 border-b border-[#141518]/15">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#141518] text-[#D7F04A] flex items-center justify-center font-mono font-black text-xs border border-[#141518]">
            FC
          </div>
          <span className="font-mono text-xs font-black uppercase tracking-wider text-[#141518]">
            FEASTO // COURIER REGISTRATION 2FA
          </span>
        </div>
        <Link
          to="/rider/login"
          className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#141518] hover:text-[#1B3BFF] underline underline-offset-4 decoration-[#D7F04A] decoration-2 transition-colors"
        >
          BACK TO COURIER LOGIN →
        </Link>
      </header>

      <div className="max-w-6xl mx-auto w-full space-y-6 my-auto py-4">
        <VerificationStepper currentStep="otp" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Onboarding Info Card */}
          <div className="hidden lg:flex lg:col-span-5 bg-[#141518] text-[#FAF8F5] border border-[#141518] shadow-[6px_6px_0px_#141518] p-8 flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D7F04A] text-[#141518] border border-[#141518] text-[10px] font-mono font-black uppercase tracking-widest shadow-[2px_2px_0px_#D7F04A]">
                <Lock size={11} className="fill-[#141518]" /> TWO-FACTOR AUTH PROTOCOL
              </span>
              <h2 className="text-3xl font-heading font-black leading-tight uppercase tracking-tight text-white">
                ENCRYPTED VESSEL IDENTIFICATION
              </h2>
              <p className="text-xs text-[#B0B1B6] leading-relaxed font-sans">
                Every Feasto dispatch courier requires strict device biometric and SMS 2FA verification to safeguard
                direct bank payout routing and prevent identity spoofing on the road.
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 bg-[#1E2025] border border-[#2B2E36] flex items-center gap-3.5">
                <div className="p-2 bg-[#D7F04A] text-[#141518] font-black">
                  <Key size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-[#8E929C] block uppercase">Security Level</span>
                  <strong className="text-white text-sm block">BANK-GRADE TOKEN AUTH</strong>
                </div>
              </div>

              <div className="p-3 bg-[#1E2025] border border-[#2B2E36] text-[11px] text-[#B0B1B6]">
                <span>SMS Dispatched via ISO 27001 Certified Gateways</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#2B2E36] flex items-center justify-between text-[11px] font-mono text-[#8E929C]">
              <span>DEVICE LOCK ACTIVE</span>
              <span>24/7 SUPPORT AVAILABLE</span>
            </div>
          </div>

          {/* Right Verification Card */}
          <div className="lg:col-span-7 bg-[#FAF8F5] p-6 sm:p-8 border border-[#141518] shadow-[6px_6px_0px_#141518] space-y-6">
            <form onSubmit={handleVerify} className="space-y-6">
              <RiderPageHeader
                title="Verify Courier Phone Number"
                subtitle={`Step 2 of 6: Enter the 6-digit one-time password dispatched to ${
                  phone || '+91 98765 43210'
                }.`}
              />

              <div className="py-2">
                <OTPInput value={otpCode} onChange={setOtpCode} />
              </div>

              <div className="p-3 bg-[#F3F0E8] border border-[#141518] text-center text-xs font-mono text-[#55565B] flex items-center justify-between">
                <span>DID NOT RECEIVE CODE?</span>
                <button
                  type="button"
                  className="font-black text-[#141518] uppercase underline underline-offset-4 decoration-[#D7F04A] decoration-2 hover:text-[#1B3BFF] cursor-pointer"
                >
                  RESEND SMS OTP (30S)
                </button>
              </div>

              <div className="pt-2">
                <RiderButton variant="primary" size="lg" fullWidth type="submit">
                  VERIFY TOKEN & PROCEED TO GOVERNMENT KYC →
                </RiderButton>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full flex items-center justify-between py-2 border-t border-[#141518]/15 font-mono text-[10px] text-[#55565B]">
        <span>FEASTO COURIER PARTNER ONBOARDING PIPELINE</span>
        <div className="flex items-center gap-3">
          <Link to="/rider/login" className="hover:text-[#141518] underline">
            ALREADY REGISTERED? LOGIN
          </Link>
          <span>STEP 2 OF 6</span>
        </div>
      </footer>
    </div>
  );
};

export default RiderOtpPage;
