import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, PhoneCall, Lock } from 'lucide-react';
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
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col text-left py-4 sm:py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto w-full space-y-6 my-auto">
        <VerificationStepper currentStep="otp" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Onboarding Info Card */}
          <div className="hidden lg:flex lg:col-span-5 bg-neutral-900 text-white rounded-3xl p-8 flex-col justify-between space-y-8 shadow-xl">
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                Secure Authentication
              </span>
              <h2 className="text-2xl font-black font-heading leading-tight">
                Two-Factor Account Authentication
              </h2>
              <p className="text-xs text-neutral-300 leading-relaxed">
                We verify every courier's mobile identity with SMS 2FA to ensure secure payouts and account protection.
              </p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Lock size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase">Encrypted Session</span>
                  <strong className="text-white text-sm block">Bank-Grade Token Auth</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
              <span>Feasto Courier Protocol</span>
              <span>Need help? Contact SOS</span>
            </div>
          </div>

          {/* Right Verification Card */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-modal space-y-6">
            <form onSubmit={handleVerify} className="space-y-6">
              <RiderPageHeader
                title="Verify Mobile Number"
                subtitle={`Step 2 of 5: Enter the 6-digit OTP code sent to ${phone || '+91 98765 43210'}.`}
              />

              <div className="py-2">
                <OTPInput value={otpCode} onChange={setOtpCode} />
              </div>

              <div className="text-center text-xs text-neutral-500 font-mono">
                Didn't receive OTP?{' '}
                <button type="button" className="text-[#e35205] font-bold hover:underline cursor-pointer">
                  Resend OTP Code (30s)
                </button>
              </div>

              <div className="pt-2">
                <RiderButton variant="primary" size="lg" fullWidth type="submit">
                  Verify & Proceed to Identity Check →
                </RiderButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderOtpPage;
