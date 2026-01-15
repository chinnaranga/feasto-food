/**
 * Review Model (Firestore)
 * Collection: "reviews"
 * 
 * Document Structure:
 * {
 *   id: string (auto-generated),
 *   userId: string (author),
 *   userName: string (author display name),
 *   userAvatar: string (optional),
 *   targetId: string (Restaurant ID or Rider ID),
 *   targetType: "restaurant" | "rider",
 *   orderId: string,
 *   rating: number (1-5),
 *   comment: string (optional),
 *   createdAt: timestamp
 * }
 */

export const REVIEW_COLLECTION = "reviews";
