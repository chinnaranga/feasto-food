import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  /* ------------------ SUBSCRIBE HANDLER ------------------ */
  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    // simulate API delay
    await new Promise((res) => setTimeout(res, 1200));

    const subscribers =
      JSON.parse(localStorage.getItem("aerobite_subscribers")) || [];

    if (subscribers.includes(email)) {
      toast("⚠️ You’re already subscribed!", { icon: "👀" });
      setIsSubmitting(false);
      return;
    }

    subscribers.push(email);
    localStorage.setItem(
      "aerobite_subscribers",
      JSON.stringify(subscribers)
    );

    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success("🎉 You’re subscribed!");

    setEmail("");

    // reset success state
    setTimeout(() => setIsSuccess(false), 2500);
  };

  /* ------------------ AI PROMPT HANDLER ------------------ */
  const handleAIPrompt = () => {
    toast("🤖 AI: Tell me your mood & cravings!", {
      icon: "✨",
    });
  };

  return (
    <motion.footer
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative mt-32 border-t border-white/10 bg-[#0b0b0e] text-white"
    >
      {/* Glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-32 h-32 bg-gradient-to-t from-black via-black/80 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* BRAND */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-600">
                A
              </span>
              AeroBite
            </div>

            <p className="text-sm leading-relaxed text-gray-400">
              Premium food discovery powered by AI, curated chefs, and delightful
              delivery experiences.
            </p>

            {/* SOCIAL ICONS WITH TOOLTIP */}
            <div className="flex gap-3">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter / X" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="group relative">
                  <button className="rounded-full border border-white/10 bg-white/5 p-2 text-gray-400 transition hover:border-orange-500/40 hover:text-white">
                    <Icon size={16} />
                  </button>
                  <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* EXPLORE */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Explore
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {["Home", "Restaurants", "Offers", "Blog", "Careers"].map(item => (
                <li
                  key={item}
                  className="cursor-pointer transition hover:text-white"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Contact
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex gap-3">
                <MapPin size={16} className="text-orange-400" />
                123 Premium Street, Foodville
              </li>
              <li className="flex gap-3">
                <Phone size={16} className="text-orange-400" />
                +1 (555) 123-4567
              </li>
              <li className="flex gap-3">
                <Mail size={16} className="text-orange-400" />
                support@aerobite.com
              </li>
            </ul>
          </div>

          {/* AI CTA + SUBSCRIBE */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">
              AI Food Assistant
            </h4>

            <p className="mb-4 text-sm text-gray-400">
              Let AI decide your next meal in seconds.
            </p>

            {/* AI CTA */}
            <button
              onClick={handleAIPrompt}
              className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 px-4 py-3 text-sm font-semibold transition hover:opacity-90"
            >
              <Sparkles size={16} />
              What should I eat?
            </button>

            {/* SUBSCRIBE */}
            <div className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                disabled={isSubmitting || isSuccess}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-60"
              />

              <motion.button
                onClick={handleSubscribe}
                disabled={isSubmitting || isSuccess}
                whileTap={{ scale: 0.96 }}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2
                  ${isSuccess
                    ? "bg-green-500 text-white"
                    : "bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90"
                  }
                  disabled:cursor-not-allowed`}
              >
                {isSubmitting && (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                  />
                )}

                {!isSubmitting && !isSuccess && "Subscribe"}

                {isSuccess && "Subscribed ✓"}
              </motion.button>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-gray-500 md:flex-row">
          <span>© 2026 AeroBite. All rights reserved.</span>
          <span>
            Crafted with <span className="text-red-500">❤</span> for food lovers
          </span>
        </div>
      </div>
    </motion.footer>
  );
}