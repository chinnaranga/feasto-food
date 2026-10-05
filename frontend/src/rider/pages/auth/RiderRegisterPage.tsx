import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Wallet, Award, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col text-left py-4 sm:py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto w-full space-y-6 my-auto">
        <VerificationStepper currentStep="register" />

        {/* 2-Column Split Layout on Desktop (lg:grid-cols-12) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Onboarding Showcase Panel (Visible on lg: screens) */}
          <div className="hidden lg:flex lg:col-span-5 bg-neutral-900 text-white rounded-3xl p-8 flex-col justify-between space-y-8 relative overflow-hidden shadow-xl">
            <div className="space-y-4 relative z-10">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#e35205] uppercase bg-[#e35205]/10 px-3 py-1 rounded-full border border-[#e35205]/30">
                Feasto Delivery Network
              </span>
              <h2 className="text-2xl font-black font-heading leading-tight">
                Become a High-Earning Feasto Delivery Partner
              </h2>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Join thousands of verified couriers delivering top food orders across Mumbai, Delhi, Bengaluru & Hyderabad with 100% daily payouts.
              </p>
            </div>

            <div className="space-y-4 relative z-10 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Wallet size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase">Average Earnings</span>
                  <strong className="text-white text-sm block">₹12,450 / Week</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase">Security & Insurance</span>
                  <strong className="text-white text-sm block">₹5,00,000 Accidental Cover</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
              <span>Instant Bank Transfers</span>
              <span>Flexible Shift Times</span>
            </div>
          </div>

          {/* Right Form Card Panel */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-modal space-y-6">
            <RiderPageHeader
              title="Personal & Partner Details"
              subtitle="Step 1 of 5: Fill in your legal details to create your courier account."
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
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="arjun@email.com"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RiderInput
                  label="Date of Birth"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />

                <div className="space-y-1 text-left w-full">
                  <label className="text-xs font-bold text-neutral-700 block">Primary Operating City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-900 focus:outline-none focus:border-neutral-400"
                  >
                    <option value="Mumbai">Mumbai (Bandra / Andheri)</option>
                    <option value="New Delhi">New Delhi (CP / Connaught)</option>
                    <option value="Bengaluru">Bengaluru (Koramangala)</option>
                    <option value="Hyderabad">Hyderabad (Hitech City)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <RiderButton variant="primary" size="lg" fullWidth type="submit">
                  Continue to Phone OTP Verification →
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
