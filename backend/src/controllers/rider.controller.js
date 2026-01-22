import { db } from "../config/firebase.js";

// @desc    Update Rider Location
// @route   PATCH /api/rider/location
// @access  Private (Rider)
export const updateLocation = async (req, res) => {
    try {
        const { lat, lng, heading = 0, speed = 0, orderId } = req.body;
        const riderId = req.user.uid;

        if (!lat || !lng) {
            return res.status(400).json({ error: "Missing coordinates" });
        }

        const locationData = {
            riderId,
            lat,
            lng,
            heading,
            speed,
            lastUpdated: new Date().toISOString()
        };

        const batch = db.batch();

        // 1. Update Rider's Document
        // batch.update(db.collection("riders").doc(riderId), { location: locationData });

        // 2. If active order, update Tracking collection
        if (orderId) {
            const trackingRef = db.collection("tracking").doc(orderId);
            batch.set(trackingRef, locationData, { merge: true });
        }

        await batch.commit();

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Update Location Error:", error);
        res.status(500).json({ error: "Server Error" });
    }
};
