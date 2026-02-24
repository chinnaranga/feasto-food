import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Package, User, Navigation } from "lucide-react";
import toast from "react-hot-toast";

// Fix for default Leaflet icons in Webpack/Vite
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconRetinaUrl: iconRetina,
    iconUrl: iconMarker,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons for Orders and Riders
const createCustomIcon = (color) => new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/markers/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const redIcon = createCustomIcon('red');
const greenIcon = createCustomIcon('green');
const goldIcon = createCustomIcon('gold');

// Component to auto-fit bounds (with cleanup)
const BoundsUpdater = ({ markers }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !map.getContainer()) return;

        let isMounted = true;

        const updateBounds = () => {
            if (!isMounted || !map || !map.getContainer() || !markers || markers.length === 0) return;

            try {
                const group = new L.FeatureGroup(markers.map(m => L.marker([m.lat, m.lng])));
                map.fitBounds(group.getBounds().pad(0.1)); // 10% padding
            } catch (error) {
                // Silently catch errors if map is destroyed
            }
        };

        if (markers && markers.length > 0) {
            map.whenReady(updateBounds);
        }

        return () => {
            isMounted = false;
        };
    }, [markers, map]);

    return null;
};

export default function AdminGlobalMap({ orders = [], riders = [] }) {
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        // Combine Orders and Riders into a unified marker list
        const orderMarkers = orders
            .filter(o => o.location && o.location.lat && o.location.lng && o.status !== "Delivered" && o.status !== "Cancelled")
            .map(o => ({
                id: o.id,
                type: 'order',
                lat: o.location.lat,
                lng: o.location.lng,
                title: `Order #${o.id.slice(0, 5)}`,
                status: o.status,
                details: o
            }));

        const riderMarkers = riders
            .filter(r => r.location && r.location.lat && r.location.lng && r.isOnline)
            .map(r => ({
                id: r.id,
                type: 'rider',
                lat: r.location.lat,
                lng: r.location.lng,
                title: r.name,
                status: r.status === 'available' ? 'Idle' : 'Busy',
                details: r
            }));

        setMarkers([...orderMarkers, ...riderMarkers]);
    }, [orders, riders]);

    // Default Center (Fallback)
    const defaultCenter = [17.3850, 78.4867]; // Hyderabad

    return (
        <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative z-0">
            <MapContainer
                center={defaultCenter}
                zoom={12}
                className="h-full w-full bg-[#18181b]"
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* Order Markers */}
                {markers.filter(m => m.type === 'order').map(marker => (
                    <Marker
                        key={`order-${marker.id}`}
                        position={[marker.lat, marker.lng]}
                        icon={marker.status === 'Moving' ? goldIcon : redIcon}
                    >
                        <Popup className="glass-popup">
                            <div className="p-2 min-w-[200px]">
                                <h3 className="font-bold flex items-center gap-2 text-gray-900">
                                    <Package size={16} className="text-orange-600" />
                                    Order #{marker.id.slice(0, 6)}
                                </h3>
                                <p className="text-xs font-semibold text-gray-600 uppercase mt-1">Status: {marker.status}</p>
                                <p className="text-sm text-gray-700 mt-2">{marker.details.items?.length || 0} Items • ₹{marker.details.total}</p>
                                <p className="text-xs text-gray-500 mt-1 truncate">{marker.details.deliveryAddress}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Rider Markers */}
                {markers.filter(m => m.type === 'rider').map(marker => (
                    <Marker
                        key={`rider-${marker.id}`}
                        position={[marker.lat, marker.lng]}
                        icon={greenIcon}
                    >
                        <Popup className="glass-popup">
                            <div className="p-2 min-w-[200px]">
                                <h3 className="font-bold flex items-center gap-2 text-gray-900">
                                    <Navigation size={16} className="text-green-600" />
                                    {marker.title}
                                </h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`w-2 h-2 rounded-full ${marker.status === 'Idle' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                    <p className="text-sm font-medium text-gray-700">{marker.status}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Bat: {marker.details.battery || '100'}% • Trust: {marker.details.reliability || '100'}%
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                <BoundsUpdater markers={markers} />
            </MapContainer>

            {/* Legend Overlay */}
            <div className="absolute top-4 right-4 z-[400] bg-black/80 backdrop-blur border border-white/10 p-4 rounded-xl shadow-lg text-xs space-y-2">
                <h4 className="font-bold text-white mb-2">Map Legend</h4>
                <div className="flex items-center gap-2 text-gray-300">
                    <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/markers/marker-icon-red.png" className="h-4" alt="red" />
                    Pending Order
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                    <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/markers/marker-icon-gold.png" className="h-4" alt="gold" />
                    Order in Transit
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                    <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/markers/marker-icon-green.png" className="h-4" alt="green" />
                    Online Rider
                </div>
            </div>
        </div>
    );
}
