import React, { useState } from "react";
import { auth } from "../config/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Phone, Lock, ArrowRight, Loader2, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const PhoneAuth = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Setup Recaptcha only once
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("Recaptcha verified", response);
          },
          "expired-callback": () => {
            toast.error("Recaptcha expired. Please try again.");
          },
        }
      );
    }
    return window.recaptchaVerifier;
  };

  const requestOTP = async (e) => {
    e.preventDefault();

    if (!phone.startsWith("+")) {
      return toast.error("Format: +1 1234567890");
    }

    setLoading(true);
    try {
      const appVerifier = setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      toast.success("OTP sent successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <motion.div
        className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/40"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Phone Authentication</h2>
          <p className="text-gray-500 text-sm">Secure login via OTP</p>
        </div>

        {!confirmationResult ? (
          <form onSubmit={requestOTP} className="space-y-5">
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                placeholder="+1 650-555-3434"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                required
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Send OTP <ArrowRight size={18} /></>}
            </motion.button>
          </form>
        ) : (
          <form onSubmit={verifyOTP} className="space-y-5">
            <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-3 text-sm text-blue-700 mb-4">
              <MessageSquare size={16} />
              <span>Code sent to {phone}</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 tracking-widest text-lg font-bold text-center"
                required
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-green-500 text-white py-4 rounded-xl font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Verify & Login"}
            </motion.button>
          </form>
        )}

        {/* Recaptcha container (invisible) */}
        <div id="recaptcha-container"></div>
      </motion.div>
    </div>
  );
};

export default PhoneAuth;