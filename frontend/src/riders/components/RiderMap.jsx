import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, MapPin, Locate } from 'lucide-react';

// --- Custom Icons ---
const createIcon = (color) => {
    return new L.DivIcon({
        className: 'custom-icon',
        html: `<div style="
            background-color: ${color};
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 10px ${color}80;
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
    });
};

const riderIcon = createIcon('#3b82f6'); // Blue
const pickupIcon = createIcon('#f97316'); // Orange
const dropIcon = createIcon('#22c55e'); // Green

// --- Bounds Updater Component (with cleanup) ---
function BoundsUpdater({ riderLocation, pickupLocation, dropLocation }) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        let isMounted = true;

        const updateBounds = () => {
            if (!isMounted || !map || !map.getContainer()) return;

            const bounds = L.latLngBounds();
            let hasPoints = false;

            if (riderLocation) { bounds.extend([riderLocation.lat, riderLocation.lng]); hasPoints = true; }
            if (pickupLocation) { bounds.extend([pickupLocation.lat, pickupLocation.lng]); hasPoints = true; }
            if (dropLocation) { bounds.extend([dropLocation.lat, dropLocation.lng]); hasPoints = true; }

            if (hasPoints) {
                try {
                    map.fitBounds(bounds, { padding: [50, 50] });
                } catch (error) {
                    // Silently catch errors if map is destroyed
                }
            }
        };

        map.whenReady(updateBounds);

        return () => {
            isMounted = false;
        };
    }, [map, riderLocation, pickupLocation, dropLocation]);

    return null;
}

export default function RiderMap({ pickupLocation, dropLocation, status, riderLocation: propRiderLocation, readOnly = false }) {
    const [internalLocation, setInternalLocation] = useState(null);

    // Priority: Prop > Internal
    const riderLocation = propRiderLocation || internalLocation;

    // 1. Get Live Location (Only if not provided via props/readOnly)
    useEffect(() => {
        if (readOnly || propRiderLocation || !navigator.geolocation) return;

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setInternalLocation({ lat: latitude, lng: longitude });
            },
            (error) => console.error("Location Error:", error),
            { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [readOnly, propRiderLocation]);

    // Destination Logic for "Open in Maps"
    const getDestination = () => {
        if (status === 'picked_up') return dropLocation;
        return pickupLocation || dropLocation; // Fallback
    };
    const destination = getDestination();

    // Default Center (Bangalore)
    const defaultCenter = [12.9716, 77.5946];
    const initialCenter = riderLocation ? [riderLocation.lat, riderLocation.lng] : defaultCenter;

    return (
        <div className="relative w-full h-full bg-[#18181b]">
            <MapContainer
                center={initialCenter}
                zoom={14}
                className="w-full h-full z-0"
                zoomControl={false}
            >
                {/* Dark Mode Tiles */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {/* Markers */}
                {riderLocation && (
                    <Marker position={[riderLocation.lat, riderLocation.lng]} icon={riderIcon}>
                        <Popup>You (Rider)</Popup>
                    </Marker>
                )}

                {pickupLocation && (
                    <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={pickupIcon}>
                        <Popup>Pickup Location</Popup>
                    </Marker>
                )}

                {dropLocation && (
                    <Marker position={[dropLocation.lat, dropLocation.lng]} icon={dropIcon}>
                        <Popup>Drop Location</Popup>
                    </Marker>
                )}

                {/* Auto-Fit Bounds */}
                <BoundsUpdater riderLocation={riderLocation} pickupLocation={pickupLocation} dropLocation={dropLocation} />
            </MapContainer>

            {/* Floating Navigation Button */}
            {destination && riderLocation && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-700 flex items-center gap-3 cursor-pointer hover:bg-slate-800 transition-colors"
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&origin=${riderLocation.lat},${riderLocation.lng}&destination=${destination.lat},${destination.lng}`, '_blank')}
                >
                    <div className="flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-white font-bold text-sm tracking-wide">Navigate</span>
                    </div>
                </div>
            )}
        </div>
    );
}
