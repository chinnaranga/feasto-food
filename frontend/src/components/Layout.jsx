// src/components/Layout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-main)] text-[var(--text-primary)] font-sans">
      {/* Premium Glass Header */}
      <Header />

      {/* Page Content */}
      <main className="flex-grow pt-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}