import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bike, MapPin, DollarSign, LogOut, Menu, User } from 'lucide-react';

export default function RiderLayout() {
    const { currentUser } = useAuth();
    const location = useLocation();

    // Protect Route
    if (!currentUser) {
        return <Navigate to="/rider/login" state={{ from: location }} replace />;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col">

            {/* Main Content Area - Full screen, no padding, pages handle it */}
            <main className="flex-1 w-full mx-auto relative z-0">
                <Outlet />
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-white/5 pb-safe z-50">
                <div className="max-w-lg mx-auto flex justify-around items-center h-16">
                    <NavLink to="/rider/dashboard" icon={Bike} label="Home" active={location.pathname === '/rider/dashboard' || location.pathname.includes('/rider/active')} />
                    <NavLink to="/rider/map" icon={MapPin} label="Map" active={location.pathname === '/rider/map'} />
                    <NavLink to="/rider/earnings" icon={DollarSign} label="Wallet" active={location.pathname === '/rider/earnings'} />
                    <NavLink to="/rider/profile" icon={User} label="Profile" active={location.pathname === '/rider/profile'} />
                </div>
            </nav>
        </div>
    );
}

const NavLink = ({ to, icon: Icon, label, active }) => (
    <Link to={to} className={`flex flex-col items-center justify-center w-full h-full transition-all relative ${active ? 'text-orange-500' : 'text-slate-500 hover:text-slate-300'}`}>

        {/* Active Glow */}
        {active && <div className="absolute top-0 w-12 h-0.5 bg-orange-500 shadow-[0_0_10px_#f97316] rounded-b-full"></div>}

        <Icon className={`w-5 h-5 mb-1 ${active ? 'scale-110 drop-shadow-md' : ''}`} strokeWidth={active ? 2.5 : 2} />
        <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </Link>
);
