/**
 * Service to handle Geolocation and Geocoding Logic
 */

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/**
 * Get current user position using Browser Geolocation API
 * @returns {Promise<{lat: number, lng: number}>}
 */
export const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser"));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                reject(error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    });
};

/**
 * Get formatted address from Lat/Lng using Google Geocoding API
 * fallback to dummy data if no key is present
 * @param {number} lat 
 * @param {number} lng 
 * @returns {Promise<string>}
 */
export const getAddressFromCoordinates = async (lat, lng) => {
    if (!GOOGLE_MAPS_API_KEY) {
        console.warn("Google Maps API Key missing. Returning mock address.");
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        return `Simulated Address at ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
            return data.results[0].formatted_address;
        } else {
            throw new Error(data.error_message || "Failed to fetch address");
        }
    } catch (error) {
        console.error("Geocoding Error:", error);
        throw error;
    }
};
