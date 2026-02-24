import React, { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import Button from "../ui/Button"; // Assuming generic Button component exists
import { getCurrentPosition, getAddressFromCoordinates } from "../../services/locationService";
import { toast } from "react-hot-toast";

const CONTAINER_STYLE = {
    width: "100%",
    height: "100%",
    borderRadius: "1rem",
};

const DEFAULT_CENTER = {
    lat: 12.9716, // Bangalore
    lng: 77.5946,
};

const MAP_OPTIONS = {
    disableDefaultUI: true,
    zoomControl: false,
    gestureHandling: "greedy", // Allow easy panning on mobile
    styles: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
        { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    ],
};

export default function AddressMapPicker({ onConfirmLocation }) {
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: googleMapsApiKey || "",
    });

    const mapRef = useRef(null);
    const [center, setCenter] = useState(DEFAULT_CENTER);
    const [address, setAddress] = useState("");
    const [loadingAddress, setLoadingAddress] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    // Debounce ref for map movement
    const movementTimer = useRef(null);

    const handleMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const handleCenterChanged = () => {
        if (!mapRef.current) return;
        const newCenter = mapRef.current.getCenter();
        if (!newCenter) return;

        // Debounce Geocoding call to save API quota and performance
        if (movementTimer.current) clearTimeout(movementTimer.current);

        setLoadingAddress(true);
        movementTimer.current = setTimeout(async () => {
            const lat = newCenter.lat();
            const lng = newCenter.lng();
            try {
                const fetchedAddress = await getAddressFromCoordinates(lat, lng);
                setAddress(fetchedAddress);
            } catch (err) {
                setAddress("Could not fetch address");
            } finally {
                setLoadingAddress(false);
            }
        }, 800); // Wait 800ms after movement stops
    };

    const handleCurrentLocation = async () => {
        setIsLocating(true);
        try {
            const pos = await getCurrentPosition();
            setCenter(pos);
            mapRef.current?.panTo(pos);
            mapRef.current?.setZoom(16);
            toast.success("Location detected!");
        } catch (error) {
            toast.error("Could not access location. Please check permissions.");
        } finally {
            setIsLocating(false);
        }
    };

    const handleConfirm = () => {
        if (!mapRef.current) return;
        const centerObj = mapRef.current.getCenter();
        onConfirmLocation({
            lat: centerObj.lat(),
            lng: centerObj.lng(),
            address: address
        });
    };

    // Fallback UI if no API Key
    if (!googleMapsApiKey) {
        return (
            <div className="bg-[#18181b] border border-white/5 rounded-2xl h-[400px] flex flex-col items-center justify-center text-center p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Bangalore&zoom=13&size=600x300&maptype=roadmap&key=')] bg-cover grayscale opacity-20 group-hover:opacity-30 transition-opacity" />

                <div className="z-10 bg-black/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 max-w-sm">
                    <MapPin className="mx-auto text-orange-500 mb-4 animate-bounce" size={40} />
                    <h3 className="text-xl font-bold mb-2">Map Unavailable</h3>
                    <p className="text-gray-400 mb-6 text-sm">
                        We couldn't load the map (Missing API Key). <br />
                        Please enter your address manually.
                    </p>
                    <Button onClick={() => onConfirmLocation(null)} variant="primary">
                        Enter Address Manually
                    </Button>
                </div>
            </div>
        );
    }

    if (!isLoaded) return <div className="h-[400px] bg-[#18181b] animate-pulse rounded-2xl flex items-center justify-center text-gray-500">Loading Map...</div>;

    return (
        <div className="relative h-[450px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <GoogleMap
                mapContainerStyle={CONTAINER_STYLE}
                center={center}
                zoom={15}
                options={MAP_OPTIONS}
                onLoad={handleMapLoad}
                onCenterChanged={handleCenterChanged}
            >
                {/* We don't use Marker here, we use a fixed center pin overlay */}
            </GoogleMap>

            {/* Center Pin Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex flex-col items-center pb-8">
                <MapPin
                    size={40}
                    className="text-orange-500 drop-shadow-2xl fill-orange-500/20"
                    strokeWidth={2.5}
                />
                <div className="w-2 h-2 bg-black/50 rounded-full blur-[2px]" />
            </div>

            {/* Top Controls */}
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={handleCurrentLocation}
                    disabled={isLocating}
                    className="bg-black/80 backdrop-blur-md text-white p-3 rounded-full shadow-lg border border-white/10 hover:bg-orange-600 transition-all disabled:opacity-50"
                    title="Use Current Location"
                >
                    {isLocating ? <Loader2 className="animate-spin" size={20} /> : <Navigation size={20} />}
                </button>
            </div>

            {/* Bottom Address Card */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl z-20">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Testing Location...</p>
                <div className="flex items-start gap-3 mb-4">
                    <MapPin className="text-orange-500 shrink-0 mt-0.5" size={18} />
                    {loadingAddress ? (
                        <div className="h-5 w-3/4 bg-white/10 animate-pulse rounded" />
                    ) : (
                        <p className="text-sm font-medium text-gray-200 line-clamp-2 leading-relaxed">
                            {address || "Move map to select location"}
                        </p>
                    )}
                </div>
                <Button
                    className="w-full"
                    onClick={handleConfirm}
                    disabled={loadingAddress || !address}
                >
                    Confirm Location
                </Button>
            </div>
        </div>
    );
}
