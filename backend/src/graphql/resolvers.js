import { PubSub } from "graphql-subscriptions";
import Restaurant from "../models/Restaurant.js";
import Order from "../models/Order.js";
import Rider from "../models/Rider.js";

// ─── PubSub instance (shared with Socket.IO layer) ───────────────────────────
export const pubsub = new PubSub();

// ─── Subscription Topic Keys ─────────────────────────────────────────────────
export const TOPICS = {
  ORDER_STATUS_UPDATED: "ORDER_STATUS_UPDATED",
  RIDER_LOCATION_UPDATED: "RIDER_LOCATION_UPDATED",
  NEW_ORDER: "NEW_ORDER",
};

// ─── Resolvers ────────────────────────────────────────────────────────────────
export const resolvers = {
  Query: {
    // ── Restaurants ──────────────────────────────────────────────────────────
    restaurants: async (_, { cuisine, limit = 50, offset = 0 }) => {
      try {
        const filter = { isAvailable: true };
        if (cuisine) filter.cuisine = new RegExp(cuisine, "i");
        const docs = await Restaurant.find(filter).skip(offset).limit(limit).lean();
        return docs.map(mapRestaurant);
      } catch (err) {
        console.error("[GQL] restaurants error:", err);
        throw new Error("Failed to fetch restaurants");
      }
    },

    restaurant: async (_, { id }) => {
      try {
        const doc = await Restaurant.findById(id).lean();
        return doc ? mapRestaurant(doc) : null;
      } catch (err) {
        throw new Error("Restaurant not found");
      }
    },

    searchRestaurants: async (_, { query }) => {
      try {
        const docs = await Restaurant.find({
          $text: { $search: query },
          isAvailable: true,
        }).lean();
        return docs.map(mapRestaurant);
      } catch {
        // Fallback to regex if text index not yet created
        const docs = await Restaurant.find({
          name: { $regex: query, $options: "i" },
          isAvailable: true,
        }).lean();
        return docs.map(mapRestaurant);
      }
    },

    // ── Orders ───────────────────────────────────────────────────────────────
    myOrders: async (_, { userId, limit = 20 }) => {
      try {
        const docs = await Order.find({ userId })
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean();
        return docs.map(mapOrder);
      } catch (err) {
        throw new Error("Failed to fetch orders");
      }
    },

    order: async (_, { id }) => {
      try {
        const doc = await Order.findById(id).lean();
        return doc ? mapOrder(doc) : null;
      } catch {
        throw new Error("Order not found");
      }
    },

    activeOrders: async () => {
      try {
        const docs = await Order.find({
          status: {
            $in: ["Pending", "Confirmed", "Preparing", "Ready", "Driver_Assigned", "Picked_Up", "Out_for_delivery"],
          },
        })
          .sort({ createdAt: -1 })
          .limit(100)
          .lean();
        return docs.map(mapOrder);
      } catch (err) {
        throw new Error("Failed to fetch active orders");
      }
    },

    platformStats: async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [ordersToday, activeOrders] = await Promise.all([
          Order.countDocuments({ createdAt: { $gte: today } }),
          Order.countDocuments({
            status: { $in: ["Pending", "Preparing", "Ready", "Driver_Assigned", "Out_for_delivery"] },
          }),
        ]);
        return { rpm: 0, errorRate: 0, ordersToday, activeOrders };
      } catch {
        return { rpm: 0, errorRate: 0, ordersToday: 0, activeOrders: 0 };
      }
    },

    // ── Riders ───────────────────────────────────────────────────────────────
    riders: async (_, { status }) => {
      const filter = status ? { status } : {};
      const docs = await Rider.find(filter).lean();
      return docs.map(mapRider);
    },

    rider: async (_, { userId }) => {
      const doc = await Rider.findOne({ userId }).lean();
      return doc ? mapRider(doc) : null;
    },
  },

  // ── Mutations ──────────────────────────────────────────────────────────────
  Mutation: {
    updateOrderStatus: async (_, { orderId, status }) => {
      try {
        const doc = await Order.findByIdAndUpdate(
          orderId,
          { status },
          { new: true }
        ).lean();
        if (!doc) throw new Error("Order not found");

        // Publish to subscriptions
        pubsub.publish(TOPICS.ORDER_STATUS_UPDATED, {
          orderStatusUpdated: {
            orderId: doc._id.toString(),
            status: doc.status,
            updatedAt: new Date().toISOString(),
          },
        });

        return mapOrder(doc);
      } catch (err) {
        throw new Error("Failed to update order status: " + err.message);
      }
    },

    updateRiderLocation: async (_, { riderId, lat, lng, heading, speed }) => {
      try {
        await Rider.findOneAndUpdate(
          { userId: riderId },
          {
            currentLocation: { lat, lng, heading, speed, lastUpdated: new Date() },
          }
        );

        pubsub.publish(TOPICS.RIDER_LOCATION_UPDATED, {
          riderLocationUpdated: {
            riderId,
            lat,
            lng,
            heading,
            speed,
            timestamp: new Date().toISOString(),
          },
        });

        return { success: true, message: "Location updated" };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },

    updateRiderStatus: async (_, { riderId, status }) => {
      try {
        await Rider.findOneAndUpdate({ userId: riderId }, { status });
        return { success: true, message: `Status set to ${status}` };
      } catch (err) {
        return { success: false, message: err.message };
      }
    },
  },

  // ── Subscriptions ──────────────────────────────────────────────────────────
  Subscription: {
    orderStatusUpdated: {
      subscribe: (_, { orderId }) =>
        pubsub.asyncIterableIterator([TOPICS.ORDER_STATUS_UPDATED]),
      resolve: (payload) => payload.orderStatusUpdated,
    },

    riderLocationUpdated: {
      subscribe: (_, { orderId }) =>
        pubsub.asyncIterableIterator([TOPICS.RIDER_LOCATION_UPDATED]),
      resolve: (payload) => payload.riderLocationUpdated,
    },

    newOrder: {
      subscribe: () =>
        pubsub.asyncIterableIterator([TOPICS.NEW_ORDER]),
      resolve: (payload) => payload.newOrder,
    },
  },
};

// ─── Mappers (Mongoose → GraphQL shape) ──────────────────────────────────────
function mapRestaurant(doc) {
  return {
    id: doc._id.toString(),
    ...doc,
    menu: (doc.menu || []).map((item) => ({
      id: item._id?.toString(),
      ...item,
    })),
  };
}

function mapOrder(doc) {
  return {
    id: doc._id.toString(),
    ...doc,
    createdAt: doc.createdAt?.toISOString?.() ?? doc.createdAt,
    updatedAt: doc.updatedAt?.toISOString?.() ?? doc.updatedAt,
  };
}

function mapRider(doc) {
  return {
    id: doc._id.toString(),
    ...doc,
  };
}
