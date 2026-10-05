import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@/utils/zodResolver';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Trash2, Check, ArrowRight, ShieldCheck, LogOut } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import { MOCK_RESTAURANTS } from '@/data/restaurants';

// Validation Schemas
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(10, 'Enter valid 10-digit mobile number'),
});

const addressSchema = z.object({
  label: z.string().min(2, 'Label required (e.g. Home, Studio, Office)'),
  fullAddress: z.string().min(8, 'Address must be at least 8 characters'),
  city: z.string().min(2, 'City required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit pincode'),
  landmark: z.string().optional(),
});

type ProfileFields = z.infer<typeof profileSchema>;
type AddressFields = z.infer<typeof addressSchema>;

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToastStore();
  const { user: authUser, logout } = useAuthStore();

  const {
    profile,
    updateProfile,
    addresses,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    favorites,
    toggleFavorite,
    dietaryPrefs,
    toggleDietaryPref,
  } = useUserStore();

  // Resolve authentic user details across stores
  const effectiveProfile = {
    name: profile.name || authUser?.name || authUser?.displayName || 'Feasto Member',
    email: profile.email || authUser?.email || 'member@feasto.food',
    phone: profile.phone || authUser?.phone || '+91 98201 44821',
    joinedDate:
      profile.joinedDate ||
      (authUser?.createdAt
        ? new Date(authUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'March 2026'),
    avatar: profile.avatar || authUser?.profilePhoto || '',
  };

  // Keep userStore synced if it had empty defaults
  useEffect(() => {
    if (authUser && (!profile.name || !profile.email)) {
      updateProfile({
        name: effectiveProfile.name,
        email: effectiveProfile.email,
        phone: effectiveProfile.phone,
        joinedDate: effectiveProfile.joinedDate,
      });
    }
  }, [authUser]);

  const [activeTab, setActiveTab] = useState<'details' | 'addresses' | 'taste' | 'favorites'>('details');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    setValue: setProfileValue,
    formState: { errors: profileErrors },
  } = useForm<ProfileFields>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: effectiveProfile.name,
      email: effectiveProfile.email,
      phone: effectiveProfile.phone,
    },
  });

  useEffect(() => {
    setProfileValue('name', effectiveProfile.name);
    setProfileValue('email', effectiveProfile.email);
    setProfileValue('phone', effectiveProfile.phone);
  }, [effectiveProfile.name, effectiveProfile.email, effectiveProfile.phone, setProfileValue]);

  const onProfileSave = (data: ProfileFields) => {
    updateProfile(data);
    setIsEditingProfile(false);
    addToast({ message: 'Culinary Passport credentials updated!', type: 'success' });
  };

  // Address Form
  const {
    register: registerAddress,
    handleSubmit: handleAddressSubmit,
    reset: resetAddressForm,
    formState: { errors: addressErrors },
  } = useForm<AddressFields>({
    resolver: zodResolver(addressSchema),
  });

  const onAddressSave = (data: AddressFields) => {
    addAddress({
      label: data.label,
      fullAddress: data.fullAddress,
      city: data.city,
      pincode: data.pincode,
      landmark: data.landmark || undefined,
      isDefault: addresses.length === 0,
    });
    setShowAddressForm(false);
    resetAddressForm();
    addToast({ message: 'New delivery coordinates registered!', type: 'success' });
  };

  const DIETARY_OPTIONS = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'High Protein',
    'Wood-Fired',
    'Saffron & Dum',
    'Artisanal Fermented',
    'Low Carb'
  ];

  const favoritedKitchens = MOCK_RESTAURANTS.filter((r) => favorites.includes(r.id));
  const initials = effectiveProfile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'FM';

  const handleSignOut = async () => {
    await logout();
    addToast({ message: 'Passport session closed.', type: 'info' });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F3F0E8] text-[#141518] selection:bg-[#D7F04A] selection:text-[#141518] pt-28 pb-32 select-none antialiased text-left">
      <div className="max-w-[1300px] mx-auto px-6 sm:px-12 space-y-12">
        
        {/* ── MASTHEAD & CULINARY PASSPORT HEADER ── */}
        <div className="border-b-2 border-[#141518] pb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#1B3BFF]">
                CULINARY IDENTITY PROTOCOL // 01
              </span>
              <span className="font-mono text-xs text-[#70727D]">·</span>
              <span className="px-2 py-0.5 bg-[#D7F04A] text-[#141518] font-mono text-[10px] font-black uppercase tracking-wider">
                ● PASSPORT ACTIVE
              </span>
            </div>

            <h1 className="font-display font-black text-5xl sm:text-7xl tracking-tight text-[#141518] leading-[0.95] uppercase">
              DINING<br />PASSPORT.
            </h1>
          </div>

          {/* User Architectural Identity Monogram Card */}
          <div className="flex items-center gap-5 p-5 bg-white border border-[#141518] shadow-[4px_4px_0px_0px_#141518] max-w-md">
            {/* Monogram Box (Never a broken image!) */}
            <div className="w-16 h-16 bg-[#141518] text-[#F3F0E8] flex items-center justify-center font-mono font-black text-2xl shrink-0">
              {initials}
            </div>

            <div className="space-y-1 overflow-hidden">
              <h2 className="font-heading font-black text-xl text-[#141518] uppercase tracking-tight truncate">
                {effectiveProfile.name}
              </h2>
              <p className="font-mono text-xs text-[#52555F] truncate">
                {effectiveProfile.email}
              </p>
              <div className="font-mono text-[10px] text-[#70727D] uppercase tracking-wider pt-0.5">
                MEMBER SINCE {effectiveProfile.joinedDate}
              </div>
            </div>
          </div>

        </div>

        {/* ── HORIZONTAL ARCHITECTURAL NAVIGATION ── */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#141518]/20 pb-4 font-mono text-xs uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 border transition-colors cursor-pointer ${
              activeTab === 'details'
                ? 'bg-[#141518] text-[#F3F0E8] border-[#141518] font-bold'
                : 'bg-white text-[#52555F] border-[#141518]/20 hover:border-[#141518] hover:text-[#141518]'
            }`}
          >
            01 CREDENTIALS
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2 border transition-colors cursor-pointer ${
              activeTab === 'addresses'
                ? 'bg-[#141518] text-[#F3F0E8] border-[#141518] font-bold'
                : 'bg-white text-[#52555F] border-[#141518]/20 hover:border-[#141518] hover:text-[#141518]'
            }`}
          >
            02 DESTINATIONS ({addresses.length})
          </button>
          <button
            onClick={() => setActiveTab('taste')}
            className={`px-4 py-2 border transition-colors cursor-pointer ${
              activeTab === 'taste'
                ? 'bg-[#141518] text-[#F3F0E8] border-[#141518] font-bold'
                : 'bg-white text-[#52555F] border-[#141518]/20 hover:border-[#141518] hover:text-[#141518]'
            }`}
          >
            03 TASTE PREFERENCES ({dietaryPrefs.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 border transition-colors cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-[#141518] text-[#F3F0E8] border-[#141518] font-bold'
                : 'bg-white text-[#52555F] border-[#141518]/20 hover:border-[#141518] hover:text-[#141518]'
            }`}
          >
            04 SAVED KITCHENS ({favoritedKitchens.length})
          </button>
        </div>

        {/* ── TAB CONTENT CANVASES ── */}
        <AnimatePresence mode="wait">
          
          {/* ── 01. CREDENTIALS CANVAS ── */}
          {activeTab === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#141518]/15 pb-4">
                <div>
                  <h3 className="font-heading font-black text-2xl uppercase tracking-tight text-[#141518]">
                    VERIFIED PASSPORT DETAILS
                  </h3>
                  <p className="font-mono text-xs text-[#70727D] mt-0.5">
                    Your authenticated contact credentials for delivery dispatches and invoice generation.
                  </p>
                </div>

                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="px-5 py-2.5 bg-white border border-[#141518] hover:bg-[#141518] hover:text-[#F3F0E8] font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    EDIT CREDENTIALS →
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form
                  onSubmit={handleProfileSubmit(onProfileSave)}
                  className="bg-white border border-[#141518] p-8 max-w-xl space-y-5 shadow-[4px_4px_0px_0px_#141518]"
                >
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#52555F]">
                      Legal Dining Name
                    </label>
                    <input
                      {...registerProfile('name')}
                      className="w-full px-4 py-3 bg-[#F8F6F0] border border-[#141518]/30 focus:border-[#141518] text-sm font-sans text-[#141518] outline-none"
                    />
                    {profileErrors.name && (
                      <p className="font-mono text-xs text-[#661527]">{profileErrors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#52555F]">
                      Digital Dispatch Email
                    </label>
                    <input
                      {...registerProfile('email')}
                      className="w-full px-4 py-3 bg-[#F8F6F0] border border-[#141518]/30 focus:border-[#141518] text-sm font-sans text-[#141518] outline-none"
                    />
                    {profileErrors.email && (
                      <p className="font-mono text-xs text-[#661527]">{profileErrors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#52555F]">
                      Mobile Contact Number
                    </label>
                    <input
                      {...registerProfile('phone')}
                      className="w-full px-4 py-3 bg-[#F8F6F0] border border-[#141518]/30 focus:border-[#141518] text-sm font-sans text-[#141518] outline-none"
                    />
                    {profileErrors.phone && (
                      <p className="font-mono text-xs text-[#661527]">{profileErrors.phone.message}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#141518] text-[#F3F0E8] hover:bg-[#1B3BFF] font-mono text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      SAVE IDENTITY →
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-6 py-3 border border-[#141518]/30 hover:border-[#141518] font-mono text-xs uppercase tracking-wider cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white border border-[#141518]/20 p-6 space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#70727D] block">
                      FULL NAME
                    </span>
                    <span className="font-heading font-black text-xl text-[#141518] block">
                      {effectiveProfile.name}
                    </span>
                  </div>

                  <div className="bg-white border border-[#141518]/20 p-6 space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#70727D] block">
                      EMAIL ADDRESS
                    </span>
                    <span className="font-mono text-sm font-bold text-[#141518] block truncate">
                      {effectiveProfile.email}
                    </span>
                  </div>

                  <div className="bg-white border border-[#141518]/20 p-6 space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#70727D] block">
                      MOBILE NUMBER
                    </span>
                    <span className="font-mono text-sm font-bold text-[#141518] block">
                      {effectiveProfile.phone}
                    </span>
                  </div>

                  <div className="bg-white border border-[#141518]/20 p-6 space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#70727D] block">
                      PASSPORT REGISTRATION
                    </span>
                    <span className="font-mono text-sm font-bold text-[#1B3BFF] block">
                      {effectiveProfile.joinedDate}
                    </span>
                  </div>
                </div>
              )}

              {/* Security & Sign Out Section */}
              <div className="pt-8 border-t border-[#141518]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#141518] block">
                    SESSION STATUS: SECURE
                  </span>
                  <p className="font-mono text-[11px] text-[#70727D]">
                    Authenticated via Feasto Identity Engine. Token auto-refreshes seamlessly.
                  </p>
                </div>

                <button
                  onClick={handleSignOut}
                  className="px-5 py-3 border border-[#661527] text-[#661527] hover:bg-[#661527] hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2"
                >
                  <LogOut size={14} />
                  <span>SIGN OUT OF THIS DEVICE →</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ── 02. SAVED DESTINATIONS CANVAS ── */}
          {activeTab === 'addresses' && (
            <motion.div
              key="addresses"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#141518]/15 pb-4">
                <div>
                  <h3 className="font-heading font-black text-2xl uppercase tracking-tight text-[#141518]">
                    SAVED DELIVERY DESTINATIONS
                  </h3>
                  <p className="font-mono text-xs text-[#70727D] mt-0.5">
                    Pre-cleared urban coordinates for zero-latency courier handoff.
                  </p>
                </div>

                {!showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="px-5 py-2.5 bg-[#141518] text-[#F3F0E8] hover:bg-[#1B3BFF] font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Plus size={14} />
                    <span>ADD DESTINATION +</span>
                  </button>
                )}
              </div>

              {/* Add Address Form */}
              {showAddressForm && (
                <form
                  onSubmit={handleAddressSubmit(onAddressSave)}
                  className="bg-white border border-[#141518] p-8 max-w-xl space-y-4 shadow-[4px_4px_0px_0px_#141518]"
                >
                  <h4 className="font-heading font-black text-lg uppercase text-[#141518]">
                    NEW URBAN COORDINATE
                  </h4>

                  <div className="space-y-1">
                    <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#52555F]">
                      Location Label
                    </label>
                    <input
                      {...registerAddress('label')}
                      placeholder="e.g. Home, Bandra Studio, Office"
                      className="w-full px-4 py-2.5 bg-[#F8F6F0] border border-[#141518]/30 focus:border-[#141518] text-sm font-sans outline-none"
                    />
                    {addressErrors.label && (
                      <p className="font-mono text-xs text-[#661527]">{addressErrors.label.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#52555F]">
                      Complete Street Address
                    </label>
                    <textarea
                      rows={2}
                      {...registerAddress('fullAddress')}
                      placeholder="Flat, building, road, wing"
                      className="w-full px-4 py-2.5 bg-[#F8F6F0] border border-[#141518]/30 focus:border-[#141518] text-sm font-sans outline-none resize-none"
                    />
                    {addressErrors.fullAddress && (
                      <p className="font-mono text-xs text-[#661527]">{addressErrors.fullAddress.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#52555F]">
                        City
                      </label>
                      <input
                        {...registerAddress('city')}
                        placeholder="Mumbai"
                        className="w-full px-4 py-2.5 bg-[#F8F6F0] border border-[#141518]/30 focus:border-[#141518] text-sm font-sans outline-none"
                      />
                      {addressErrors.city && (
                        <p className="font-mono text-xs text-[#661527]">{addressErrors.city.message}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#52555F]">
                        PIN Code
                      </label>
                      <input
                        {...registerAddress('pincode')}
                        placeholder="400050"
                        className="w-full px-4 py-2.5 bg-[#F8F6F0] border border-[#141518]/30 focus:border-[#141518] text-sm font-sans outline-none"
                      />
                      {addressErrors.pincode && (
                        <p className="font-mono text-xs text-[#661527]">{addressErrors.pincode.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#141518] text-[#F3F0E8] hover:bg-[#1B3BFF] font-mono text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      SAVE DESTINATION →
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-6 py-3 border border-[#141518]/30 font-mono text-xs uppercase tracking-wider cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              )}

              {/* Address List */}
              {addresses.length === 0 ? (
                <div className="py-16 text-center font-mono text-xs text-[#70727D] border border-dashed border-[#141518]/25 p-8">
                  NO SAVED DESTINATIONS. CLICK "ADD DESTINATION +" ABOVE.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="bg-white border border-[#141518] p-6 flex flex-col justify-between space-y-4 shadow-[4px_4px_0px_0px_#141518]"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-black text-sm uppercase tracking-wider text-[#141518]">
                            {addr.label}
                          </span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 bg-[#141518] text-[#D7F04A] font-mono text-[9px] font-bold uppercase">
                              PRIMARY
                            </span>
                          )}
                        </div>
                        <p className="font-sans text-xs text-[#52555F] leading-relaxed">
                          {addr.fullAddress}
                        </p>
                        <p className="font-mono text-xs text-[#70727D]">
                          {addr.city} — {addr.pincode}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#141518]/15 flex items-center justify-between font-mono text-xs">
                        {!addr.isDefault ? (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-[#1B3BFF] font-bold uppercase hover:underline cursor-pointer"
                          >
                            SET PRIMARY →
                          </button>
                        ) : (
                          <span className="text-[#70727D] text-[10px] uppercase">ACTIVE DEFAULT</span>
                        )}

                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="text-[#70727D] hover:text-[#661527] cursor-pointer p-1"
                          title="Remove address"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── 03. TASTE PREFERENCES CANVAS ── */}
          {activeTab === 'taste' && (
            <motion.div
              key="taste"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-8"
            >
              <div className="border-b border-[#141518]/15 pb-4">
                <h3 className="font-heading font-black text-2xl uppercase tracking-tight text-[#141518]">
                  CULINARY PROFILE & TASTE VECTORS
                </h3>
                <p className="font-mono text-xs text-[#70727D] mt-0.5">
                  Select your natural eating affinities. The canvas surfaces corresponding dishes quietly and automatically.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {DIETARY_OPTIONS.map((opt) => {
                  const isSelected = dietaryPrefs.includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleDietaryPref(opt)}
                      className={`p-5 text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#141518] text-[#F3F0E8] border-[#141518] shadow-[4px_4px_0px_0px_#1B3BFF]'
                          : 'bg-white text-[#141518] border-[#141518]/25 hover:border-[#141518]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#8A8D98]">
                          {isSelected ? 'AFFINITY ACTIVE' : 'TAP TO ADD'}
                        </span>
                        {isSelected && <Check size={14} className="text-[#D7F04A]" />}
                      </div>
                      <h4 className="font-heading font-black text-base uppercase leading-tight">
                        {opt}
                      </h4>
                    </button>
                  );
                })}
              </div>

              <div className="p-6 bg-white border border-[#141518] font-mono text-xs space-y-2 text-left">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#1B3BFF] block">
                  CANVAS BEHAVIOR
                </span>
                <p className="text-[#52555F] leading-relaxed">
                  Your taste vectors influence the "What's worth eating" visual compositions on the home canvas, filtering allergen profiles and tailoring spontaneous recommendations.
                </p>
              </div>
            </motion.div>
          )}

          {/* ── 04. SAVED KITCHENS CANVAS ── */}
          {activeTab === 'favorites' && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-8"
            >
              <div className="border-b border-[#141518]/15 pb-4">
                <h3 className="font-heading font-black text-2xl uppercase tracking-tight text-[#141518]">
                  CURATED KITCHEN ARCHIVE
                </h3>
                <p className="font-mono text-xs text-[#70727D] mt-0.5">
                  Restaurants whose culinary stories you have bookmarked.
                </p>
              </div>

              {favoritedKitchens.length === 0 ? (
                <div className="py-20 text-center font-mono text-xs text-[#70727D] border border-dashed border-[#141518]/25 p-8">
                  <p className="uppercase">NO KITCHENS BOOKMARKED YET.</p>
                  <Link
                    to="/restaurants"
                    className="inline-block mt-4 px-5 py-2.5 bg-[#141518] text-[#F3F0E8] font-bold uppercase hover:bg-[#1B3BFF]"
                  >
                    EXPLORE KITCHENS →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoritedKitchens.map((res) => (
                    <div
                      key={res.id}
                      className="bg-white border border-[#141518] p-6 flex flex-col justify-between space-y-4 shadow-[4px_4px_0px_0px_#141518]"
                    >
                      <div className="space-y-2">
                        <span className="font-mono text-[10px] text-[#1B3BFF] font-bold uppercase tracking-wider block">
                          {res.cuisine.join(' · ')}
                        </span>
                        <h4 className="font-heading font-black text-xl text-[#141518] leading-tight uppercase">
                          {res.name}
                        </h4>
                        <p className="font-mono text-xs text-[#70727D]">
                          ★ {res.rating} · {res.deliveryTime} MIN DISPATCH
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#141518]/15 flex items-center justify-between font-mono text-xs">
                        <Link
                          to={`/restaurants/${res.id}`}
                          className="font-bold text-[#141518] hover:text-[#1B3BFF] uppercase"
                        >
                          OPEN KITCHEN STORY →
                        </Link>
                        <button
                          onClick={() => toggleFavorite(res.id)}
                          className="text-[#70727D] hover:text-[#661527] cursor-pointer"
                          title="Remove bookmark"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
};

export default Profile;
