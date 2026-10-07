import React, { Suspense, useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Navigation,
  Compass,
  Phone,
  Radio,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  LogOut,
  ShoppingBag,
  Wallet,
  User,
  History,
  Shield,
  Layers,
} from 'lucide-react';
import useRiderStore from '../store/useRiderStore';
import useRiderNavigationStore from '../store/useRiderNavigationStore';
import { useAuthStore } from '@/store/authStore';
import { RealLiveMapCanvas } from './navigation/RiderNavigationComponents';
import {
  FeastoEditorialHeading,
  FeastoOperationalStatement,
  FeastoStatus,
  FeastoButton,
  FeastoTimeline,
  FeastoMetric,
} from '@/components/design-system';

export const RiderAppShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    profile,
    availability,
    toggleAvailability,
    activeOffer,
    activeDeliveryStep,
    advanceDeliveryStep,
    completeActiveDelivery,
  } = useRiderStore();
  const { logout } = useAuthStore();

  const {
    routeSummary,
    routePolylineCoords,
    recenterMap,
    triggerReroute,
    toggleTileMode,
    startLiveGPS,
    stopLiveGPS,
    loadRealOSRMRoute,
  } = useRiderNavigationStore();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    startLiveGPS();
    if (
      routeSummary.courierLat &&
      routeSummary.courierLng &&
      routeSummary.customerLat &&
      routeSummary.customerLng
    ) {
      loadRealOSRMRoute(
        routeSummary.courierLat,
        routeSummary.courierLng,
        routeSummary.customerLat,
        routeSummary.customerLng
      );
    }
    return () => {
      stopLiveGPS();
    };
  }, []);

  const handleSignOut = async () => {
    setMobileDrawerOpen(false);
    await logout();
    navigate('/rider/login');
  };

  // Determine if active route is map-dominant workspace
  const isMapWorkspace =
    location.pathname === '/rider' ||
    location.pathname === '/rider/dashboard' ||
    location.pathname === '/rider/dashboard/home' ||
    location.pathname === '/rider/active' ||
    location.pathname.startsWith('/rider/navigation');

  const navLinks = [
    { label: 'Today', path: '/rider/dashboard', code: '01', icon: <Navigation size={14} /> },
    { label: 'Trip Offers', path: '/rider/orders', code: '02', icon: <ShoppingBag size={14} /> },
    { label: 'Your Earnings', path: '/rider/earnings', code: '03', icon: <Wallet size={14} /> },
    { label: 'Archive', path: '/rider/history', code: '04', icon: <History size={14} /> },
    { label: 'Profile', path: '/rider/profile', code: '05', icon: <User size={14} /> },
  ];

  const deliveryStepsTimeline = [
    {
      id: 'assigned',
      label: 'Dispatch Assigned',
      status: 'completed' as const,
      timestamp: '16:42',
      description: `${activeOffer?.restaurantName || 'Restaurant'} dispatched`,
    },
    {
      id: 'pickup',
      label: 'Arrived at Restaurant',
      status: ['arrived_at_store', 'picked_up', 'arrived_at_customer', 'delivered'].includes(
        activeDeliveryStep
      )
        ? ('completed' as const)
        : ('current' as const),
      description: 'Collect sealed food bag at pass',
    },
    {
      id: 'transit',
      label: 'On the Way (In Transit)',
      status: ['picked_up', 'arrived_at_customer', 'delivered'].includes(activeDeliveryStep)
        ? ('completed' as const)
        : activeDeliveryStep === 'arrived_at_store'
        ? ('current' as const)
        : ('upcoming' as const),
      description: 'Navigating to customer destination',
    },
    {
      id: 'delivered',
      label: 'Drop-off & Handover',
      status: activeDeliveryStep === 'delivered' ? ('completed' as const) : ('upcoming' as const),
      description: 'Verify customer OTP and complete trip',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D0F12] text-[#F3F0E8] font-sans flex flex-col antialiased select-none overflow-x-hidden">
      {/* ── TOP TELEMETRY BEZEL (INSTRUMENT HEADER) ── */}
      <header className="h-16 bg-[#14161B] border-b border-[#222630] px-4 md:px-8 flex items-center justify-between shrink-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/rider/dashboard')}
            className="flex items-center gap-3 cursor-pointer text-left"
          >
            <div className="w-8 h-8 bg-[#D7F04A] text-[#141518] flex items-center justify-center font-mono font-black text-xs">
              NV
            </div>
            <div>
              <span className="font-heading font-black text-xs uppercase tracking-widest text-[#F3F0E8] block">
                FEASTO NAVIGATION
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#8E929C] block">
                VESSEL ID: {profile?.id || 'RIDER-42'} · BANDRA METROPOLE
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 ml-8 border-l border-[#222630] pl-6 font-mono text-xs uppercase tracking-wider">
            {navLinks.map((link) => {
              const active = location.pathname.startsWith(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`px-3 py-1.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#1B3BFF] text-white font-bold'
                      : 'text-[#8E929C] hover:text-white'
                  }`}
                >
                  <span className="text-[#D7F04A] font-bold">{link.code}</span>
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Controls: Duty Switcher, GPS Status, Sign Out */}
        <div className="flex items-center gap-3 font-mono text-xs">
          {/* Duty Switcher */}
          <button
            onClick={toggleAvailability}
            className={`flex items-center gap-2 px-3 py-1.5 uppercase font-bold tracking-wider cursor-pointer border transition-colors ${
              availability === 'online'
                ? 'bg-[#D7F04A] text-[#141518] border-[#D7F04A]'
                : 'bg-transparent text-[#8E929C] border-[#2E3340] hover:text-white'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                availability === 'online' ? 'bg-[#141518] animate-pulse' : 'bg-[#555A68]'
              }`}
            />
            <span>{availability === 'online' ? 'ON DUTY' : 'STANDBY'}</span>
          </button>

          {/* GPS Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#1D212A] border border-[#2E3340] text-[10px] text-[#D7F04A]">
            <Radio size={11} className="animate-pulse" />
            <span>GPS 5G RTK LOCK</span>
          </div>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1 px-2.5 py-1.5 border border-[#2E3340] hover:border-red-500 hover:text-red-400 text-[#8E929C] transition-colors cursor-pointer text-xs"
            title="Sign out of Navigation"
          >
            <LogOut size={12} />
            <span className="hidden md:inline">EXIT</span>
          </button>
        </div>
      </header>

      {/* ── MAIN WORKSPACE VIEWPORT ── */}
      {isMapWorkspace ? (
        /* ── DESKTOP: 70% MAP + 30% OPERATIONS PANEL (MAP-FIRST) ── */
        <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden min-h-[calc(100vh-64px)]">
          {/* Dominant Live Map Canvas (70% on desktop, full on mobile) */}
          <div className="flex-1 lg:w-[68%] h-[55vh] lg:h-full relative overflow-hidden bg-[#14161B]">
            <RealLiveMapCanvas
              routeSummary={routeSummary}
              polylineCoords={routePolylineCoords}
              onRecenter={recenterMap}
              onReroute={triggerReroute}
              onToggleTileMode={toggleTileMode}
            />

            {/* Floating Top Telemetry HUD Pill */}
            <div className="absolute top-4 left-4 z-[500] bg-[#14161B]/90 backdrop-blur-md border border-white/10 px-4 py-2 font-mono text-xs flex items-center gap-4 text-white">
              <div>
                <span className="text-[9px] uppercase text-[#8E929C] block">TARGET ETA</span>
                <span className="text-sm font-black text-[#D7F04A]">
                  {routeSummary.estimatedEtaMins} MINS
                </span>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div>
                <span className="text-[9px] uppercase text-[#8E929C] block">DISTANCE</span>
                <span className="text-sm font-black text-white">
                  {routeSummary.distanceRemainingKm} KM
                </span>
              </div>
              <div className="w-px h-6 bg-white/10" />
              <div>
                <span className="text-[9px] uppercase text-[#8E929C] block">SPEED</span>
                <span className="text-sm font-black text-[#15803D]">34 KM/H</span>
              </div>
            </div>
          </div>

          {/* Operations Panel (32% on desktop, bottom scroll on mobile) */}
          <div className="lg:w-[32%] shrink-0 border-t lg:border-t-0 lg:border-l border-[#222630] bg-[#14161B] p-5 sm:p-6 overflow-y-auto space-y-6 scrollbar-thin text-left">
            {activeOffer ? (
              <>
                {/* Delivery Header */}
                <div className="pb-4 border-b border-white/10 flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#D7F04A] block">
                      ACTIVE DELIVERY IN MOTION
                    </span>
                    <h2 className="font-heading font-black text-2xl uppercase text-white mt-0.5">
                      DELIVERY #{activeOffer.orderNumber}
                    </h2>
                  </div>

                  <span className="font-mono text-xs font-black px-2 py-1 bg-[#D7F04A] text-[#141518]">
                    ₹{activeOffer.payoutAmount + activeOffer.tipAmount}
                  </span>
                </div>

                {/* Spatial Pickup ➔ Dropoff Route Flow */}
                <div className="p-4 bg-[#1D212A] border border-[#2E3340] space-y-3 font-mono text-xs">
                  {/* Pickup */}
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-white text-[#141518] font-black text-[10px] flex items-center justify-center shrink-0">
                      P
                    </span>
                    <div className="flex-1">
                      <span className="text-[9px] uppercase text-[#8E929C] block">PICKUP</span>
                      <strong className="text-sm text-white font-heading font-black block">
                        {activeOffer.restaurantName}
                      </strong>
                      <span className="text-[11px] text-[#8E929C]">Waterfield Rd, Bandra West</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-2 text-[10px] text-[#1B3BFF]">
                    <span>↓</span>
                    <span>ON THE WAY (2.4 KM)</span>
                  </div>

                  {/* Dropoff */}
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 bg-[#D7F04A] text-[#141518] font-black text-[10px] flex items-center justify-center shrink-0">
                      D
                    </span>
                    <div className="flex-1">
                      <span className="text-[9px] uppercase text-[#8E929C] block">DROP-OFF</span>
                      <strong className="text-sm text-white font-heading font-black block">
                        {activeOffer.customerName}
                      </strong>
                      <span className="text-[11px] text-[#8E929C]">{activeOffer.deliveryAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Contact & Call Trigger */}
                <div className="flex items-center justify-between p-3 bg-[#181B22] border border-white/5">
                  <div className="font-mono text-xs">
                    <span className="text-[10px] text-[#8E929C] block">CONTACT GUEST</span>
                    <span className="font-bold text-white">{activeOffer.customerPhone}</span>
                  </div>
                  <a
                    href={`tel:${activeOffer.customerPhone}`}
                    className="p-2 bg-[#1B3BFF] hover:bg-[#1530d9] text-white transition-colors flex items-center gap-1.5 font-mono text-xs font-bold"
                  >
                    <Phone size={12} />
                    <span>CALL</span>
                  </a>
                </div>

                {/* Delivery Timeline Progress */}
                <div className="space-y-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#8E929C] block">
                    DELIVERY PROGRESSION
                  </span>
                  <FeastoTimeline steps={deliveryStepsTimeline} dark />
                </div>

                {/* One-Touch Action Progression Button */}
                <div className="pt-2">
                  {activeDeliveryStep === 'assigned' && (
                    <FeastoButton
                      variant="acid"
                      size="lg"
                      fullWidth
                      onClick={advanceDeliveryStep}
                    >
                      ARRIVED AT RESTAURANT →
                    </FeastoButton>
                  )}
                  {activeDeliveryStep === 'arrived_at_store' && (
                    <FeastoButton
                      variant="acid"
                      size="lg"
                      fullWidth
                      onClick={advanceDeliveryStep}
                    >
                      CONFIRM BAG PICKED UP →
                    </FeastoButton>
                  )}
                  {activeDeliveryStep === 'picked_up' && (
                    <FeastoButton
                      variant="accent"
                      size="lg"
                      fullWidth
                      onClick={advanceDeliveryStep}
                    >
                      ARRIVED AT CUSTOMER LOCATION →
                    </FeastoButton>
                  )}
                  {activeDeliveryStep === 'arrived_at_customer' && (
                    <FeastoButton
                      variant="acid"
                      size="lg"
                      fullWidth
                      onClick={completeActiveDelivery}
                    >
                      VERIFY OTP & COMPLETE TRIP ✓
                    </FeastoButton>
                  )}
                </div>
              </>
            ) : (
              <div className="p-8 border border-white/10 text-center font-mono space-y-3">
                <CheckCircle2 size={32} className="mx-auto text-[#D7F04A]" />
                <h3 className="font-heading font-black text-lg uppercase text-white">
                  STANDING BY FOR ORDERS
                </h3>
                <p className="text-xs text-[#8E929C]">
                  Keep vessel GPS active. System is dispatching high-demand orders near your zone.
                </p>
                <FeastoButton
                  variant="acid"
                  size="md"
                  onClick={() => navigate('/rider/orders')}
                >
                  VIEW AVAILABLE OFFERS →
                </FeastoButton>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── SPECIALIZED EDITORIAL WORKSPACE VIEW (EARNINGS, ARCHIVE, PROFILE) ── */
        <main className="flex-1 w-full p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
          <Suspense
            fallback={
              <div className="flex-1 flex items-center justify-center font-mono text-xs text-[#D7F04A] animate-pulse py-20">
                SYNCING SATELLITE INSTRUMENT...
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      )}

      {/* ── MOBILE INDEPENDENT BOTTOM NAVIGATION ── */}
      <nav className="lg:hidden h-14 bg-[#14161B] border-t border-[#222630] grid grid-cols-5 z-40 font-mono text-[9px] uppercase tracking-wider">
        {navLinks.map((link) => {
          const active = location.pathname.startsWith(link.path);
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                active ? 'text-[#D7F04A] font-bold' : 'text-[#8E929C]'
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default RiderAppShell;
