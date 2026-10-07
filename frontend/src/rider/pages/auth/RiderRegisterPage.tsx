import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Wallet,
  Award,
  ArrowRight,
  Zap,
  Check,
  Bike,
  Sparkles,
  PhoneCall,
  UserCheck,
} from 'lucide-react';
import useRiderAuthStore from '../../store/useRiderAuthStore';
import { RiderButton, RiderInput, RiderPageHeader } from '../../components/RiderUIComponents';
import { VerificationStepper } from '../../components/auth/RiderAuthComponents';

export const RiderRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { registrationData, updateRegistrationData, setCurrentStep, setPhone, updateVehicleData } =
    useRiderAuthStore();

  const [fullName, setFullName] = useState(registrationData.fullName || '');
  const [phoneInput, setPhoneInput] = useState(registrationData.phone || '');
  const [email, setEmail] = useState(registrationData.email || '');
  const [dob, setDob] = useState(registrationData.dateOfBirth || '');
  const [city, setCity] = useState(registrationData.city || 'Mumbai');
  const [vehicleType, setVehicleType] = useState<'scooter_ev' | 'motorbike' | 'bicycle'>('scooter_ev');
  const [emergencyPhone, setEmergencyPhone] = useState(registrationData.emergencyContactPhone || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneInput) return;

    updateRegistrationData({
      fullName,
      phone: phoneInput,
      email,
      dateOfBirth: dob,
      city,
      emergencyContactPhone: emergencyPhone,
    });
    updateVehicleData({
      vehicleType,
    });
    setPhone(phoneInput);
    setCurrentStep('otp');
    navigate('/rider/otp');
  };

  return (
    <div className="min-h-screen bg-[#F3F0E8] flex flex-col justify-between py-4 sm:py-8 px-4 sm:px-6 text-left selection:bg-[#D7F04A] selection:text-[#141518]">
      {/* Top Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between pb-3 border-b border-[#141518]/15">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#141518] text-[#D7F04A] flex items-center justify-center font-mono font-black text-xs border border-[#141518]">
            FC
          </div>
          <span className="font-mono text-xs font-black uppercase tracking-wider text-[#141518]">
            FEASTO // COURIER PARTNER ONBOARDING
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#55565B] uppercase hidden sm:inline">ALREADY ACTIVE?</span>
          <Link
            to="/rider/login"
            className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#141518] hover:text-[#1B3BFF] underline underline-offset-4 decoration-[#D7F04A] decoration-2 transition-colors"
          >
            SIGN IN TO DISPATCH CONSOLE →
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto w-full space-y-6 my-auto py-4">
        {/* Step Indicator */}
        <VerificationStepper currentStep="register" />

        {/* 2-Column Split Layout on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Onboarding Showcase Panel */}
          <div className="hidden lg:flex lg:col-span-5 bg-[#141518] text-[#FAF8F5] border border-[#141518] shadow-[6px_6px_0px_#141518] p-8 flex-col justify-between space-y-8 relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D7F04A] text-[#141518] border border-[#141518] text-[10px] font-mono font-black uppercase tracking-widest shadow-[2px_2px_0px_#D7F04A]">
                <Zap size={11} className="fill-[#141518]" /> FEASTO DISPATCH FLEET
              </span>
              <h1 className="text-3xl font-heading font-black leading-tight uppercase tracking-tight text-white">
                JOIN THE ELITE METRO COURIER FLEET
              </h1>
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

              <div className="p-3 bg-[#1E2025] border border-[#2B2E36] text-[11px] text-[#B0B1B6] space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Check size={13} className="text-[#D7F04A]" />
                  <span>Instant UPI Bank Settlement Every 24 Hours</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={13} className="text-[#D7F04A]" />
                  <span>Extra ₹15 / Trip for Electric Vehicle Partners</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={13} className="text-[#D7F04A]" />
                  <span>Zero commission deduction on customer tips</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#2B2E36] flex items-center justify-between text-[11px] font-mono text-[#8E929C]">
              <span>ZERO SIGNUP FEES</span>
              <span>SAME-DAY ONBOARDING</span>
            </div>
          </div>

          {/* Right Form Card Panel: Dedicated Registration */}
          <div className="lg:col-span-7 bg-[#FAF8F5] p-6 sm:p-8 border border-[#141518] shadow-[6px_6px_0px_#141518] space-y-6">
            {/* Header Switcher */}
            <div className="p-3 bg-[#F3F0E8] border border-[#141518] flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#141518]">
                Already registered with Feasto?
              </span>
              <Link
                to="/rider/login"
                className="text-xs font-mono font-black uppercase text-[#141518] hover:text-[#1B3BFF] underline underline-offset-2 decoration-[#D7F04A] decoration-2 flex items-center gap-1"
              >
                <span>SIGN IN HERE</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <RiderPageHeader
              title="Courier Partner Application"
              subtitle="Step 1 of 6: Provide your legal identity, contact credentials, and vehicle fleet tier to start verification."
            />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RiderInput
                  label="Full Legal Name (As in Aadhaar/PAN) *"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Arjun Kumar"
                />

                <RiderInput
                  label="Mobile Phone Number (Will receive OTP) *"
                  type="tel"
                  required
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RiderInput
                  label="Email Address (For Invoices & Statements)"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="arjun.courier@feasto.food"
                />

                <RiderInput
                  label="Date of Birth (KYC Standard)"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>

              {/* Operating City & Vehicle Fleet Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <RiderInput
                  label="Emergency Contact Phone"
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="+91 98200 11223"
                />
              </div>

              {/* Vehicle Type Options */}
              <div className="space-y-1 text-left w-full pt-1">
                <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#141518] block">
                  Delivery Fleet Vehicle Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setVehicleType('scooter_ev')}
                    className={`p-3 border text-left cursor-pointer transition-all ${
                      vehicleType === 'scooter_ev'
                        ? 'bg-[#141518] text-[#FAF8F5] border-[#141518] shadow-[3px_3px_0px_#D7F04A]'
                        : 'bg-[#F3F0E8] text-[#141518] border-[#141518]/30 hover:border-[#141518]'
                    }`}
                  >
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-[#D7F04A] text-[#141518] block w-fit mb-1">
                      +₹15 EV BONUS
                    </span>
                    <strong className="text-xs font-mono font-bold block">Electric Scooter</strong>
                    <span className="text-[10px] opacity-75 font-mono block">Ather / Ola / Chetak</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVehicleType('motorbike')}
                    className={`p-3 border text-left cursor-pointer transition-all ${
                      vehicleType === 'motorbike'
                        ? 'bg-[#141518] text-[#FAF8F5] border-[#141518] shadow-[3px_3px_0px_#D7F04A]'
                        : 'bg-[#F3F0E8] text-[#141518] border-[#141518]/30 hover:border-[#141518]'
                    }`}
                  >
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-[#F3F0E8] text-[#141518] block w-fit mb-1 border border-[#141518]">
                      STANDARD TIER
                    </span>
                    <strong className="text-xs font-mono font-bold block">Motorcycle / Scooter</strong>
                    <span className="text-[10px] opacity-75 font-mono block">Splendor / Activa / Pulsar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVehicleType('bicycle')}
                    className={`p-3 border text-left cursor-pointer transition-all ${
                      vehicleType === 'bicycle'
                        ? 'bg-[#141518] text-[#FAF8F5] border-[#141518] shadow-[3px_3px_0px_#D7F04A]'
                        : 'bg-[#F3F0E8] text-[#141518] border-[#141518]/30 hover:border-[#141518]'
                    }`}
                  >
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-[#F3F0E8] text-[#141518] block w-fit mb-1 border border-[#141518]">
                      HYPERLOCAL
                    </span>
                    <strong className="text-xs font-mono font-bold block">Bicycle / E-Bike</strong>
                    <span className="text-[10px] opacity-75 font-mono block">Within 2km radius</span>
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <RiderButton variant="primary" size="lg" fullWidth type="submit">
                  CONTINUE TO STEP 2: PHONE 2FA VERIFICATION →
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
          <span>STEP 1 OF 6</span>
        </div>
      </footer>
    </div>
  );
};

export default RiderRegisterPage;
