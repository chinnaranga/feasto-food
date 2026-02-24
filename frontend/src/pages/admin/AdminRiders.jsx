import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Bike, Map as MapIcon, List, Search, Loader2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import LiquidCard from '../../components/liquid/LiquidCard';
import LiquidButton from '../../components/liquid/LiquidButton';
import LiquidInput from '../../components/liquid/LiquidInput';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// Map Styles (Dark Mode)
const mapStyles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
];

export default function AdminRiders() {
    const { currentUser, userToken } = useAuth();
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('list'); // 'list' | 'map'
    const [onlineOnly, setOnlineOnly] = useState(false);

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey || "" // Avoid crash if undefined
    });

    useEffect(() => {
        fetchRiders();
        const interval = setInterval(fetchRiders, 15000); // Poll every 15s
        return () => clearInterval(interval);
    }, [currentUser, userToken]);

    const fetchRiders = async () => {
        try {
            if (!currentUser) return;
            const token = userToken || await currentUser.getIdToken();

            const res = await fetch(`${API_URL}/api/admin/riders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                // Transform data for map and display
                const transformedRiders = data.map(r => ({
                    ...r,
                    id: r._id,
                    location: r.currentLocation ? { lat: r.currentLocation.lat, lng: r.currentLocation.lng } : null,
                    lastSeen: r.currentLocation?.lastUpdated || r.updatedAt
                }));
                setRiders(transformedRiders);
            } else {
                // toast.error("Failed to load riders"); // Suppress routine polling errors
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Backend Status: 'available', 'busy', 'offline'
    const filteredRiders = riders.filter(r => onlineOnly ? r.status === 'available' || r.status === 'busy' : true);

    const center = { lat: 12.9716, lng: 77.5946 }; // Bangalore Default

    return (
        <div className="space-y-6 fade-in-up">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                        <Bike className="text-orange-500" /> Rider Management
                    </h1>
                    <p className="text-gray-400 mt-1">Monitor fleet status and location</p>
                </div>

                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                    <button
                        onClick={() => setView('list')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${view === 'list' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:text-white'}`}
                    >
                        <List size={16} /> List
                    </button>
                    <button
                        onClick={() => setView('map')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors ${view === 'map' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:text-white'}`}
                    >
                        <MapIcon size={16} /> Map
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <LiquidButton
                    variant={onlineOnly ? "primary" : "secondary"}
                    onClick={() => setOnlineOnly(!onlineOnly)}
                    className="h-12"
                >
                    Show Online Only
                </LiquidButton>
                <div className="flex-1 max-w-sm">
                    <LiquidInput
                        icon={Search}
                        placeholder="Search riders..."
                        className="w-full"
                    />
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
                </div>
            ) : (
                <>
                    {view === 'list' ? (
                        <LiquidCard className="p-0 overflow-hidden" hoverEffect={false}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                                        <tr>
                                            <th className="p-6">Rider</th>
                                            <th className="p-6">Status</th>
                                            <th className="p-6">Contact</th>
                                            <th className="p-6">Wallet</th>
                                            <th className="p-6">Last Seen</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredRiders.map(rider => (
                                            <tr key={rider.id} className="hover:bg-white/5 transition-colors">
                                                <td className="p-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold border border-orange-500/20">
                                                            {rider.name?.charAt(0) || 'R'}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-white">{rider.name}</div>
                                                            <div className="text-xs text-gray-500">ID: {rider.id.slice(0, 6)}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${rider.status === 'available' ? 'bg-green-500/20 text-green-400' :
                                                        rider.status === 'busy' ? 'bg-blue-500/20 text-blue-400' :
                                                            'bg-gray-500/20 text-gray-400'
                                                        }`}>
                                                        {rider.status?.toUpperCase() || 'OFFLINE'}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-sm text-gray-400">
                                                    <div>{rider.email}</div>
                                                    <div>{rider.phoneNumber || '-'}</div>
                                                </td>
                                                <td className="p-6 font-mono text-green-400">
                                                    ₹{rider.walletBalance?.toFixed(2) || '0.00'}
                                                </td>
                                                <td className="p-6 text-sm text-gray-500">
                                                    {rider.lastSeen ? new Date(rider.lastSeen).toLocaleString() : 'Never'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {filteredRiders.length === 0 && (
                                <div className="p-10 text-center text-gray-500">No riders found.</div>
                            )}
                        </LiquidCard>
                    ) : (
                        <div className="h-[600px] rounded-2xl overflow-hidden border border-white/10 relative bg-[#18181b]">
                            {!apiKey ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                                    <div className="p-4 bg-white/5 rounded-full">
                                        <MapIcon size={32} />
                                    </div>
                                    <p>Google Maps API Key is missing.</p>
                                    <p className="text-xs">Add VITE_GOOGLE_MAPS_API_KEY to your .env file.</p>
                                </div>
                            ) : loadError ? (
                                <div className="h-full flex flex-col items-center justify-center text-red-400 gap-4">
                                    <div className="p-4 bg-red-500/10 rounded-full">
                                        <ShieldAlert size={32} />
                                    </div>
                                    <p>Failed to load Google Maps.</p>
                                </div>
                            ) : isLoaded ? (
                                <GoogleMap
                                    mapContainerStyle={{ width: '100%', height: '100%' }}
                                    center={center}
                                    zoom={12}
                                    options={{
                                        styles: mapStyles,
                                        disableDefaultUI: false,
                                        zoomControl: true,
                                        streetViewControl: false
                                    }}
                                >
                                    {filteredRiders.filter(r => r.location).map(rider => (
                                        <Marker
                                            key={rider.id}
                                            position={rider.location}
                                            title={rider.name}
                                            icon={{
                                                url: "https://maps.google.com/mapfiles/ms/icons/motorcycling.png",
                                                scaledSize: new window.google.maps.Size(30, 30)
                                            }}
                                        />
                                    ))}
                                </GoogleMap>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-3">
                                    <Loader2 className="animate-spin" size={24} />
                                    <p>Loading Map...</p>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
