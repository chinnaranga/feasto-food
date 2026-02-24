import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bike, ShieldCheck, Eye, EyeOff, Loader2, ArrowRight, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { motion } from 'framer-motion';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import LiquidBackground from '../../components/liquid/LiquidBackground';
import LiquidCard from '../../components/liquid/LiquidCard';
import LiquidButton from '../../components/liquid/LiquidButton';
import LiquidInput from '../../components/liquid/LiquidInput';

export default function RiderLoginPage() {
    const { login, googleSignIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [loginMethod, setLoginMethod] = useState('email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Phone auth states
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [otpStep, setOtpStep] = useState(false); // false = phone input, true = OTP input
    const [verificationId, setVerificationId] = useState(null);
    const [countdown, setCountdown] = useState(0);

    // Setup Recaptcha on mount
    useEffect(() => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
                callback: () => {
                    console.log('Recaptcha verified');
                }
            });
        }

        return () => {
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        };
    }, []);

    // Countdown timer for resend OTP
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Profile Creation Helper
    const createUserProfile = async (user) => {
        const db = getFirestore();
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                phoneNumber: user.phoneNumber,
                name: user.displayName || 'Rider',
                role: 'rider',
                createdAt: new Date(),
                status: 'offline'
            });
        } else {
            const data = userSnap.data();
            if (!data.role) {
                await setDoc(userRef, { role: 'rider' }, { merge: true });
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await login(email, password);
            await createUserProfile(result.user);
            toast.success("Welcome Partner! 🛵");
            navigate(location.state?.from?.pathname || '/rider/dashboard');
        } catch (error) {
            console.error(error);
            toast.error("Login failed. Check credentials.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await googleSignIn();
            await createUserProfile(result.user);
            toast.success("Welcome Partner! 🛵");
            navigate('/rider/dashboard');
        } catch (error) {
            console.error(error);
            toast.error("Google Login failed");
        }
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!phoneNumber) {
            toast.error('Please enter a valid phone number');
            return;
        }

        setLoading(true);
        try {
            const formattedPhone = phoneNumber; // PhoneInput handles format
            const appVerifier = window.recaptchaVerifier;
            const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);

            setVerificationId(confirmationResult);
            setOtpStep(true);
            setCountdown(60);
            toast.success('OTP sent to your phone! 📱');
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/invalid-phone-number') {
                toast.error('Invalid phone number format');
            } else if (error.code === 'auth/too-many-requests') {
                toast.error('Too many attempts. Please try again later.');
            } else {
                toast.error('Failed to send OTP. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const result = await verificationId.confirm(otp);
            await createUserProfile(result.user);
            toast.success("Welcome Partner! 🛵");
            navigate(location.state?.from?.pathname || '/rider/dashboard');
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/invalid-verification-code') {
                toast.error('Invalid OTP. Please check and try again.');
            } else if (error.code === 'auth/code-expired') {
                toast.error('OTP expired. Please request a new one.');
                setOtpStep(false);
                setOtp('');
            } else {
                toast.error('Verification failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = () => {
        setOtpStep(false);
        setOtp('');
        setPhoneNumber('');
    };

    return (
        <LiquidBackground className="flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[400px] relative z-10"
            >
                <LiquidCard className="p-8">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                            className="relative inline-block mb-4"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-900/30 transform rotate-3">
                                <Bike className="w-10 h-10 text-white" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-green-500 text-black text-[10px] font-bold px-2.5 py-1 rounded-full border-4 border-[#18181b] flex items-center gap-1 shadow-sm">
                                <ShieldCheck className="w-3 h-3" />
                                VERIFIED
                            </div>
                        </motion.div>

                        <h1 className="text-2xl font-bold tracking-tight text-white">Partner Login</h1>
                        <p className="text-gray-400 text-sm mt-1">Deliver happiness, earn on your terms.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Method Toggle */}
                        <div className="flex bg-black/40 p-1 rounded-xl mb-6 border border-white/5">
                            <button type="button" onClick={() => setLoginMethod('email')} className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${loginMethod === 'email' ? 'bg-[#27272a] text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}>
                                Email
                            </button>
                            <button type="button" onClick={() => setLoginMethod('phone')} className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${loginMethod === 'phone' ? 'bg-[#27272a] text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}>
                                Phone
                            </button>
                        </div>


                        <div className="space-y-4">
                            {loginMethod === 'email' ? (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                                        <LiquidInput
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="rider@aerobite.com"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5 relative">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                                        <div className="relative">
                                            <LiquidInput
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                // Phone authentication flow
                                <>
                                    {!otpStep ? (
                                        // Step 1: Phone Number Input
                                        <>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                                                <div className="relative phone-input-container-rider">
                                                    <PhoneInput
                                                        international
                                                        defaultCountry="IN"
                                                        value={phoneNumber}
                                                        onChange={setPhoneNumber}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600 focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/50 transition-all [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:border-none [&_.PhoneInputInput]:focus:ring-0 [&_.PhoneInputInput]:text-white"
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 ml-1">We'll send you an OTP to verify</p>
                                            </div>

                                            <LiquidButton
                                                onClick={handleSendOTP}
                                                disabled={loading || !phoneNumber}
                                                className="w-full mt-4"
                                            >
                                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send OTP <ArrowRight size={18} /></>}
                                            </LiquidButton>
                                        </>
                                    ) : (
                                        // Step 2: OTP Verification
                                        <>
                                            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4">
                                                <p className="text-green-400 text-sm font-medium mb-1">OTP sent to {phoneNumber}</p>
                                                <p className="text-gray-400 text-xs">Enter the 6-digit code below</p>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Enter OTP</label>
                                                <LiquidInput
                                                    type="text"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                                    className="!text-center !text-2xl !font-mono !tracking-widest"
                                                    placeholder="000000"
                                                    maxLength="6"
                                                    autoFocus
                                                    required
                                                />
                                            </div>

                                            <LiquidButton
                                                onClick={handleVerifyOTP}
                                                disabled={loading || otp.length !== 6}
                                                className="w-full mt-4"
                                            >
                                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify OTP <ArrowRight size={18} /></>}
                                            </LiquidButton>

                                            <div className="flex items-center justify-between mt-4 text-xs">
                                                <button
                                                    onClick={handleResendOTP}
                                                    disabled={countdown > 0}
                                                    className="text-orange-500 font-medium hover:underline disabled:text-gray-500 disabled:no-underline disabled:cursor-not-allowed"
                                                >
                                                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                                                </button>
                                                <button
                                                    onClick={() => { setOtpStep(false); setOtp(''); }}
                                                    className="text-gray-400 hover:text-white transition-colors"
                                                >
                                                    Change Number
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Recaptcha Container */}
                        <div id="recaptcha-container"></div>

                        {/* Submit button for email login only */}
                        {loginMethod === 'email' && (
                            <LiquidButton
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Go Online <ArrowRight size={18} /></>}
                            </LiquidButton>
                        )}

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10"></span>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                                <span className="bg-[#18181b] px-3 text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full bg-[#18181b] border border-white/10 hover:bg-white/5 text-white font-medium py-3.5 rounded-xl transition-colors flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" color="#4285F4" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" color="#34A853" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" color="#FBBC05" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" color="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-500 mt-8">
                        New here? <button className="text-orange-500 font-bold hover:underline">Apply to be a Partner</button>
                    </p>

                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-center gap-6 text-[10px] text-gray-600 font-medium uppercase tracking-wider">
                        <span className="cursor-pointer hover:text-gray-400">Help & Support</span>
                        <span className="cursor-pointer hover:text-gray-400">Terms</span>
                        <span className="cursor-pointer hover:text-gray-400">Privacy</span>
                    </div>
                </LiquidCard>
            </motion.div>
        </LiquidBackground>
    );
}
