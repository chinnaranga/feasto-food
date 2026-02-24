import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Search, ArrowRight, Sparkles } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { Button } from "./ui/Button";
import FiaMascot from "./FiaMascot";

/* -------------------- MOTION -------------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const float = {
  animate: {
    y: [0, -12, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
};

/* -------------------- COMPONENT -------------------- */

export default function Hero() {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const { location, search } = state;

  // ✅ FIX: Handle Explore button click - navigate to restaurants with search query
  const handleExplore = useCallback(() => {
    // Dispatch search to global state (even if empty - allows browsing all)
    dispatch({ type: "SET_SEARCH", payload: search });
    navigate("/restaurants");
  }, [dispatch, navigate, search]);

  // ✅ FIX: Handle Enter key press for premium keyboard UX
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      handleExplore();
    }
  }, [handleExplore]);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      dispatch({
        type: "SET_LOCATION",
        payload: "Location not supported",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () =>
        dispatch({
          type: "SET_LOCATION",
          payload: "Using current location",
        }),
      () =>
        dispatch({
          type: "SET_LOCATION",
          payload: "Location unavailable",
        })
    );
  }, [dispatch]);

  const quickSearches = [
    "Pizza",
    "Burgers",
    "Sushi",
    "Indian",
    "Healthy",
    "Desserts",
  ];

  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-[#0f0f12] px-6 pt-28 md:px-20">
      {/* Sign In Button (Top Right) */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-white hover:bg-white/10 hover:border-white/20 transition-all"
        >
          Sign In
        </button>
      </div>
      {/* Ambient gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-1/4 -left-1/4 h-[45%] w-[45%] rounded-full bg-[var(--color-brand-primary)]/10 blur-[140px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[45%] w-[45%] rounded-full bg-[var(--color-brand-secondary)]/10 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-16 md:flex-row">
        {/* LEFT */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.8 }}
          className="flex-1 text-center md:text-left"
        >
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-aerobite-primary/20 bg-aerobite-primary/10 px-4 py-2 text-sm font-semibold text-aerobite-primary backdrop-blur">
            <Sparkles size={14} />
            AI-powered personal food concierge
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
            Your personal <br />
            <span className="text-aerobite-primary">food concierge</span>
          </h1>

          <p className="mb-10 max-w-xl text-lg leading-relaxed text-gray-400">
            AeroBite uses AI to understand your cravings, time, and health — so every meal feels hand-picked for you.
          </p>

          {/* SEARCH */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.2 }}
            className="flex max-w-2xl flex-col gap-4"
          >
            <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-[#18181b] p-2 shadow-2xl md:flex-row">
              {/* Location */}
              <div className="flex h-14 flex-1 items-center rounded-xl border border-white/5 bg-[#0f0f12] px-4 focus-within:border-[var(--color-brand-primary)]">
                <MapPin className="text-gray-400" size={18} />
                <input
                  value={location}
                  onChange={e =>
                    dispatch({
                      type: "SET_LOCATION",
                      payload: e.target.value,
                    })
                  }
                  placeholder="Delivery location"
                  className="w-full bg-transparent px-3 text-white placeholder-gray-500 focus:outline-none"
                />
                <button
                  onClick={detectLocation}
                  className="text-xs text-[var(--color-brand-secondary)] hover:underline"
                >
                  Locate me
                </button>
              </div>

              {/* Search */}
              <div className="flex h-14 flex-[2] items-center rounded-xl border border-white/5 bg-[#0f0f12] px-4 focus-within:border-[var(--color-brand-primary)]">
                <Search className="text-gray-400" size={18} />
                <input
                  value={search}
                  onChange={e =>
                    dispatch({
                      type: "SET_SEARCH",
                      payload: e.target.value,
                    })
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="What are you craving right now?"
                  className="w-full bg-transparent px-3 text-white placeholder-gray-500 focus:outline-none"
                />
              </div>

              <Button
                size="lg"
                className="h-14 rounded-xl px-10 bg-aerobite-primary hover:bg-aerobite-accent text-white"
                onClick={handleExplore}
              >
                Get My Recommendation →
              </Button>
            </div>

            {/* Quick intents */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Try:</span>
              {quickSearches.map((item, i) => (
                <motion.button
                  key={item}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  onClick={() => {
                    dispatch({ type: "SET_SEARCH", payload: item });
                    navigate("/restaurants");
                  }}
                  className="rounded-full border border-white/5 bg-white/5 px-3 py-1 text-sm text-gray-300 transition hover:border-[var(--color-brand-primary)] hover:text-white"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
          className="relative flex-1 max-w-md"
        >
          <motion.img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=900&auto=format&fit=crop"
            alt="Premium food"
            className="relative z-10 rounded-[2rem] border border-white/10 shadow-2xl"
            variants={float}
            animate="animate"
          />

          {/* Floating stat */}
          <motion.div
            variants={float}
            animate="animate"
            transition={{ delay: 1 }}
            className="absolute -left-8 bottom-10 z-20 rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-500/20 p-2 text-green-500">
                <ArrowRight size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Average delivery</p>
                <p className="font-bold text-white">15–20 mins</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <FiaMascot state="welcome" />
    </section>
  );
}
