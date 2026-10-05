import { Types } from 'mongoose';
import { ordersRepository, OrdersRepository } from './orders.repository.js';
import {
  AddCartItemDTO,
  InitializeCheckoutDTO,
  OrderQueueSummaryResponse,
} from './orders.types.js';
import { generateOrderNumber, calculateOrderPricing } from './orders.utils.js';
import { ORDER_CONSTANTS, ORDER_STATUS_TRANSITIONS, ORDER_ERROR_CODES } from './orders.constants.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { BadRequestError } from '../../shared/errors/BadRequestError.js';
import { ForbiddenError } from '../../shared/errors/ForbiddenError.js';
import { ICartDocument } from './models/cart.model.js';
import { ICheckoutSessionDocument } from './models/checkoutSession.model.js';
import { IOrderDocument, OrderStatus, IOrderItemSnapshot } from './orders.model.js';
import { Address } from '../users/models/address.model.js';
import { Restaurant } from '../restaurants/restaurants.model.js';
import { RestaurantSettings } from '../restaurants/models/restaurantSettings.model.js';
import { UserRole } from '../../shared/constants/roles.js';
import { socketGateway } from '../../config/socket.js';
import { logger } from '../../shared/utils/logger.js';

export class OrdersService {
  constructor(private repo: OrdersRepository = ordersRepository) {}

  // --- Cart Engine ---
  async getCart(customerId: string): Promise<ICartDocument> {
    let cart = await this.repo.findCartByCustomer(customerId);
    if (!cart) {
      cart = await this.repo.upsertCart(customerId, {
        customerId: new Types.ObjectId(customerId),
        items: [],
        subtotal: 0,
        estimatedTax: 0,
        estimatedDeliveryFee: ORDER_CONSTANTS.DEFAULT_DELIVERY_FEE,
        estimatedTotal: 0,
      });
    }
    return cart;
  }

  async addItemToCart(customerId: string, dto: AddCartItemDTO): Promise<ICartDocument> {
    let cart = await this.repo.findCartByCustomer(customerId);

    // If existing cart belongs to a different restaurant, reset cart
    if (cart && cart.restaurantId && cart.restaurantId.toString() !== dto.restaurantId) {
      cart.items = [];
      cart.restaurantId = new Types.ObjectId(dto.restaurantId);
      cart.branchId = new Types.ObjectId(dto.branchId);
    }

    if (!cart) {
      cart = await this.repo.upsertCart(customerId, {
        customerId: new Types.ObjectId(customerId),
        restaurantId: new Types.ObjectId(dto.restaurantId),
        branchId: new Types.ObjectId(dto.branchId),
        items: [],
      });
    }

    const addonsTotal = (dto.addons || []).reduce((sum, a) => sum + a.price, 0);
    const unitPrice = dto.basePrice + addonsTotal;
    const itemTotal = Number((unitPrice * dto.quantity).toFixed(2));

    const newItemSnapshot: IOrderItemSnapshot = {
      itemId: new Types.ObjectId(dto.itemId),
      itemName: dto.variantName ? `${dto.itemId} (${dto.variantName})` : 'Menu Item',
      variantId: dto.variantId,
      variantName: dto.variantName,
      basePrice: dto.basePrice,
      quantity: dto.quantity,
      addons: dto.addons || [],
      itemTotal,
    };

    cart.items.push(newItemSnapshot);

    // Recalculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + item.itemTotal, 0);
    const pricing = calculateOrderPricing(subtotal);

    cart.subtotal = pricing.subtotal;
    cart.estimatedTax = pricing.taxAmount;
    cart.estimatedDeliveryFee = pricing.deliveryFee;
    cart.estimatedTotal = pricing.totalAmount;

    await cart.save();
    logger.info({ customerId, restaurantId: dto.restaurantId }, '🛒 Item added to cart');
    return cart;
  }

  async clearCart(customerId: string): Promise<{ success: boolean }> {
    await this.repo.clearCart(customerId);
    return { success: true };
  }

  // --- Checkout Validation & Placement ---
  async initializeCheckout(customerId: string, dto: InitializeCheckoutDTO): Promise<ICheckoutSessionDocument> {
    const cart = await this.getCart(customerId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestError('Cart is empty', ORDER_ERROR_CODES.CART_EMPTY);
    }

    const restaurant = await Restaurant.findById(cart.restaurantId);
    if (!restaurant || restaurant.operationalStatus === 'closed' || restaurant.operationalStatus === 'paused') {
      throw new BadRequestError('Restaurant is currently closed or not taking orders', ORDER_ERROR_CODES.RESTAURANT_CLOSED);
    }

    const settings = await RestaurantSettings.findOne({ restaurantId: cart.restaurantId });
    if (settings?.orderSettings?.minOrderValue && cart.subtotal < settings.orderSettings.minOrderValue) {
      throw new BadRequestError(
        `Minimum order value of $${settings.orderSettings.minOrderValue} required for this restaurant`,
        ORDER_ERROR_CODES.MIN_ORDER_VALUE_NOT_MET
      );
    }

    let deliveryAddressSnapshot;
    if (dto.deliveryAddressId) {
      const address = await Address.findById(dto.deliveryAddressId);
      if (address) {
        deliveryAddressSnapshot = {
          label: address.label,
          street: address.street,
          building: address.building,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country,
          location: address.location,
        };
      }
    }

    const pricing = calculateOrderPricing(cart.subtotal, cart.estimatedDeliveryFee, ORDER_CONSTANTS.DEFAULT_PACKAGING_FEE, 0, dto.tipAmount || 0);
    const sessionId = `chk_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const expiresAt = new Date(Date.now() + ORDER_CONSTANTS.CHECKOUT_SESSION_TTL_MINUTES * 60 * 1000);

    const session = await this.repo.createCheckoutSession({
      sessionId,
      customerId: new Types.ObjectId(customerId),
      restaurantId: cart.restaurantId,
      branchId: cart.branchId,
      cartSnapshot: { items: cart.items, deliveryAddressSnapshot, specialInstructions: dto.specialInstructions },
      pricingSummary: pricing,
      deliveryAddressId: dto.deliveryAddressId ? new Types.ObjectId(dto.deliveryAddressId) : undefined,
      paymentMethod: 'card',
      isConfirmed: false,
      expiresAt,
    });

    logger.info({ customerId, sessionId }, '💳 Checkout session initialized');
    return session;
  }

  async confirmCheckoutAndCreateOrder(customerId: string, checkoutSessionId: string): Promise<IOrderDocument> {
    const session = await this.repo.findCheckoutSession(checkoutSessionId);
    if (!session || session.customerId.toString() !== customerId) {
      throw new NotFoundError('Checkout session invalid or expired', ORDER_ERROR_CODES.CHECKOUT_EXPIRED);
    }

    const cartSnapshot = session.cartSnapshot as {
      items: IOrderItemSnapshot[];
      deliveryAddressSnapshot?: any;
      specialInstructions?: string;
    };

    const orderNumber = generateOrderNumber();

    const order = await this.repo.createOrder({
      orderNumber,
      customerId: new Types.ObjectId(customerId),
      restaurantId: session.restaurantId,
      branchId: session.branchId,
      orderType: 'delivery',
      orderStatus: 'placed',
      paymentStatus: 'paid',
      fulfillmentStatus: 'unassigned',
      items: cartSnapshot.items,
      deliveryAddressSnapshot: cartSnapshot.deliveryAddressSnapshot,
      pricing: session.pricingSummary,
      specialInstructions: cartSnapshot.specialInstructions,
      estimatedPrepTimeMinutes: 20,
    });

    session.isConfirmed = true;
    await session.save();

    // Clear cart after placement
    await this.clearCart(customerId);

    // Record Status History
    await this.repo.recordStatusHistory(order._id, 'placed', customerId, 'customer', 'Order placed successfully');

    // Broadcast Realtime Socket.IO Event to Restaurant Room
    socketGateway.emitToRoom(`/restaurants`, `restaurant:${session.restaurantId.toString()}`, 'order:created', {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      totalAmount: order.pricing.totalAmount,
      itemsCount: order.items.length,
    });

    logger.info({ orderId: order._id.toString(), orderNumber }, '📦 Order created & live event emitted');
    return order;
  }

  // --- Order Management ---
  async getOrder(orderId: string, requesterId: string, requesterRole: UserRole): Promise<IOrderDocument> {
    const order = await this.repo.findOrderById(orderId);
    if (!order) {
      throw new NotFoundError('Order not found', ORDER_ERROR_CODES.ORDER_NOT_FOUND);
    }

    if (
      requesterId !== order.customerId.toString() &&
      requesterRole !== UserRole.ADMIN &&
      requesterRole !== UserRole.SUPER_ADMIN
    ) {
      // Allow assigned staff check
      throw new ForbiddenError('You do not have access to view this order', ORDER_ERROR_CODES.UNAUTHORIZED_ORDER_ACCESS);
    }

    return order;
  }

  async listCustomerOrders(customerId: string): Promise<IOrderDocument[]> {
    return this.repo.listCustomerOrders(customerId);
  }

  async listRestaurantOrders(restaurantId: string): Promise<IOrderDocument[]> {
    return this.repo.listRestaurantOrders(restaurantId);
  }

  async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    changedByUserId: string,
    role: string,
    note?: string
  ): Promise<IOrderDocument> {
    const order = await this.repo.findOrderById(orderId);
    if (!order) {
      throw new NotFoundError('Order not found', ORDER_ERROR_CODES.ORDER_NOT_FOUND);
    }

    const currentStatus = order.orderStatus;
    const allowedNextStates = ORDER_STATUS_TRANSITIONS[currentStatus] || [];

    if (!allowedNextStates.includes(newStatus)) {
      throw new BadRequestError(
        `Cannot transition order status from '${currentStatus}' to '${newStatus}'`,
        ORDER_ERROR_CODES.INVALID_STATUS_TRANSITION
      );
    }

    order.orderStatus = newStatus;
    if (newStatus === 'accepted') order.acceptedAt = new Date();
    if (newStatus === 'delivered') order.deliveredAt = new Date();
    await order.save();

    await this.repo.recordStatusHistory(orderId, newStatus, changedByUserId, role, note);

    // Broadcast Realtime Status Update
    socketGateway.emitToRoom(`/orders`, `order:${orderId}`, 'order:status_updated', {
      orderId,
      orderNumber: order.orderNumber,
      status: newStatus,
      updatedAt: new Date(),
    });

    logger.info({ orderId, oldStatus: currentStatus, newStatus }, '🔄 Order status updated & broadcasted');
    return order;
  }

  async cancelOrder(orderId: string, customerId: string, reason: string): Promise<IOrderDocument> {
    const order = await this.repo.findOrderById(orderId);
    if (!order || order.customerId.toString() !== customerId) {
      throw new NotFoundError('Order not found', ORDER_ERROR_CODES.ORDER_NOT_FOUND);
    }

    if (order.orderStatus !== 'placed' && order.orderStatus !== 'pending') {
      throw new BadRequestError('Order cannot be cancelled after restaurant has accepted or started preparation');
    }

    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = reason;
    await order.save();

    await this.repo.recordStatusHistory(orderId, 'cancelled', customerId, 'customer', reason);

    logger.info({ orderId, reason }, '❌ Order cancelled by customer');
    return order;
  }

  async getRestaurantQueueSummary(restaurantId: string): Promise<OrderQueueSummaryResponse> {
    const pendingOrdersCount = await this.repo.countOrdersByStatus(restaurantId, 'placed');
    const activeOrdersCount = await this.repo.countOrdersByStatus(restaurantId, 'preparing');
    const completedOrdersCount = await this.repo.countOrdersByStatus(restaurantId, 'delivered');
    const cancelledOrdersCount = await this.repo.countOrdersByStatus(restaurantId, 'cancelled');

    return {
      restaurantId,
      stats: {
        pendingOrdersCount,
        activeOrdersCount,
        completedOrdersCount,
        cancelledOrdersCount,
      },
    };
  }
}

export const ordersService = new OrdersService();
