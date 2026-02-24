import React, { useState, useEffect, useRef } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, RecaptchaVerifier, signInWithPhoneNumber } from "../config/firebase";
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChefHat, Loader2, ArrowRight, Store, UserPlus, Phone, Mail, Info, KeyRound, Lock, User
} from "lucide-react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

// Liquid Components
import LiquidContainer from "../components/liquid/LiquidContainer";
import LiquidCard from "../components/liquid/LiquidCard";
import LiquidButton from "../components/liquid/LiquidButton";
import LiquidInput from "../components/liquid/LiquidInput";

// --- Feature Flags ---
const FLAGS = {
    ENABLE_PHONE_LOGIN: true,
    ENABLE_OTP: true
};

export default function RestaurantLogin() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [loginMethod, setLoginMethod] = useState("email"); // 'email' | 'phone'
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [restaurantName, setRestaurantName] = useState("");
    const [loading, setLoading] = useState(false);

    // OTP States
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);
    const recaptchaContainerRef = useRef(null);
    const recaptchaVerifierRef = useRef(null);

    // Auto-switch to email if phone is disabled
    useEffect(() => {
        if (!FLAGS.ENABLE_PHONE_LOGIN && loginMethod === "phone") {
            const timer = setTimeout(() => setLoginMethod("email"), 2500);
            return () => clearTimeout(timer);
        }
    }, [loginMethod]);

    // Setup reCAPTCHA verifier when phone login is selected
    useEffect(() => {
        if (loginMethod === "phone" && FLAGS.ENABLE_PHONE_LOGIN && !recaptchaVerifierRef.current) {
            try {
                recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    size: 'invisible',
                    callback: () => {
                        console.log("reCAPTCHA verified");
                    },
                    'expired-callback': () => {
                        toast.error("reCAPTCHA expired. Please try again.");
                        recaptchaVerifierRef.current = null;
                    }
                });
            } catch (error) {
                console.error("reCAPTCHA setup error:", error);
            }
        }

        return () => {
            if (recaptchaVerifierRef.current) {
                try {
                    recaptchaVerifierRef.current.clear();
                } catch (e) {
                    // Ignore cleanup errors
                }
                recaptchaVerifierRef.current = null;
            }
        };
    }, [loginMethod]);

    // Send OTP to phone number
    const sendOtp = async () => {
        if (!phone) return toast.error("Please enter a valid phone number");

        setLoading(true);
        try {
            // Recreate reCAPTCHA if needed
            if (!recaptchaVerifierRef.current) {
                recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    size: 'invisible'
                });
            }

            const confirmation = await signInWithPhoneNumber(auth, phone, recaptchaVerifierRef.current);
            setConfirmationResult(confirmation);
            setOtpSent(true);
            toast.success("OTP sent! Check your phone 📱");
        } catch (error) {
            console.error("OTP Error:", error);
            if (error.code === 'auth/invalid-phone-number') {
                toast.error("Invalid phone number format");
            } else if (error.code === 'auth/too-many-requests') {
                toast.error("Too many attempts. Please try again later.");
            } else {
                toast.error(error.message || "Failed to send OTP");
            }
            // Reset reCAPTCHA on error
            recaptchaVerifierRef.current = null;
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP and complete phone auth
    const verifyOtp = async () => {
        if (!otp || otp.length !== 6) return toast.error("Please enter the 6-digit OTP");

        setLoading(true);
        try {
            const result = await confirmationResult.confirm(otp);
            const user = result.user;

            // Check if user exists in Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));

            if (isLogin) {
                // Login flow - verify restaurant admin role
                if (!userDoc.exists() || (userDoc.data().role !== "restaurant_admin" && userDoc.data().role !== "super_admin")) {
                    await auth.signOut();
                    throw new Error("Access restricted to partner accounts. Please register first.");
                }
                toast.success(`Welcome back, Chef! 👨‍🍳`);
            } else {
                // Signup flow - create restaurant and user
                if (!name || !restaurantName) {
                    await auth.signOut();
                    throw new Error("Please complete your profile details");
                }

                if (userDoc.exists()) {
                    toast.success("Account already exists! Logging you in...");
                } else {
                    const restRef = await addDoc(collection(db, "restaurants"), {
                        name: restaurantName,
                        ownerPhone: phone,
                        ownerId: user.uid,
                        isOpen: false,
                        rating: 5.0,
                        createdAt: new Date().toISOString()
                    });
                    await setDoc(doc(db, "users", user.uid), {
                        name: name,
                        phone: phone,
                        role: "restaurant_admin",
                        restaurantId: restRef.id,
                        active: true,
                        createdAt: new Date().toISOString()
                    });
                    toast.success("Restaurant registered successfully! 🚀");
                }
            }
            navigate("/restaurant/dashboard");

        } catch (error) {
            console.error("OTP Verification Error:", error);
            if (error.code === 'auth/invalid-verification-code') {
                toast.error("Invalid OTP. Please check and try again.");
            } else {
                toast.error(error.message || "Verification failed");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAuth = async (e) => {
        e.preventDefault();

        // Phone login flow
        if (loginMethod === "phone" && FLAGS.ENABLE_OTP) {
            if (otpSent) {
                return verifyOtp();
            } else {
                return sendOtp();
            }
        }

        // Email login flow
        if (loginMethod === "email" && (!email || !password)) return toast.error("Please enter your email and password");
        if (!isLogin && (!name || !restaurantName)) return toast.error("Please complete your profile details");

        setLoading(true);
        try {
            let user;
            if (isLogin) {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                user = userCredential.user;
                const userDoc = await getDoc(doc(db, "users", user.uid));

                if (!userDoc.exists() || (userDoc.data().role !== "restaurant_admin" && userDoc.data().role !== "super_admin")) {
                    await auth.signOut();
                    throw new Error("Access restricted to partner accounts.");
                }
                toast.success(`Welcome back, Chef! 👨‍🍳`);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                user = userCredential.user;
                await updateProfile(user, { displayName: name });
                const restRef = await addDoc(collection(db, "restaurants"), {
                    name: restaurantName,
                    ownerEmail: email,
                    ownerId: user.uid,
                    isOpen: false,
                    rating: 5.0,
                    createdAt: new Date().toISOString()
                });
                await setDoc(doc(db, "users", user.uid), {
                    name: name,
                    email: email,
                    role: "restaurant_admin",
                    restaurantId: restRef.id,
                    active: true,
                    createdAt: new Date().toISOString()
                });
                toast.success("Restaurant registered successfully! 🚀");
            }
            navigate("/restaurant/dashboard");

        } catch (error) {
            console.error("Auth Error:", error);
            const msg = error.code === 'auth/invalid-credential' ? "Invalid email or password." : (error.message || "Sign in failed. Please try again.");
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LiquidContainer>
            <div className="flex min-h-screen">
                {/* Left Panel - Branding (Desktop Only) */}
                <div className="hidden lg:flex w-[40%] flex-col justify-between p-12 relative z-10 border-r border-white/5 bg-black/20 backdrop-blur-md">
                    <div>
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 liquid-glass-high">
                                <ChefHat className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-3xl font-bold tracking-tight text-white">Feasto</span>
                        </div>

                        <h1 className="text-5xl font-extrabold leading-tight mb-8 drop-shadow-lg">
                            Grow your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                                Restaurant Business
                            </span>
                        </h1>

                        <ul className="space-y-6 text-gray-300 text-lg">
                            {[
                                { icon: "📦", text: "Manage live orders seamlessly" },
                                { icon: "📈", text: "Track sales & performance real-time" },
                                { icon: "🚀", text: "Reach thousands of new customers" }
                            ].map((item, idx) => (
                                <motion.li
                                    key={idx}
                                    className="flex items-center gap-4"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + idx * 0.1 }}
                                >
                                    <span className="bg-white/5 p-3 rounded-xl border border-white/10 shadow-sm backdrop-blur-lg">{item.icon}</span>
                                    {item.text}
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                    <LiquidCard className="w-full max-w-md bg-[#18181b]/40 border-white/10 shadow-2xl backdrop-blur-xl">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner backdrop-blur-md">
                                {isLogin ? <Store className="w-8 h-8 text-orange-500" /> : <UserPlus className="w-8 h-8 text-orange-500" />}
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {isLogin ? "Restaurant Partner Portal" : "Join Feasto Network"}
                            </h2>
                            <p className="text-gray-400">
                                {isLogin ? "Access your dashboard to manage orders." : "Start your digital journey with us."}
                            </p>
                        </div>

                        {/* Auth Method Toggle */}
                        <div className="flex p-1 bg-white/5 rounded-xl mb-8 border border-white/5 relative backdrop-blur-md">
                            <button
                                onClick={() => setLoginMethod("email")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all relative z-10 ${loginMethod === "email" ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10 backdrop-blur-md" : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                <Mail size={16} /> Email
                            </button>
                            <button
                                onClick={() => setLoginMethod("phone")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all relative z-10 ${loginMethod === "phone" ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10 backdrop-blur-md" : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                <Phone size={16} /> Phone
                            </button>
                        </div>

                        {/* Info Banner for Disabled Phone Login */}
                        {!FLAGS.ENABLE_PHONE_LOGIN && loginMethod === "phone" && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mb-6 rounded-lg bg-blue-500/10 px-4 py-3 text-sm text-blue-300 flex items-start gap-3 border border-blue-500/20 backdrop-blur-md"
                            >
                                <Info size={18} className="shrink-0 mt-0.5" />
                                <p>
                                    Phone login is coming soon.<br />
                                    <span className="text-blue-200/70 text-xs">For now, please sign in using your email address.</span>
                                </p>
                            </motion.div>
                        )}

                        <form onSubmit={handleAuth} className="space-y-5">
                            <AnimatePresence mode="popLayout">
                                {!isLogin && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-5 overflow-hidden"
                                    >
                                        <LiquidInput
                                            icon={User}
                                            label="Full Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Chef John Doe"
                                        />
                                        <LiquidInput
                                            icon={Store}
                                            label="Restaurant Name"
                                            value={restaurantName}
                                            onChange={(e) => setRestaurantName(e.target.value)}
                                            placeholder="John's Bistro"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Show Email Inputs or Phone Logic based on Selection + Flag */}
                            {(loginMethod === "email" || (!FLAGS.ENABLE_PHONE_LOGIN && loginMethod === "phone")) ? (
                                <>
                                    <LiquidInput
                                        icon={Mail}
                                        label="Email Address"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="email"
                                        autoFocus={loginMethod === "phone"} // Auto-focus if fallback
                                        placeholder="partner@aerobite.com"
                                    />
                                    <LiquidInput
                                        icon={Lock}
                                        label="Password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                    />
                                    {isLogin && (
                                        <div className="flex justify-between items-center text-xs px-1">
                                            <span className="text-green-500/80 flex items-center gap-1">🔒 Secure Partner Login</span>
                                            <button type="button" className="text-gray-400 hover:text-white transition-colors">
                                                Forgot Password?
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="space-y-4">
                                    {!otpSent ? (
                                        <div className="space-y-2 group">
                                            <label className="text-sm font-medium text-gray-400 ml-1 group-focus-within:text-orange-500 transition-colors">
                                                Phone Number
                                            </label>
                                            <div className="liquid-glass rounded-2xl p-1 focus-within:ring-1 focus-within:ring-orange-500/50 transition-all backdrop-blur-md">
                                                <PhoneInput
                                                    international
                                                    defaultCountry="IN"
                                                    value={phone}
                                                    onChange={setPhone}
                                                    className="bg-transparent px-3 py-3 text-white phone-input-custom"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 ml-1">We'll text you a code to verify your account.</p>
                                        </div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-4"
                                        >
                                            <div className="text-center mb-4">
                                                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <KeyRound className="w-6 h-6 text-green-400" />
                                                </div>
                                                <p className="text-sm text-gray-400">
                                                    Enter the 6-digit code sent to<br />
                                                    <span className="text-white font-medium">{phone}</span>
                                                </p>
                                            </div>
                                            <LiquidInput
                                                icon={KeyRound}
                                                label="Verification Code"
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={6}
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                                placeholder="123456"
                                                autoFocus
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setOtpSent(false);
                                                    setOtp("");
                                                    setConfirmationResult(null);
                                                }}
                                                className="text-sm text-orange-400 hover:text-orange-300 transition-colors w-full text-center"
                                            >
                                                ← Change phone number
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            )}

                            <LiquidButton
                                type="submit"
                                disabled={loading}
                                className="w-full mt-6"
                                variant={isLogin ? "primary" : "secondary"} // Or perhaps a custom orange variant would be better? Stick to primary for now or add orange later.
                            // Let's stick to standard LiquidButton styling but maybe emphasize orange for restaurant theme if possible, 
                            // but LiquidButton uses green by default for primary. 
                            // We can override styles via className or add a new variant to LiquidButton later. 
                            // For now, let's use primary (green) as it matches the brand, or secondary.
                            // Actually better to keep consistent green branding across the platform for primary actions.
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : loginMethod === "phone" ? (
                                    otpSent ? (
                                        <>Verify OTP <ArrowRight className="w-5 h-5" /></>
                                    ) : (
                                        <>Send OTP <Phone className="w-5 h-5" /></>
                                    )
                                ) : (
                                    isLogin ? (
                                        <>Sign In to Dashboard <ArrowRight className="w-5 h-5" /></>
                                    ) : (
                                        <>Create Partner Account <ArrowRight className="w-5 h-5" /></>
                                    )
                                )}
                            </LiquidButton>
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/5 text-center">
                            <p className="text-gray-500 text-sm mb-4">
                                {isLogin ? "New to Feasto?" : "Already a partner?"}
                            </p>
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setEmail("");
                                    setPassword("");
                                    setName("");
                                    setRestaurantName("");
                                    setLoginMethod("email"); // reset to email
                                    setOtpSent(false);
                                    setOtp("");
                                    setConfirmationResult(null);
                                }}
                                className="w-full text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-white/5 border border-transparent hover:border-white/10 hover:shadow-lg hover:shadow-white/5"
                            >
                                {isLogin ? "Register your Restaurant" : "Sign In to Account"}
                            </button>
                        </div>

                        <div className="mt-6 flex justify-center gap-4 text-xs text-gray-600">
                            <span className="flex items-center gap-1">🛡️ Enterprise Security</span>
                            <span>•</span>
                            <span>No hidden fees</span>
                            <span>•</span>
                            <span>Partner Support</span>
                        </div>

                        {/* Invisible reCAPTCHA container for phone auth */}
                        <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
                    </LiquidCard>
                </div>
            </div>
        </LiquidContainer>
    );
}
