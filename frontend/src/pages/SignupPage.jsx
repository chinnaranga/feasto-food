import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Key, User, Loader2, ArrowRight, Sparkles, Heart, Shield, Zap, Lock,
  Utensils, CheckCircle, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

// Liquid Components
import LiquidBackground from '../components/liquid/LiquidBackground';
import LiquidContainer from '../components/liquid/LiquidContainer';
import LiquidCard from '../components/liquid/LiquidCard';
import LiquidButton from '../components/liquid/LiquidButton';
import LiquidInput from '../components/liquid/LiquidInput';

export default function SignupPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successState, setSuccessState] = useState(false);

  const { signup, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!displayName || !email || !password) {
      return toast.error("Please fill in all required fields.");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }

    setLoading(true);
    try {
      await signup(email, password, displayName);
      setSuccessState(true);
      toast.success("Welcome to AeroBite 🎉");
    } catch (error) {
      toast.error(error.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { label: "", color: "" };
    if (password.length < 6) return { label: "Weak", color: "bg-red-500" };
    if (password.length < 10) return { label: "Good", color: "bg-yellow-500" };
    return { label: "Strong", color: "bg-green-500" };
  };

  const strength = getPasswordStrength();

  return (
    <LiquidBackground>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-screen">
          {/* Left Side - Brand Features (Hidden on Mobile) */}
          <motion.div
            className="hidden lg:flex lg:w-1/2 relative p-12 flex-col justify-center items-center"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05]"></div>

            <div className="relative z-10 max-w-lg text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-24 h-24 bg-gradient-to-tr from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-orange-500/20 liquid-glass-high"
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>

              <motion.h1
                className="text-5xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-lg font-display"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Join the <span className="text-orange-500">Feasto</span> Revolution
              </motion.h1>

              <motion.p
                className="text-lg text-gray-300 mb-10 font-light"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Unlock exclusive rewards, faster checkout, and a dining experience tailored just for you.
              </motion.p>

              {/* Features List */}
              <div className="grid gap-4 text-left w-full">
                {[
                  { icon: Zap, title: "Superfast Delivery", desc: "Get your food while it's hot, every time." },
                  { icon: Shield, title: "Premium Support", desc: "24/7 priority assistance for members." },
                  { icon: Heart, title: "Curated Favorites", desc: "Smart recommendations based on your taste." }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white font-display">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Signup Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">

            <AnimatePresence>
              {successState && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xl flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-orange-400 font-display">Creating Account...</h3>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <LiquidCard className="w-full max-w-md backdrop-blur-3xl bg-[#121821]/80 border-white/10 shadow-2xl">
              {/* Mobile Brand */}
              <div className="lg:hidden text-center mb-8">
                <div className="inline-flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <Utensils className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-white font-display">Feasto</span>
                </div>
              </div>

              <div className="text-center lg:text-left mb-8">
                <h2 className="text-3xl font-bold text-white mb-2 font-display">Create Account</h2>
                <p className="text-gray-400">Join thousands of food lovers today</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-6">
                <LiquidInput
                  icon={User}
                  placeholder="Full Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  disabled={loading || successState}
                />
                <LiquidInput
                  icon={Mail}
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading || successState}
                />

                <div className="space-y-2">
                  <LiquidInput
                    icon={Key}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading || successState}
                  />
                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="flex items-center gap-2 pl-1">
                      <div className="flex-1 h-1 bg-gray-700/50 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-300 ${strength.color}`} style={{ width: password.length < 6 ? '30%' : password.length < 10 ? '70%' : '100%' }} />
                      </div>
                      <span className="text-xs text-gray-400 font-medium">{strength.label}</span>
                    </div>
                  )}
                </div>

                <LiquidInput
                  icon={Lock}
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading || successState}
                />

                <LiquidButton
                  type="submit"
                  disabled={loading || successState}
                  className="w-full text-lg mt-4"
                  variant="primary"
                >
                  {loading ? <Loader2 className="animate-spin w-6 h-6 mx-auto" /> : "Sign Up"}
                </LiquidButton>
              </form>

              <div className="text-center mt-8">
                <p className="text-gray-500">
                  Already have an account?{' '}
                  <Link to="/login" className="text-orange-400 font-semibold hover:text-orange-300 hover:underline transition-colors">
                    Sign In
                  </Link>
                </p>
              </div>
            </LiquidCard>
          </div>
        </div>
      </div>
    </LiquidBackground>
  );
}