// models/Restaurant.js
import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  rating: { type: Number, default: 0 },
  image: { type: String, required: true },
  reviews: Number,
  time: String,
  discount: Number,
  price: String,
  deliveryFee: Number,
  verified: Boolean,
  isNewRestaurant: Boolean,
  isEcoFriendly: Boolean,
  ownerId: { type: String, required: true, index: true }, // Firebase UID of owner
  ownerEmail: String,
  isOpen: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
  address: { type: String, default: "123 Food Street, Bangalore" }, // Default for migration
  location: {
    lat: { type: Number, default: 12.9716 },
    lng: { type: Number, default: 77.5946 }
  },
  menu: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    image: String,
    category: { type: String, default: "Main" },
    isVeg: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true }
  }]
});

// Production Indexes for Performance
restaurantSchema.index({ cuisine: 1 }); // For filtering by cuisine
restaurantSchema.index({ name: "text" }); // For text search
restaurantSchema.index({ rating: -1 }); // For sorting by rating

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;