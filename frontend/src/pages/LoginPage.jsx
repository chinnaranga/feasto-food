import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useCart from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Key, LogIn, Loader2, Eye, EyeOff,
  ArrowRight, Shield, Zap, Heart, CheckCircle, AlertCircle,
  Sparkles, Lock, Utensils, Phone, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getGuestCheckout, clearGuestCheckout } from '../utils/guestCheckout';
import { auth } from '../config/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

// Liquid Components
import LiquidBackground from '../components/liquid/LiquidBackground';
import LiquidContainer from '../components/liquid/LiquidContainer';
import LiquidCard from '../components/liquid/LiquidCard';
import LiquidButton from '../components/liquid/LiquidButton';
import LiquidInput from '../components/liquid/LiquidInput';

const db = getFirestore();

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.792C34.59 4.908 29.57 2.5 24 2.5C11.983 2.5 2.5 11.983 2.5 24s9.483 21.5 21.5 21.5c11.336 0 20.669-8.835 21.454-20.083l.157-.917z" />
    <path fill="#FF3D00" d="M6.306 14.691c2.258-4.248 6.48-7.193 11.389-8.498L11.96 11.96z" />
    <path fill="#4CAF50" d="M24 45.5c5.952 0 11.232-2.223 15.188-5.917L24 24z" />
    <path fill="#1976D2" d="M43.611 20.083L42 20H24v8h11.303a12.012 12.012 0 0 1-4.323 5.424l6.823 6.823C42.062 36.63 44 30.687 44 24c0-2.116-.31-4.14-.867-6.083z" />
  </svg>
);

const phoneInputStyles = `
  .PhoneInputInput {
    background: transparent;
    border: none;
    color: white;
    font-size: 1rem;
    height: 100%;
    padding: 1rem;
  }
  .PhoneInputInput:focus {
    outline: none;
  }
  .PhoneInputCountrySelect {
    background: #1a1a1a;
    color: white;
  }
  .PhoneInput {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.05); /* bg-white/5 */
    border: 1px solid rgba(255, 255, 255, 0.1); /* border-white/10 */
    border-radius: 1rem; /* rounded-2xl */
    padding-left: 1rem;
    transition: all 0.3s;
    .PhoneInput:focus-within {
    border-color: rgba(255, 107, 0, 0.5); /* focus:border-orange-500/50 */
    background: rgba(255, 255, 255, 0.1); /* focus:bg-white/10 */
    box-shadow: 0 0 15px rgba(255, 107, 0, 0.1);
  }
`;

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Phone auth state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [countdown, setCountdown] = useState(0);

  const { login, googleSignIn, currentUser, loading } = useAuth();
  const { mergeGuestCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isAnyLoading = loading || loginSuccess;
  const from = location.state?.from || '/dashboard';

  const mergeGuestLoginData = () => {
    const guestData = getGuestCheckout();
    if (guestData && guestData.cartItems) {
      mergeGuestCart(guestData.cartItems);
      clearGuestCheckout();
      toast.success("Cart Items Synced!", { icon: "🛒" });
    }
  };

  useEffect(() => {
    console.log("LoginPage Auth State:", { currentUser, loading, from });
    if (currentUser) {
      setLoginSuccess(true);
      mergeGuestLoginData();
      const timer = setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentUser, navigate, from, loading]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    try {
      await login(email, password);
      toast.success('Welcome back!');
    } catch (error) {
      toast.error(error.message || "Authentication failed");
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const methods = {
        google: googleSignIn,
      };
      await methods[provider]();
      toast.success(`Signed in with ${provider}!`);
    } catch (error) {
      toast.error(error.message || "Social login failed");
    }
  };

  // Phone authentication handlers
  useEffect(() => {
    if (!window.recaptchaVerifier && loginMethod === 'phone') {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => console.log('reCAPTCHA solved')
      });
    }
  }, [loginMethod]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      toast.error('Please enter a valid phone number');
      return;
    }

    const fullPhone = phoneNumber; // PhoneInput returns E.164 format
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, fullPhone, window.recaptchaVerifier);
      setVerificationId(confirmationResult);
      setOtpStep(true);
      setCountdown(60);
      toast.success('OTP sent successfully!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error(error.message || 'Failed to send OTP');
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then(widgetId => {
          grecaptcha.reset(widgetId);
        });
      }
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      const result = await verificationId.confirm(otp);
      const user = result.user;

      // Create/update user profile in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          phoneNumber: user.phoneNumber,
          role: 'user',
          createdAt: new Date(),
        });
      }

      toast.success('Login successful!');
      mergeGuestLoginData();
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error(error.message || 'Invalid OTP');
    }
  };

  const handleResendOTP = () => {
    setOtpStep(false);
    setOtp('');
    setTimeout(() => handleSendOTP({ preventDefault: () => { } }), 100);
  };

  return (
    <LiquidBackground>
      <style>{phoneInputStyles}</style>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-screen">
          {/* Left Side - Brand Hero */}
          <motion.div
            className="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-center items-center"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Decorative Grid */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05]"></div>

            <div className="relative z-10 max-w-lg text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-700 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-orange-500/20 liquid-glass-high"
              >
                <Utensils className="w-12 h-12 text-white" />
              </motion.div>

              <motion.h1
                className="text-6xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-lg font-display"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Welcome back
              </motion.h1>

              <motion.p
                className="text-xl text-gray-300 mb-12 leading-relaxed font-light"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Your curated culinary journey awaits.
              </motion.p>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { icon: Zap, label: "Instant Delivery" },
                  { icon: Shield, label: "Secure Payments" },
                  { icon: Heart, label: "Curated for You" }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-200 backdrop-blur-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  >
                    <item.icon className="w-4 h-4 text-orange-400" />
                    {item.label}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">

            {/* Loading Overlay */}
            <AnimatePresence>
              {loginSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xl flex items-center justify-center"
                >
                  <div className="flex flex-col items-center gap-6 text-center">
                    <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                    <div>
                      <span className="text-orange-400 font-medium tracking-wide animate-pulse block mb-2">Authenticating...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <LiquidCard className="w-full max-w-md backdrop-blur-3xl bg-[#121821]/80 border-white/10 shadow-2xl">
              {/* Header for Mobile */}
              <div className="lg:hidden text-center mb-10">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30">
                  <Utensils className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2 font-display">Sign In</h1>
                <p className="text-gray-400">Welcome back to Feasto</p>
              </div>

              <div className="text-left mb-8 hidden lg:block">
                <h2 className="text-3xl font-bold text-white mb-2 font-display">Sign In</h2>
                <p className="text-gray-400">Enter your credentials to continue</p>
              </div>

              {/* Login Method Toggle */}
              <div className="flex bg-black/40 p-1.5 rounded-2xl mb-8 border border-white/5">
                <button
                  type="button"
                  onClick={() => setLoginMethod('email')}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${loginMethod === 'email'
                    ? 'bg-white/10 text-white shadow-lg'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                    }`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('phone')}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${loginMethod === 'phone'
                    ? 'bg-white/10 text-white shadow-lg'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                    }`}
                >
                  Phone
                </button>
              </div>

              {/* Recaptcha Container */}
              <div id="recaptcha-container"></div>

              {/* Form */}
              {loginMethod === 'email' ? (
                <form onSubmit={handleEmailLogin} className="space-y-6">
                  <LiquidInput
                    icon={Mail}
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={emailError}
                    disabled={isAnyLoading}
                  />

                  <div>
                    <LiquidInput
                      icon={Key}
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={passwordError}
                      disabled={isAnyLoading}
                    />
                    <div className="flex justify-between items-center mt-4 px-1">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-orange-500 border-orange-500' : 'border-gray-600 group-hover:border-gray-500'
                          }`}>
                          {rememberMe && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => navigate('/forgot-password')}
                        className="text-sm text-orange-400 hover:text-orange-300 transition-colors font-medium"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>

                  <LiquidButton
                    type="submit"
                    disabled={isAnyLoading}
                    className="w-full text-lg mt-2"
                    variant="primary"
                  >
                    {isAnyLoading ? (
                      <Loader2 className="animate-spin w-6 h-6" />
                    ) : (
                      <>Sign In <ArrowRight className="w-5 h-5" /></>
                    )}
                  </LiquidButton>
                </form>
              ) : (
                // Phone authentication flow
                <div className="space-y-6">
                  {!otpStep ? (
                    <form onSubmit={handleSendOTP} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400 ml-1">Phone Number</label>
                        <PhoneInput
                          international
                          defaultCountry="IN"
                          value={phoneNumber}
                          onChange={setPhoneNumber}
                        />
                      </div>

                      <LiquidButton
                        type="submit"
                        disabled={isAnyLoading || !phoneNumber}
                        className="w-full text-lg"
                        variant="primary"
                      >
                        {isAnyLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Phone className="w-5 h-5" />}
                        Send OTP
                      </LiquidButton>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                      <div className="text-center mb-4">
                        <p className="text-sm text-gray-400">OTP sent to {phoneNumber}</p>
                      </div>

                      <LiquidInput
                        type="text"
                        placeholder="0 0 0 0 0 0"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="text-center text-2xl tracking-[0.5em] font-mono"
                        maxLength={6}
                      />

                      <LiquidButton
                        type="submit"
                        disabled={isAnyLoading || otp.length !== 6}
                        className="w-full text-lg"
                        variant="primary"
                      >
                        {isAnyLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                        Verify OTP
                      </LiquidButton>

                      <div className="flex gap-4">
                        <LiquidButton
                          type="button"
                          onClick={handleResendOTP}
                          disabled={countdown > 0}
                          variant="ghost"
                          className="flex-1 text-sm border border-white/10"
                        >
                          {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                        </LiquidButton>
                        <LiquidButton
                          type="button"
                          onClick={() => { setOtpStep(false); setOtp(''); }}
                          variant="ghost"
                          className="flex-1 text-sm border border-white/10"
                        >
                          Change Number
                        </LiquidButton>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Divider */}
              {loginMethod === 'email' && (
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 text-gray-500 bg-[#161b22] rounded-full">Or continue with</span>
                  </div>
                </div>
              )}

              {/* Social Login Buttons */}
              {loginMethod === 'email' && (
                <button
                  onClick={() => handleSocialLogin('google')}
                  disabled={isAnyLoading}
                  className="w-full flex items-center justify-center gap-3 py-4 border border-white/10 
                  rounded-2xl font-medium text-gray-200 bg-white/5 transition-all duration-300 
                  hover:bg-white/10 hover:border-white/20 hover:text-white hover:shadow-lg hover:scale-[1.02]
                  active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </button>
              )}

              {/* Footer */}
              <p className="text-center text-gray-500 mt-8">
                Don't have an account?{' '}
                <Link to="/signup" className="text-orange-400 font-semibold hover:text-orange-300 hover:underline transition-colors">
                  Create Account
                </Link>
              </p>
            </LiquidCard>
          </div>
        </div >
      </div>
    </LiquidBackground>
  );
}