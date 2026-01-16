import admin from "firebase-admin";

/**
 * Helper to safely get Firestore instance
 * Guarantees that Admin SDK is initialized before access
 */
function getDB() {
    if (!admin.apps.length) {
        throw new Error("Firebase Admin not initialized");
    }
    return admin.firestore();
}

/**
 * Create a new order in Firestore
 * @param {object} orderData 
 */
export async function createOrder(orderData) {
    try {
        const db = getDB();

        // Use provided ID or auto-generate
        const orderRef = orderData.id
            ? db.collection("orders").doc(orderData.id)
            : db.collection("orders").doc();

        const timestamp = admin.firestore.FieldValue.serverTimestamp();

        // ✅ FIX: Respect status passed from Razorpay/Caller (created vs placed)
        await orderRef.set({
            ...orderData,
            status: orderData.status ?? "created",
            createdAt: timestamp,
            updatedAt: timestamp,
        });

        return { id: orderRef.id, ...orderData };
    } catch (error) {
        console.error("❌ Error creating order:", error.message);
        throw error;
    }
}

/**
 * Update order status
 * @param {string} orderId 
 * @param {string} status 
 */
export async function updateOrderStatus(orderId, status) {
    try {
        const db = getDB();

        await db.collection("orders").doc(orderId).update({
            status,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`✅ Order ${orderId} updated to ${status}`);
    } catch (error) {
        console.error("❌ Error updating order:", error.message);
        throw error;
    }
}
