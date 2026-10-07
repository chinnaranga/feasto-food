import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Wallet, Award, ArrowRight, Zap, Check } from 'lucide-react';
import useRiderAuthStore from '../../store/useRiderAuthStore';
import { RiderButton, RiderInput, RiderPageHeader } from '../../components/RiderUIComponents';
import { VerificationStepper } from '../../components/auth/RiderAuthComponents';

export const RiderRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { registrationData, updateRegistrationData, setCurrentStep, setPhone } = useRiderAuthStore();

  const [fullName, setFullName] = useState(registrationData.fullName || '');
  const [phoneInput, setPhoneInput] = useState(registrationData.phone || '');
  const [email, setEmail] = useState(registrationData.email || '');
  const [dob, setDob] = useState(registrationData.dateOfBirth || '');
  const [city, setCity] = useState(registrationData.city || 'Mumbai');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneInput) return;

    updateRegistrationData({
      fullName,
      phone: phoneInput,
      email,
      dateOfBirth: dob,
      city,
    });
    setPhone(phoneInput);
    setCurrentStep('otp');
    navigate('/rider/otp');
  };

  return (
    <div className="min-h-screen bg-[#F3F0E8] flex flex-col text-left py-4 sm:py-8 px-4 sm:px-6 selection:bg-[#D7F04A] selection:text-[#141518]">
      <div className="max-w-6xl mx-auto w-full space-y-6 my-auto">
        <VerificationStepper currentStep="register" />

        {/* 2-Column Split Layout on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Onboarding Showcase Panel */}
          <div className="hidden lg:flex lg:col-span-5 bg-[#141518] text-[#FAF8F5] border border-[#141518] shadow-[6px_6px_0px_#141518] p-8 flex-col justify-between space-y-8 relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D7F04A] text-[#141518] border border-[#141518] text-[10px] font-mono font-black uppercase tracking-widest shadow-[2px_2px_0px_#D7F04A]">
                <Zap size={11} className="fill-[#141518]" /> FEASTO DISPATCH FLEET
              </span>
              <h2 className="text-3xl font-heading font-black leading-tight uppercase tracking-tight text-white">
                JOIN THE ELITE METRO COURIER FLEET
              </h2>
              <p className="text-xs text-[#B0B1B6] leading-relaxed font-sans">
                Deliver high-ticket gourmet orders across Mumbai, Delhi, Bengaluru & Hyderabad with 100% daily
                direct deposits, guaranteed order surge bonuses, and ₹5,00,000 accidental cover.
              </p>
            </div>

            <div className="space-y-3 relative z-10 font-mono text-xs">
              <div className="p-4 bg-[#1E2025] border border-[#2B2E36] flex items-center gap-3.5">
                <div className="p-2 bg-[#D7F04A] text-[#141518] font-black">
                  <Wallet size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-[#8E929C] block uppercase">Average Courier Income</span>
                  <strong className="text-white text-sm block font-mono">₹12,450 / WEEK + TIPS</strong>
                </div>
              </div>

              <div className="p-4 bg-[#1E2025] border border-[#2B2E36] flex items-center gap-3.5">
                <div className="p-2 bg-[#1B3BFF] text-white font-black">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-[#8E929C] block uppercase">Comprehensive Security</span>
                  <strong className="text-white text-sm block font-mono">₹5,00,000 ACCIDENTAL COVER</strong>
                </div>
              </div>

              <div className="p-3 bg-[#1E2025] border border-[#2B2E36] text-[11px] text-[#B0B1B6] space-y-1">
                <div className="flex items-center gap-1.5">
                  <Check size={13} className="text-[#D7F04A]" />
                  <span>Instant UPI Bank Settlement Every 24 Hours</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={13} className="text-[#D7F04A]" />
                  <span>Extra ₹15 / Trip for Electric Vehicle Partners</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#2B2E36] flex items-center justify-between text-[11px] font-mono text-[#8E929C]">
              <span>ZERO SIGNUP FEES</span>
              <span>SAME-DAY APPROVAL</span>
            </div>
          </div>

          {/* Right Form Card Panel */}
          <div className="lg:col-span-7 bg-[#FAF8F5] p-6 sm:p-8 border border-[#141518] shadow-[6px_6px_0px_#141518] space-y-6">
            <RiderPageHeader
              title="Courier Partner Registration"
              subtitle="Step 1 of 6: Provide your legal identity and mobile number to open your dispatch vessel account."
            />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RiderInput
                  label="Full Legal Name *"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Arjun Kumar"
                />

                <RiderInput
                  label="Mobile Phone Number *"
                  type="tel"
                  required
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>

              <RiderInput
                label="Email Address (For Tax Invoices)"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="arjun.courier@feasto.food"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RiderInput
                  label="Date of Birth (KYC Standard)"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />

                <div className="space-y-1 text-left w-full">
                  <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#141518] block">
                    Operating Metro Zone
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#141518] text-xs font-mono font-bold text-[#141518] focus:outline-none focus:ring-1 focus:ring-[#141518] shadow-[2px_2px_0px_#141518]"
                  >
                    <option value="Mumbai">Mumbai (Bandra West / BKC / Andheri)</option>
                    <option value="New Delhi">New Delhi (CP / Saket / Gurugram)</option>
                    <option value="Bengaluru">Bengaluru (Koramangala / Indiranagar)</option>
                    <option value="Hyderabad">Hyderabad (Hitech City / Jubilee Hills)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <RiderButton variant="primary" size="lg" fullWidth type="submit">
                  CONTINUE TO PHONE 2FA VERIFICATION →
                </RiderButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderRegisterPage;
