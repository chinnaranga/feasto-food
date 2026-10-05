import { Types } from 'mongoose';
import { Order, IOrderDocument } from './orders.model.js';
import { Cart, ICartDocument } from './models/cart.model.js';
import { CheckoutSession, ICheckoutSessionDocument } from './models/checkoutSession.model.js';
import { OrderStatusHistory, IOrderStatusHistoryDocument } from './models/orderStatusHistory.model.js';

export class OrdersRepository {
  // --- Cart Repository ---
  async findCartByCustomer(customerId: string | Types.ObjectId): Promise<ICartDocument | null> {
    return Cart.findOne({ customerId }).exec();
  }

  async upsertCart(customerId: string | Types.ObjectId, cartData: Partial<ICartDocument>): Promise<ICartDocument> {
    return Cart.findOneAndUpdate(
      { customerId },
      { $set: cartData },
      { new: true, upsert: true, runValidators: true }
    ).exec();
  }

  async clearCart(customerId: string | Types.ObjectId): Promise<boolean> {
    const result = await Cart.findOneAndDelete({ customerId }).exec();
    return result !== null;
  }

  // --- Checkout Repository ---
  async createCheckoutSession(sessionData: Partial<ICheckoutSessionDocument>): Promise<ICheckoutSessionDocument> {
    const session = new CheckoutSession(sessionData);
    return session.save();
  }

  async findCheckoutSession(sessionId: string): Promise<ICheckoutSessionDocument | null> {
    return CheckoutSession.findOne({ sessionId, isConfirmed: false }).exec();
  }

  // --- Order Repository ---
  async createOrder(orderData: Partial<IOrderDocument>): Promise<IOrderDocument> {
    const order = new Order(orderData);
    return order.save();
  }

  async findOrderById(orderId: string | Types.ObjectId): Promise<IOrderDocument | null> {
    return Order.findById(orderId).exec();
  }

  async findOrderByNumber(orderNumber: string): Promise<IOrderDocument | null> {
    return Order.findOne({ orderNumber }).exec();
  }

  async listCustomerOrders(customerId: string | Types.ObjectId): Promise<IOrderDocument[]> {
    return Order.find({ customerId }).sort({ createdAt: -1 }).exec();
  }

  async listRestaurantOrders(
    restaurantId: string | Types.ObjectId,
    query: Record<string, unknown> = {}
  ): Promise<IOrderDocument[]> {
    return Order.find({ restaurantId, ...query }).sort({ createdAt: -1 }).exec();
  }

  async updateOrder(
    orderId: string | Types.ObjectId,
    updateData: Partial<IOrderDocument>
  ): Promise<IOrderDocument | null> {
    return Order.findByIdAndUpdate(orderId, { $set: updateData }, { new: true, runValidators: true }).exec();
  }

  // --- Status History ---
  async recordStatusHistory(
    orderId: string | Types.ObjectId,
    status: string,
    changedBy: string | Types.ObjectId,
    role: string,
    note?: string
  ): Promise<IOrderStatusHistoryDocument> {
    const history = new OrderStatusHistory({
      orderId: new Types.ObjectId(orderId),
      status,
      changedBy: new Types.ObjectId(changedBy),
      role,
      note,
    });
    return history.save();
  }

  async getStatusHistory(orderId: string | Types.ObjectId): Promise<IOrderStatusHistoryDocument[]> {
    return OrderStatusHistory.find({ orderId }).sort({ createdAt: 1 }).exec();
  }

  // --- Queue Counters ---
  async countOrdersByStatus(restaurantId: string | Types.ObjectId, status: string): Promise<number> {
    return Order.countDocuments({ restaurantId, orderStatus: status }).exec();
  }
}

export const ordersRepository = new OrdersRepository();
