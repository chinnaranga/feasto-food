import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon path issues in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

function ClickHandler({ onMove }) {
    useMapEvents({
        click(e) {
            onMove(e.latlng);
        },
    });
    return null;
}

export default function CheckoutAddressMap({ onAddressSelect }) {
    // Default to Hyderabad (or roughly user's region) if geolocation fails initially
    const [pos, setPos] = useState({ lat: 17.385, lng: 78.486 });
    const [loading, setLoading] = useState(false);

    // 1. Get User Location on Mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (p) => {
                    setPos({ lat: p.coords.latitude, lng: p.coords.longitude });
                },
                (err) => console.warn("Geolocation denied/error", err),
                { enableHighAccuracy: true }
            );
        }
    }, []);

    // 2. Reverse Geocode when 'pos' changes
    useEffect(() => {
        let cancel = false;

        const fetchAddress = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.lat}&lon=${pos.lng}`
                );
                const data = await res.json();
                if (!cancel && data) {
                    onAddressSelect(data);
                }
            } catch (error) {
                console.error("Reverse geocoding failed", error);
            } finally {
                if (!cancel) setLoading(false);
            }
        };

        // Debounce slightly to avoid hammering Nominatim
        const timer = setTimeout(fetchAddress, 500);

        return () => {
            cancel = true;
            clearTimeout(timer);
        };
    }, [pos, onAddressSelect]);

    return (
        <div className="relative group">
            <MapContainer
                center={pos}
                zoom={16}
                className="h-[360px] rounded-xl z-0"
                key={`${pos.lat}-${pos.lng}`} // Force re-render center if needed, or better use MapUpdater
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                />
                <Marker
                    position={pos}
                    draggable
                    eventHandlers={{
                        dragend: (e) => setPos(e.target.getLatLng()),
                    }}
                />
                <ClickHandler onMove={setPos} />

                {/* Helper to update map view when pos changes programmatically (geolocation) */}
                <MapUpdater center={pos} />
            </MapContainer>

            {/* Loading Indicator Overlay */}
            {loading && (
                <div className="absolute inset-0 z-[1000] bg-black/20 backdrop-blur-[1px] flex items-center justify-center rounded-xl pointer-events-none">
                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <div className="absolute bottom-3 right-3 z-[400] text-[10px] text-gray-500 bg-black/60 px-2 py-1 rounded">
                Tap map or drag pin to adjust
            </div>
        </div>
    );
}

// Simple component to fly to new center when Geolocation updates state (with cleanup)
import { useMap } from "react-leaflet";
function MapUpdater({ center }) {
    const map = useMap();

    useEffect(() => {
        if (!map || !map.getContainer()) return;

        let isMounted = true;

        const updateCenter = () => {
            if (isMounted && map && map.getContainer()) {
                try {
                    map.flyTo(center, 16);
                } catch (error) {
                    // Silently catch errors if map is destroyed
                }
            }
        };

        map.whenReady(updateCenter);

        return () => {
            isMounted = false;
        };
    }, [center, map]);

    return null;
}
