import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, Loader2, Key, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const FloatingShape = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl ${className}`}
    animate={{
      y: [0, -30, 0],
      rotate: [0, 180, 360],
      scale: [1, 1.2, 1],
      opacity: [0.4, 0.6, 0.4]
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
);

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      toast.success("Reset link sent! Check your inbox.");
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        toast.error("No account found with this email.");
      } else {
        toast.error("Failed to send reset email. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0B0F14] text-white flex items-center justify-center p-6">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingShape className="w-[600px] h-[600px] bg-green-900/10 -top-20 -left-20" delay={0} />
        <FloatingShape className="w-[500px] h-[500px] bg-emerald-900/10 bottom-0 right-0" delay={2} />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-[#18181b]/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">

          <Link to="/login" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
          </Link>

          {!success ? (
            <>
              <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-1 ring-green-500/50">
                  <Key className="w-8 h-8 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
                <p className="text-gray-400">No worries, we'll send you reset instructions.</p>
              </div>

              <form onSubmit={handleReset} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-hover:text-green-500 transition-colors" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500
                        focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30 transition-all hover:border-white/20"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg
                    hover:bg-green-500 active:scale-[0.98] transition-all duration-200 
                    disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    <>
                      Send Reset Link <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Check your email</h2>
              <p className="text-gray-400 mb-8">
                We sent a password reset link to <br />
                <span className="text-white font-medium">{email}</span>
              </p>

              <Link
                to="/login"
                className="inline-flex w-full items-center justify-center py-3.5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-medium"
              >
                Back to Login
              </Link>
            </motion.div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
