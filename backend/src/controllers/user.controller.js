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
