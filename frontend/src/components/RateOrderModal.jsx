import React, { useState } from 'react';
import { Star, X, ChefHat, Bike, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function RateOrderModal({ isOpen, onClose, order, onSubmit }) {
    const [step, setStep] = useState(1); // 1: Food, 2: Delivery
    const [foodRating, setFoodRating] = useState(0);
    const [riderRating, setRiderRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen || !order) return null;

    const handleRating = (rating) => {
        if (step === 1) setFoodRating(rating);
        else setRiderRating(rating);
    };

    const handleNext = () => {
        if (step === 1) {
            setStep(2);
            setComment(""); // Clear comment for next step? Or keep separate? Let's keep separate logic simple or shared.
            // Actually better to submit Food review now or store it?
            // Let's store locally and submit all at end.
        } else {
            submitAll();
        }
    };

    const submitAll = async () => {
        setSubmitting(true);
        try {
            await onSubmit({
                foodRating,
                riderRating,
                comment, // Comment for the active step (Rider) or shared? 
                // Let's treat the comment as general or just for the last step.
                // Ideally we'd capture comments for both. For MVP, let's just send the ratings.
            });
            // Toast handled by parent or here?
            setTimeout(() => {
                setSubmitting(false);
                onClose();
            }, 500);
        } catch (e) {
            setSubmitting(false);
            toast.error("Failed to submit review");
        }
    };

    const isFoodStep = step === 1;
    const currentRating = isFoodStep ? foodRating : riderRating;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#18181b] rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative border border-white/10"
                >
                    {/* Header Image/Icon */}
                    <div className={`h-32 flex items-center justify-center ${isFoodStep ? 'bg-gradient-to-br from-orange-500 to-amber-600' : 'bg-gradient-to-br from-red-600 to-orange-700'} transition-colors duration-500`}>
                        {isFoodStep ? (
                            <ChefHat className="w-16 h-16 text-white/90" />
                        ) : (
                            <Bike className="w-16 h-16 text-white/90" />
                        )}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 bg-black/20 p-2 rounded-full text-white hover:bg-black/30 transition-colors backdrop-blur-sm"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="p-6 text-center">
                        <h3 className="text-xl font-bold text-white mb-1 font-display">
                            {isFoodStep ? "How was the food?" : "How was the delivery?"}
                        </h3>
                        <p className="text-sm text-gray-400 mb-6">
                            {isFoodStep
                                ? `Rate your meal from ${order.restaurantName || "the restaurant"}`
                                : `Rate your delivery by ${order.riderName || "the rider"}`
                            }
                        </p>

                        {/* Stars */}
                        <div className="flex justify-center gap-2 mb-8">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => handleRating(star)}
                                    className={`transition-all transform hover:scale-110 focus:outline-none ${star <= currentRating
                                        ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]'
                                        : 'text-gray-600'
                                        }`}
                                >
                                    <Star className="w-8 h-8 fill-current" />
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={currentRating === 0 || submitting}
                            className={`
                                w-full py-3.5 rounded-xl font-bold text-white shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2
                                ${isFoodStep ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20' : 'bg-red-600 hover:bg-red-700 shadow-red-500/20'}
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                        >
                            {submitting ? (
                                <span className="animate-pulse">Submitting...</span>
                            ) : (
                                <>
                                    {isFoodStep ? "Next" : "Submit Review"}
                                    {!isFoodStep && <Check className="w-5 h-5" />}
                                </>
                            )}
                        </button>
                    </div>

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 pb-6">
                        <div className={`w-2 h-2 rounded-full transition-colors ${step === 1 ? 'bg-white' : 'bg-gray-600'}`} />
                        <div className={`w-2 h-2 rounded-full transition-colors ${step === 2 ? 'bg-white' : 'bg-gray-600'}`} />
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
}
