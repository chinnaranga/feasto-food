import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    userName: {
        type: String,
        required: true
    },
    userAvatar: {
        type: String
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
        index: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true,
        maxLength: 500
    },
    likes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Prevent multiple reviews from same user for same restaurant
reviewSchema.index({ userId: 1, restaurantId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
