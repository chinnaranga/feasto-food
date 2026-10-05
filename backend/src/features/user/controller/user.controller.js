import User from "../models/User.js";

// @desc    Toggle favorite restaurant
// @route   POST /api/user/favorites/:restaurantId
// @access  Private
export const toggleFavorite = async (req, res) => {
    try {
        const { uid } = req.user;
        const { restaurantId } = req.params;

        const user = await User.findOne({ uid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if favorite exists
        const index = user.favorites.indexOf(restaurantId);

        if (index === -1) {
            // Add to favorites
            user.favorites.push(restaurantId);
            await user.save();
            return res.json({ success: true, isFavorite: true, message: "Added to favorites" });
        } else {
            // Remove from favorites
            user.favorites.splice(index, 1);
            await user.save();
            return res.json({ success: true, isFavorite: false, message: "Removed from favorites" });
        }
    } catch (error) {
        console.error("Toggle Favorite Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get user favorites
// @route   GET /api/user/favorites
// @access  Private
export const getFavorites = async (req, res) => {
    try {
        const { uid } = req.user;

        const user = await User.findOne({ uid }).populate('favorites');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.favorites);
    } catch (error) {
        console.error("Get Favorites Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get user devices
// @route   GET /api/user/devices
// @access  Private
export const getDevices = async (req, res) => {
    try {
        const { uid } = req.user;
        const user = await User.findOne({ uid });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.json({ devices: user.devices });
    } catch (error) {
        console.error("Get Devices Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Remove user device
// @route   DELETE /api/user/devices/:deviceId
// @access  Private
export const removeDevice = async (req, res) => {
    try {
        const { uid } = req.user;
        const { deviceId } = req.params;

        const user = await User.findOne({ uid });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.devices = user.devices.filter(d => d.deviceId !== deviceId);
        await user.save();

        return res.json({ success: true, message: "Device removed successfully" });
    } catch (error) {
        console.error("Remove Device Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Trust user device
// @route   POST /api/user/devices/:deviceId/trust
// @access  Private
export const trustDevice = async (req, res) => {
    try {
        const { uid } = req.user;
        const { deviceId } = req.params;

        const user = await User.findOne({ uid });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const deviceIndex = user.devices.findIndex(d => d.deviceId === deviceId);
        if (deviceIndex === -1) {
            return res.status(404).json({ error: "Device not found" });
        }

        user.devices[deviceIndex].trusted = true;
        user.devices[deviceIndex].suspicious = false;
        await user.save();

        return res.json({ success: true, message: "Device marked as trusted" });
    } catch (error) {
        console.error("Trust Device Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
