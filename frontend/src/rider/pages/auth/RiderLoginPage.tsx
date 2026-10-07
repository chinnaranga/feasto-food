import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Smartphone,
  Key,
  ShieldCheck,
  Zap,
  Radio,
  Eye,
  EyeOff,
  ArrowRight,
  Bike,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import useRiderAuthStore from '../../store/useRiderAuthStore';
import { useAuthStore } from '../../../store/authStore';
import { RiderButton, RiderInput, RiderPageHeader } from '../../components/RiderUIComponents';
import { OTPInput } from '../../components/auth/RiderAuthComponents';

export const RiderLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { phone, setPhone, login, loginWithOtp } = useRiderAuthStore();

  // Authentication mode: 'password' or 'otp'
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [phoneOrId, setPhoneOrId] = useState(phone || '+91 98765 43210');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  // OTP Login state
  const [otpValue, setOtpValue] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  // Status feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!phoneOrId) {
      setErrorMsg('Please provide your registered courier phone number or partner ID.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your courier access PIN or password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login({ phone: phoneOrId, password });

      // Synchronize global auth store
      useAuthStore.setState({
        isAuthenticated: true,
        user: {
          id: 'rider-arjun-01',
          uid: 'rider-arjun-01',
          name: 'Arjun Kumar',
          displayName: 'Arjun Kumar',
          email: 'arjun.courier@feasto.food',
          role: 'rider',
          permissions: ['rider:read', 'rider:write', 'rider:deliver'],
          accountStatus: 'active',
          verificationStatus: { emailVerified: true, phoneVerified: true },
          preferredLanguage: 'en',
          createdAt: new Date().toISOString(),
        },
        token: 'feasto-rider-live-session-token',
      });

      setIsLoading(false);
      navigate('/rider/dashboard');
    }, 600);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!phoneOrId) {
      setErrorMsg('Please provide your mobile phone number to dispatch an SMS OTP.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsOtpSent(true);
      setIsLoading(false);
      setPhone(phoneOrId);
    }, 600);
  };

  const handleOtpVerifyAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (otpValue.length < 6) {
      setErrorMsg('Please enter the complete 6-digit one-time authentication code.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      loginWithOtp(phoneOrId, otpValue);

      // Synchronize global auth store
      useAuthStore.setState({
        isAuthenticated: true,
        user: {
          id: 'rider-arjun-01',
          uid: 'rider-arjun-01',
          name: 'Arjun Kumar',
          displayName: 'Arjun Kumar',
          email: 'arjun.courier@feasto.food',
          role: 'rider',
          permissions: ['rider:read', 'rider:write', 'rider:deliver'],
          accountStatus: 'active',
          verificationStatus: { emailVerified: true, phoneVerified: true },
          preferredLanguage: 'en',
          createdAt: new Date().toISOString(),
        },
        token: 'feasto-rider-live-session-token',
      });

      setIsLoading(false);
      navigate('/rider/dashboard');
    }, 600);
  };

  const handleFastDemoLogin = () => {
    login({ phone: '+91 98765 43210', password: 'demo' });
    useAuthStore.setState({
      isAuthenticated: true,
      user: {
        id: 'rider-arjun-01',
        uid: 'rider-arjun-01',
        name: 'Arjun Kumar',
        displayName: 'Arjun Kumar',
        email: 'arjun.courier@feasto.food',
        role: 'rider',
        permissions: ['rider:read', 'rider:write', 'rider:deliver'],
        accountStatus: 'active',
        verificationStatus: { emailVerified: true, phoneVerified: true },
        preferredLanguage: 'en',
        createdAt: new Date().toISOString(),
      },
      token: 'feasto-rider-live-session-token',
    });
    navigate('/rider/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F3F0E8] flex flex-col justify-between py-4 sm:py-8 px-4 sm:px-6 text-left selection:bg-[#D7F04A] selection:text-[#141518]">
      {/* Top Telemetry Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between pb-4 border-b border-[#141518]/15">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#141518] text-[#D7F04A] flex items-center justify-center font-mono font-black text-xs border border-[#141518] shadow-[2px_2px_0px_#141518]">
            FC
          </div>
          <div>
            <span className="font-mono text-xs font-black uppercase tracking-wider text-[#141518] block leading-none">
              FEASTO // COURIER DISPATCH TERMINAL
            </span>
            <span className="font-mono text-[10px] text-[#55565B] block mt-0.5">
              SECTOR GATEWAY · AUTH PROTOCOL V2.4
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF8F5] border border-[#141518] text-[10px] font-mono font-bold text-[#141518] shadow-[2px_2px_0px_#141518]">
            <Radio size={10} className="text-[#10B981] animate-pulse" />
            DISPATCH MESH: ONLINE
          </span>
          <Link
            to="/rider/register"
            className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#141518] hover:text-[#1B3BFF] underline underline-offset-4 decoration-[#D7F04A] decoration-2 transition-colors"
          >
            NEW PARTNER REGISTRATION →
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full my-auto py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Dispatch Console Information Showcase */}
          <div className="hidden lg:flex lg:col-span-5 bg-[#141518] text-[#FAF8F5] border border-[#141518] shadow-[6px_6px_0px_#141518] p-8 flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D7F04A] text-[#141518] border border-[#141518] text-[10px] font-mono font-black uppercase tracking-widest shadow-[2px_2px_0px_#D7F04A]">
                <Radio size={11} className="fill-[#141518]" /> ACTIVE FLEET CONSOLE
              </span>
              <h1 className="text-3xl font-heading font-black leading-tight uppercase tracking-tight text-white">
                COURIER PARTNER CONSOLE SIGN IN
              </h1>
              <p className="text-xs text-[#B0B1B6] leading-relaxed font-sans">
                Access your real-time delivery route telemetry, accept high-surge gourmet orders, and verify daily
                instant bank settlements.
              </p>
            </div>

            {/* Live Fleet Metrics */}
            <div className="space-y-3 relative z-10 font-mono text-xs">
              <div className="p-3.5 bg-[#1E2025] border border-[#2B2E36] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#8E929C] uppercase block">CURRENT SURGE RATE</span>
                  <strong className="text-[#D7F04A] text-sm font-black block">1.4x HIGH-DEMAND SURGE</strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#8E929C] uppercase block">ACTIVE ZONE</span>
                  <strong className="text-white text-xs block">BANDRA / BKC METRO</strong>
                </div>
              </div>

              <div className="p-3.5 bg-[#1E2025] border border-[#2B2E36] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#8E929C] uppercase block">TODAY'S TOP DISPATCHER</span>
                  <strong className="text-white text-sm font-black block font-mono">₹2,840 (14 DELIVERIES)</strong>
                </div>
                <span className="text-[10px] text-[#D7F04A] bg-[#2B2E36] px-2 py-0.5 border border-[#3E424D]">
                  LIVE TELEMETRY
                </span>
              </div>

              <div className="p-3 bg-[#1E2025] border border-[#2B2E36] text-[11px] text-[#B0B1B6] space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#D7F04A]" />
                  <span>End-to-end encrypted dispatch sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#D7F04A]" />
                  <span>Direct UPI settlements every 24 hours</span>
                </div>
              </div>
            </div>

            {/* 1-Click Fast Demo Login */}
            <div className="pt-4 border-t border-[#2B2E36] relative z-10 space-y-2">
              <span className="text-[10px] font-mono text-[#8E929C] uppercase block tracking-wider">
                DEVELOPER / QUICK PREVIEW ACCESS
              </span>
              <button
                type="button"
                onClick={handleFastDemoLogin}
                className="w-full py-2.5 px-3 bg-[#D7F04A] hover:bg-[#cbe63e] text-[#141518] border border-[#141518] text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[2px_2px_0px_#FAF8F5] transition-all cursor-pointer"
              >
                <Sparkles size={14} />
                <span>FAST DEMO LOGIN (ARJUN KUMAR · COURIER #8802)</span>
              </button>
            </div>
          </div>

          {/* Right Form Card: Dedicated Rider Login */}
          <div className="lg:col-span-7 bg-[#FAF8F5] p-6 sm:p-8 border border-[#141518] shadow-[6px_6px_0px_#141518] space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div className="border-b border-[#141518]/15 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest px-2.5 py-0.5 bg-[#141518] text-[#FAF8F5]">
                    REGISTERED COURIER SIGN IN
                  </span>
                  <span className="text-[10px] font-mono text-[#55565B] uppercase">
                    MUMBAI DISPATCH NODE
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-heading font-black text-[#141518] uppercase tracking-tight">
                  SIGN IN TO DISPATCH COCKPIT
                </h2>
                <p className="text-xs text-[#55565B] font-sans mt-1">
                  Enter your courier credentials to sign into your vessel and view active assignment queues.
                </p>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#F3F0E8] border border-[#141518]">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('password');
                    setErrorMsg('');
                  }}
                  className={`py-2 px-3 text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    loginMode === 'password'
                      ? 'bg-[#141518] text-[#FAF8F5] border-[#141518] shadow-[2px_2px_0px_#D7F04A]'
                      : 'bg-transparent text-[#55565B] border-transparent hover:text-[#141518]'
                  }`}
                >
                  <Key size={13} />
                  <span>PIN / PASSWORD</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginMode('otp');
                    setErrorMsg('');
                  }}
                  className={`py-2 px-3 text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    loginMode === 'otp'
                      ? 'bg-[#141518] text-[#FAF8F5] border-[#141518] shadow-[2px_2px_0px_#D7F04A]'
                      : 'bg-transparent text-[#55565B] border-transparent hover:text-[#141518]'
                  }`}
                >
                  <Smartphone size={13} />
                  <span>1-CLICK SMS OTP</span>
                </button>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 bg-[#FEE2E2] border border-[#991B1B] text-[#991B1B] text-xs font-mono flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* TAB 1: PIN / PASSWORD LOGIN FORM */}
              {loginMode === 'password' && (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <RiderInput
                    label="Registered Mobile Number or Courier ID *"
                    type="text"
                    required
                    value={phoneOrId}
                    onChange={(e) => setPhoneOrId(e.target.value)}
                    placeholder="+91 98765 43210 or RDR-8802"
                  />

                  <div className="space-y-1 text-left w-full">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#141518]">
                        Courier Access PIN / Password *
                      </label>
                      <Link
                        to="/rider/forgot-password"
                        className="text-[10px] font-mono font-bold text-[#1B3BFF] hover:underline uppercase"
                      >
                        FORGOT PIN?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#141518] text-xs font-mono font-bold text-[#141518] placeholder-[#8E929C] focus:outline-none focus:bg-[#D7F04A]/10 shadow-[2px_2px_0px_#141518] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#55565B] hover:text-[#141518] cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberDevice}
                        onChange={(e) => setRememberDevice(e.target.checked)}
                        className="w-4 h-4 accent-[#141518] border border-[#141518] rounded-none cursor-pointer"
                      />
                      <span className="text-xs font-mono text-[#55565B]">
                        Remember this vessel on this terminal
                      </span>
                    </label>
                  </div>

                  <div className="pt-2">
                    <RiderButton variant="primary" size="lg" fullWidth type="submit" disabled={isLoading}>
                      {isLoading ? 'AUTHENTICATING COURIER...' : 'SIGN IN TO DISPATCH COCKPIT →'}
                    </RiderButton>
                  </div>
                </form>
              )}

              {/* TAB 2: SMS OTP LOGIN FORM */}
              {loginMode === 'otp' && (
                <div className="space-y-4">
                  {!isOtpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <RiderInput
                        label="Registered Mobile Phone Number *"
                        type="tel"
                        required
                        value={phoneOrId}
                        onChange={(e) => setPhoneOrId(e.target.value)}
                        placeholder="+91 98765 43210"
                      />

                      <div className="p-3 bg-[#F3F0E8] border border-[#141518] text-xs font-mono text-[#55565B]">
                        <span>
                          We will dispatch a secure 6-digit one-time passcode to your registered courier SIM card.
                        </span>
                      </div>

                      <RiderButton variant="primary" size="lg" fullWidth type="submit" disabled={isLoading}>
                        {isLoading ? 'DISPATCHING SMS TOKEN...' : 'SEND 6-DIGIT LOGIN OTP →'}
                      </RiderButton>
                    </form>
                  ) : (
                    <form onSubmit={handleOtpVerifyAndLogin} className="space-y-4">
                      <div className="p-3 bg-[#D7F04A]/20 border border-[#141518] flex items-center justify-between text-xs font-mono text-[#141518]">
                        <span>SMS DISPATCHED TO: <strong>{phoneOrId}</strong></span>
                        <button
                          type="button"
                          onClick={() => setIsOtpSent(false)}
                          className="font-black underline uppercase hover:text-[#1B3BFF] cursor-pointer"
                        >
                          CHANGE PHONE
                        </button>
                      </div>

                      <div className="space-y-1 text-center">
                        <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#141518] block text-left">
                          Enter 6-Digit One-Time Passcode *
                        </label>
                        <OTPInput value={otpValue} onChange={setOtpValue} />
                      </div>

                      <div className="p-3 bg-[#F3F0E8] border border-[#141518] text-center text-xs font-mono text-[#55565B] flex items-center justify-between">
                        <span>DID NOT RECEIVE CODE?</span>
                        <button
                          type="button"
                          onClick={() => {
                            setOtpValue('');
                            setIsOtpSent(true);
                          }}
                          className="font-black text-[#141518] uppercase underline underline-offset-4 decoration-[#D7F04A] decoration-2 hover:text-[#1B3BFF] cursor-pointer"
                        >
                          RESEND SMS (30S)
                        </button>
                      </div>

                      <RiderButton variant="primary" size="lg" fullWidth type="submit" disabled={isLoading}>
                        {isLoading ? 'VERIFYING CREDENTIAL...' : 'VERIFY & ENTER DISPATCH COCKPIT →'}
                      </RiderButton>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Register Distinction Banner */}
            <div className="pt-6 border-t border-[#141518]/15 mt-6">
              <div className="p-4 bg-[#F3F0E8] border border-[#141518] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[2px_2px_0px_#141518]">
                <div>
                  <span className="text-[10px] font-mono text-[#55565B] uppercase block font-bold">
                    DON'T HAVE A COURIER ACCOUNT YET?
                  </span>
                  <strong className="text-xs font-heading font-black text-[#141518] uppercase tracking-wide">
                    JOIN THE ELITE FEASTO DISPATCH FLEET
                  </strong>
                </div>
                <Link
                  to="/rider/register"
                  className="px-4 py-2 bg-[#141518] text-[#FAF8F5] hover:bg-[#D7F04A] hover:text-[#141518] border border-[#141518] text-xs font-mono font-black uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-[2px_2px_0px_#141518]"
                >
                  <span>REGISTER NOW</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Audit */}
      <footer className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between py-3 border-t border-[#141518]/15 font-mono text-[10px] text-[#55565B] gap-2">
        <span>FEASTO COURIER LOGISTICS DISPATCH NETWORK · INDIA</span>
        <div className="flex items-center gap-4">
          <Link to="/rider/welcome" className="hover:text-[#141518] underline">
            WELCOME ONBOARDING
          </Link>
          <Link to="/rider/register" className="hover:text-[#141518] underline">
            PARTNER REGISTRATION
          </Link>
          <span>ENCRYPTED DISPATCH TERMINAL</span>
        </div>
      </footer>
    </div>
  );
};

export default RiderLoginPage;
