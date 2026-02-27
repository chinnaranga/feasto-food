import Review from "../models/Review.js";
import Restaurant from "../models/Restaurant.js";

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
export const addReview = async (req, res) => {
    try {
        const { uid, email, name, picture } = req.user;
        const { restaurantId, rating, comment } = req.body;

        if (!restaurantId || !rating) {
            return res.status(400).json({ message: "Restaurant ID and rating are required" });
        }

        // Check if restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({ userId: uid, restaurantId });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this restaurant" });
        }

        const review = await Review.create({
            userId: uid,
            userName: name || email?.split('@')[0] || "User",
            userAvatar: picture,
            restaurantId,
            rating,
            comment
        });

        // Update Restaurant Average Rating
        const stats = await Review.aggregate([
            { $match: { restaurantId: restaurant._id } },
            {
                $group: {
                    _id: "$restaurantId",
                    avgRating: { $avg: "$rating" },
                    count: { $sum: 1 }
                }
            }
        ]);

        if (stats.length > 0) {
            restaurant.rating = Math.round(stats[0].avgRating * 10) / 10; // Round to 1 decimal
            restaurant.reviews = stats[0].count; // Update count
            await restaurant.save();
        }

        res.status(201).json(review);
    } catch (error) {
        console.error("Add Review Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get reviews for a restaurant
// @route   GET /api/reviews/:restaurantId
// @access  Public
export const getRestaurantReviews = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        const reviews = await Review.find({ restaurantId })
            .sort({ createdAt: -1 })
            .limit(20);

        res.json(reviews);
    } catch (error) {
        console.error("Get Reviews Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:reviewId
// @access  Private (Owner only)
export const deleteReview = async (req, res) => {
    try {
        const { uid } = req.user;
        const { reviewId } = req.params;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (review.userId !== uid) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await review.deleteOne();

        // Recalculate rating
        const restaurant = await Restaurant.findById(review.restaurantId);
        if (restaurant) {
            const stats = await Review.aggregate([
                { $match: { restaurantId: restaurant._id } },
                {
                    $group: {
                        _id: "$restaurantId",
                        avgRating: { $avg: "$rating" },
                        count: { $sum: 1 }
                    }
                }
            ]);

            restaurant.rating = stats.length > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0;
            restaurant.reviews = stats.length > 0 ? stats[0].count : 0;
            await restaurant.save();
        }

        res.json({ message: "Review deleted" });
    } catch (error) {
        console.error("Delete Review Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
