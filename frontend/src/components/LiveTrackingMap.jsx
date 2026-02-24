import React, { useMemo } from "react";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { MapPin, Navigation } from "lucide-react";

const MAP_CONTAINER_STYLE = {
    width: "100%",
    height: "100%",
    borderRadius: "1rem",
};

const DEFAULT_CENTER = {
    lat: 12.9716, // Bangalore default
    lng: 77.5946,
};

const MAP_OPTIONS = {
    disableDefaultUI: true,
    zoomControl: false,
    styles: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
        { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    ],
};

export default function LiveTrackingMap({
    restaurantLocation,
    customerLocation,
    riderLocation
}) {
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    // const { isLoaded, loadError } = useJsApiLoader({
    //     id: "google-map-script",
    //     googleMapsApiKey: googleMapsApiKey || "", // Fail gracefully if missing
    // });
    const isLoaded = false;
    const loadError = null;

    const center = useMemo(() => riderLocation || restaurantLocation || DEFAULT_CENTER, [riderLocation, restaurantLocation]);

    // If no API key, show Dev Placeholder
    if (!googleMapsApiKey) {
        return (
            <div className="w-full h-full bg-[#18181b] rounded-2xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Fake Map Background */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Bangalore&zoom=13&size=600x300&maptype=roadmap&key=')] bg-cover grayscale" />

                <div className="z-10 bg-black/60 backdrop-blur-md p-6 rounded-xl border border-white/10 text-center max-w-sm">
                    <Navigation size={40} className="text-orange-500 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-white">Live Tracking Demo</h3>
                    <p className="text-sm text-gray-400 mt-2">
                        Map requires a valid Google Maps API Key in `.env`. <br />
                        <span className="text-orange-400 mt-2 block font-mono text-xs">VITE_GOOGLE_MAPS_API_KEY=missing</span>
                    </p>

                    {/* Simulated Rider Pos */}
                    <div className="mt-4 flex items-center justify-center gap-4 text-xs">
                        <div className="flex items-center gap-1 text-blue-400">
                            <div className="w-2 h-2 rounded-full bg-blue-500" /> Rider
                        </div>
                        <div className="flex items-center gap-1 text-green-400">
                            <div className="w-2 h-2 rounded-full bg-green-500" /> You
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loadError) return <div className="text-red-500">Map Load Error</div>;
    if (!isLoaded) return <div className="text-gray-500">Loading Map...</div>;

    return (
        <div className="w-full h-full rounded-2xl overflow-hidden border border-white/5 relative">
            <GoogleMap
                mapContainerStyle={MAP_CONTAINER_STYLE}
                center={center}
                zoom={14}
                options={MAP_OPTIONS}
            >
                {/* Restaurant Marker */}
                {restaurantLocation && (
                    <Marker position={restaurantLocation} icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }} />
                )}

                {/* Customer Marker */}
                {customerLocation && (
                    <Marker position={customerLocation} icon={{ url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png" }} />
                )}

                {/* Live Rider Marker */}
                {riderLocation && (
                    <Marker
                        position={riderLocation}
                        icon={{
                            path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                            scale: 6,
                            fillColor: "#f97316", // Orange
                            fillOpacity: 1,
                            strokeWeight: 2,
                            strokeColor: "#FFFFFF",
                            rotation: riderLocation.heading || 0
                        }}
                    />
                )}

                {/* Simple Polyline (Not real routing without Directions API cost) */}
                {riderLocation && customerLocation && (
                    <Polyline
                        path={[riderLocation, customerLocation]}
                        options={{ strokeColor: "#f97316", strokeOpacity: 0.8, strokeWeight: 4, geodesic: true }}
                    />
                )}
            </GoogleMap>

            {/* Simulation Overlay if needed */}
            <div className="absolute top-4 right-4 bg-black/80 text-white text-xs px-2 py-1 rounded border border-white/10">
                LIVE
            </div>
        </div>
    );
}
