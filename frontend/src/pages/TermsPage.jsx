import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileText,
  Shield,
  Lock,
  Users,
  AlertTriangle,
  Mail,
  ArrowLeft,
} from "lucide-react";

// Liquid Components
import LiquidContainer from "../components/liquid/LiquidContainer";
import LiquidCard from "../components/liquid/LiquidCard";

const sections = [
  {
    icon: Users,
    title: "Account Responsibility",
    content: "You are responsible for maintaining the confidentiality of your account credentials. Do not share your password with others. All activities under your account are your responsibility.",
  },
  {
    icon: Shield,
    title: "Acceptable Use",
    content: "Use our platform responsibly and lawfully. Do not engage in any activity that could harm our service, other users, or violate any applicable laws.",
  },
  {
    icon: Lock,
    title: "Privacy & Data",
    content: "We collect and process your data in accordance with our Privacy Policy. Your personal information is encrypted and securely stored. We never sell your data to third parties.",
  },
  {
    icon: AlertTriangle,
    title: "Account Termination",
    content: "Any misuse of our services may result in suspension or termination of your account. We reserve the right to terminate accounts that violate these terms without prior notice.",
  },
  {
    icon: FileText,
    title: "Updates to Terms",
    content: "We may update these terms at any time. Continued use of our services after changes means you accept the updated terms. We will notify you of significant changes via email.",
  },
];

export default function TermsPage() {
  return (
    <LiquidContainer>
      <div className="relative min-h-screen pt-24 pb-16 px-6">
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30 liquid-glass-high"
            >
              <FileText size={32} className="text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-md">Terms & Conditions</h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 font-bold">AeroBite</span>.
              By creating an account and using our services, you agree to the following terms.
            </p>
          </motion.div>

          {/* Last Updated */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <span className="inline-block text-sm text-gray-300 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
              Last updated: December 2025
            </span>
          </motion.div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <LiquidCard className="p-6 md:p-8 hover:border-orange-500/30 transition-all group">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <section.icon className="text-orange-400" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold mb-2 text-white">{section.title}</h2>
                      <p className="text-gray-400 leading-relaxed">{section.content}</p>
                    </div>
                  </div>
                </LiquidCard>
              </motion.div>
            ))}
          </div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <LiquidCard className="bg-gradient-to-r from-orange-500/10 to-transparent p-6 md:p-8">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center">
                  <Mail className="text-orange-400" size={24} />
                </div>
                <div>
                  <p className="font-bold text-lg text-white">Have questions?</p>
                  <p className="text-gray-400">
                    Contact us at{" "}
                    <a
                      href="mailto:support@aerobite.com"
                      className="text-orange-400 hover:text-orange-300 hover:underline transition-colors"
                    >
                      support@aerobite.com
                    </a>
                  </p>
                </div>
              </div>
            </LiquidCard>
          </motion.div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-12 text-center"
          >
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-4 py-2 hover:bg-white/5 rounded-lg"
            >
              <ArrowLeft size={16} />
              Back to Signup
            </Link>
          </motion.div>
        </div>
      </div>
    </LiquidContainer>
  );
}
