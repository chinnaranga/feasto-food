import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  User,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import useCart from "../context/CartContext";
import { Button } from "./ui/Button";

export default function Header({ onSearchClick }) {
  const { currentUser, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Scroll glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Failed to log out");
    }
  };

  const navLinks = [
    { title: "Home", href: "/" },
    { title: "Menu", href: "/products" },
    { title: "Restaurants", href: "/restaurants" },
    { title: "About", href: "/about" },
  ];

  const cartItemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-[#0f0f12]/80 backdrop-blur-xl border-b border-white/5"
        : "bg-transparent"
        }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl group"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[var(--color-brand-primary)] to-[var(--color-brand-secondary)] text-white transition-transform group-hover:rotate-12">
            A
          </span>
          <span className="tracking-tight group-hover:text-[var(--color-brand-secondary)] transition-colors">
            AeroBite
          </span>
        </Link>

        {/* Desktop Search */}
        <button
          onClick={onSearchClick ?? (() => { })}
          className="hidden md:flex flex-1 mx-6 max-w-md items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-400 hover:bg-white/10 transition cursor-text"
        >
          <Search size={16} />
          <span className="flex-1 text-left">Search dishes, chefs…</span>
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px]">
            ⌘K
          </kbd>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={`rounded-full px-4 py-2 text-sm transition ${location.pathname === link.href
                ? "bg-[#18181b] text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              {link.title}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link
            to="/cart"
            className="relative rounded-full p-2 hover:bg-white/10 transition"
          >
            <ShoppingCart size={20} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-[10px] font-bold">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* User */}
          {currentUser ? (
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsProfileOpen(v => !v)}
                className="flex items-center gap-2 rounded-full border border-white/10 px-2 py-1 hover:bg-white/10"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[var(--color-brand-primary)] to-purple-500 text-xs font-bold">
                  {currentUser.displayName?.[0] || "U"}
                </div>
                <ChevronDown size={14} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#18181b] shadow-xl"
                  >
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5"
                    >
                      <User size={16} /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden sm:flex gap-3">
              <Link to="/login" className="text-sm text-gray-300">
                Log in
              </Link>
              <Button
                size="sm"
                className="rounded-full"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <button
            className="md:hidden rounded-full p-2 hover:bg-white/10"
            onClick={() => setIsMenuOpen(v => !v)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-white/10 bg-[#0f0f12]"
          >
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-lg text-gray-300"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}