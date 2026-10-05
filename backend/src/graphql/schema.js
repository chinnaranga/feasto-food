export const typeDefs = `#graphql

  # ─── Scalars ────────────────────────────────────
  scalar JSON

  # ─── Types ──────────────────────────────────────

  type Location {
    lat: Float
    lng: Float
  }

  type MenuItem {
    id: ID
    name: String!
    price: Float!
    description: String
    image: String
    category: String
    isVeg: Boolean
    isAvailable: Boolean
  }

  type Restaurant {
    id: ID!
    name: String!
    cuisine: String!
    rating: Float
    image: String
    reviews: Int
    time: String
    discount: Float
    price: String
    deliveryFee: Float
    verified: Boolean
    isOpen: Boolean
    isAvailable: Boolean
    address: String
    location: Location
    menu: [MenuItem]
  }

  type OrderItem {
    id: ID
    name: String
    price: Float
    quantity: Int
    image: String
    restaurantId: String
  }

  type Order {
    id: ID!
    userId: String!
    items: [OrderItem]
    total: Float!
    walletUsed: Float
    onlinePaid: Float
    status: String!
    paymentMethod: String!
    provider: String
    transactionId: String
    restaurantName: String
    restaurantAddress: String
    customerName: String
    customerAddress: String
    restaurantLocation: Location
    customerLocation: Location
    createdAt: String
    updatedAt: String
  }

  type Rider {
    id: ID!
    userId: String!
    name: String
    email: String
    phoneNumber: String
    status: String
    currentLocation: Location
    walletBalance: Float
    totalEarnings: Float
    rating: Float
    vehicle: String
  }

  type PlatformStats {
    rpm: Float
    errorRate: Float
    ordersToday: Int
    activeOrders: Int
  }

  type OrderStatusUpdate {
    orderId: ID!
    status: String!
    updatedAt: String!
  }

  type RiderLocationUpdate {
    riderId: String!
    orderId: String
    lat: Float!
    lng: Float!
    heading: Float
    speed: Float
    timestamp: String!
  }

  type MutationResult {
    success: Boolean!
    message: String
  }

  # ─── Queries ─────────────────────────────────────

  type Query {
    """Fetch all available restaurants (optionally filter by cuisine)"""
    restaurants(cuisine: String, limit: Int, offset: Int): [Restaurant!]!

    """Fetch a single restaurant by ID"""
    restaurant(id: ID!): Restaurant

    """Search restaurants by name or cuisine"""
    searchRestaurants(query: String!): [Restaurant!]!

    """Get all orders for the authenticated user"""
    myOrders(userId: String!, limit: Int): [Order!]!

    """Get a single order by ID"""
    order(id: ID!): Order

    """Get all active orders (admin only)"""
    activeOrders: [Order!]!

    """Get platform statistics"""
    platformStats: PlatformStats!

    """Get all available riders"""
    riders(status: String): [Rider!]!

    """Get a specific rider"""
    rider(userId: String!): Rider
  }

  # ─── Mutations ───────────────────────────────────

  type Mutation {
    """Update order status (restaurant/admin/rider only)"""
    updateOrderStatus(orderId: ID!, status: String!): Order

    """Update rider location"""
    updateRiderLocation(
      riderId: String!
      lat: Float!
      lng: Float!
      heading: Float
      speed: Float
    ): MutationResult

    """Update rider availability status"""
    updateRiderStatus(riderId: String!, status: String!): MutationResult
  }

  # ─── Subscriptions ───────────────────────────────

  type Subscription {
    """Subscribe to real-time status updates for a specific order"""
    orderStatusUpdated(orderId: ID!): OrderStatusUpdate!

    """Subscribe to rider location for an active order"""
    riderLocationUpdated(orderId: String!): RiderLocationUpdate!

    """Subscribe to new orders (restaurant/admin dashboard)"""
    newOrder: Order!
  }
`;
