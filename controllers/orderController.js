import admin from "firebase-admin";

// Access Firestore via Admin SDK
// const db = admin.firestore(); // Moved inside functions to prevent init error

/**
 * Create a new order in Firestore
 * @param {object} orderData 
 */
export async function createOrder(orderData) {
    try {
        const db = admin.firestore();
        // Use provided ID or auto-generate
        const orderRef = orderData.id
            ? db.collection("orders").doc(orderData.id)
            : db.collection("orders").doc();

        const timestamp = admin.firestore.FieldValue.serverTimestamp();

        await orderRef.set({
            ...orderData,
            status: "placed",
            createdAt: timestamp,
            updatedAt: timestamp,
        });

        return { id: orderRef.id, ...orderData };
    } catch (error) {
        console.error("Error creating order:", error);
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
        const db = admin.firestore();
        await db.collection("orders").doc(orderId).update({
            status,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`Order ${orderId} updated to ${status}`);
    } catch (error) {
        console.error("Error updating order:", error);
        throw error;
    }
}
