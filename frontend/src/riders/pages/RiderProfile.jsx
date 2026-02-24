import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Shield, Mail } from 'lucide-react';

export default function RiderProfile() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/rider/login');
    };

    return (
        <div className="min-h-screen bg-[#0B1220] flex flex-col items-center pt-10 px-4 text-[#E5E7EB] font-sans">
            <h1 className="text-white text-xl font-semibold mb-8">Profile</h1>

            <div className="w-full max-w-[390px] bg-[#111A2E] rounded-2xl p-6 border border-white/5 shadow-lg">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-[#FF7A00] flex items-center justify-center text-black text-2xl font-bold mb-3 shadow-[0_0_20px_rgba(255,122,0,0.2)]">
                        {currentUser?.displayName?.[0] || <User />}
                    </div>
                    <h2 className="text-lg font-bold text-white">{currentUser?.displayName || 'Rider'}</h2>
                    <div className="flex items-center gap-1.5 mt-1 bg-green-500/10 px-2.5 py-0.5 rounded-full border border-green-500/20">
                        <Shield className="w-3 h-3 text-green-500" />
                        <span className="text-[10px] uppercase font-bold text-green-500 tracking-wide">Verified Partner</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-[#0B1220] rounded-xl border border-white/5">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-medium">Email</p>
                            <p className="text-sm text-white">{currentUser?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-[#0B1220] rounded-xl border border-white/5">
                        <User className="w-5 h-5 text-gray-500" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-medium">Rider ID</p>
                            <p className="text-sm text-white font-mono break-all">{currentUser?.uid}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full mt-8 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3.5 rounded-xl transition-all active:scale-[0.98] font-semibold"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>

            <p className="text-xs text-gray-600 mt-8">AeroBite Rider App v1.0.2</p>
        </div>
    );
}
