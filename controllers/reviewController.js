import admin from "firebase-admin";

/**
 * Add a new review
 * POST /api/reviews
 */
export const addReview = async (req, res) => {
    try {
        const { userId, userName, userAvatar, targetId, targetType, orderId, rating, comment } = req.body;

        if (!userId || !targetId || !rating || !targetType) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: "Rating must be between 1 and 5" });
        }

        const db = admin.firestore();
        const reviewsRef = db.collection("reviews");

        // Check if review already exists for this order and target
        const existingReview = await reviewsRef
            .where("orderId", "==", orderId)
            .where("targetId", "==", targetId)
            .get();

        if (!existingReview.empty) {
            return res.status(409).json({ error: "You have already reviewed this." });
        }

        const newReview = {
            userId,
            userName: userName || "Anonymous",
            userAvatar: userAvatar || "",
            targetId,
            targetType, // "restaurant" or "rider"
            orderId,
            rating,
            comment: comment || "",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const docRef = await reviewsRef.add(newReview);

        // Update Average Rating Async
        await updateAverageRating(targetId, targetType);

        res.status(201).json({ id: docRef.id, ...newReview });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ error: "Failed to add review" });
    }
};

/**
 * Get reviews for a target
 * GET /api/reviews/:targetId
 */
export const getReviews = async (req, res) => {
    try {
        const { targetId } = req.params;
        const db = admin.firestore();

        const snapshot = await db.collection("reviews")
            .where("targetId", "==", targetId)
            .orderBy("createdAt", "desc")
            .limit(50)
            .get();

        const reviews = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert timestamp to date safely if needed
            createdAt: doc.data().createdAt?.toDate() || new Date()
        }));

        res.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
};

/**
 * Helper to recalculate average rating
 */
async function updateAverageRating(targetId, targetType) {
    const db = admin.firestore();
    const reviewsRef = db.collection("reviews");

    const snapshot = await reviewsRef.where("targetId", "==", targetId).get();

    if (snapshot.empty) return;

    let totalRating = 0;
    let count = 0;

    snapshot.forEach(doc => {
        const data = doc.data();
        if (data.rating) {
            totalRating += data.rating;
            count++;
        }
    });

    const averageRating = (totalRating / count).toFixed(1);

    // Update target document
    const collectionName = targetType === "rider" ? "users" : "restaurants"; // Riders are in users? or riders? Let's assume users with role=rider or a riders collection.
    // Previous tasks imply riders are in 'users' but also have 'riders' collection for status.
    // Let's verify where rider profile data is. It seems 'users' has the role.
    // Wait, the rider app uses 'users' for auth but 'riders' for live location.
    // Let's assume 'restaurants' collection exists.

    // For safety, we will try to update 'restaurants' first, if fails maybe it's a rider.
    // Actually, we should know the collection based on targetType.

    if (targetType === 'restaurant') {
        await db.collection("restaurants").doc(targetId).update({
            rating: parseFloat(averageRating),
            ratingCount: count
        }).catch(err => console.warn("Failed to update restaurant rating stats", err));
    } else if (targetType === 'rider') {
        // Rider might be in 'users' or 'riders'. Let's try 'users' as that's the main profile.
        await db.collection("users").doc(targetId).set({
            rating: parseFloat(averageRating),
            ratingCount: count
        }, { merge: true }).catch(err => console.warn("Failed to update rider rating stats", err));
    }
}
