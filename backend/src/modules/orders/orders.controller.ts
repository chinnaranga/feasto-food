import { Request, Response } from 'express';
import { ordersService, OrdersService } from './orders.service.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { UnauthorizedError } from '../../shared/errors/UnauthorizedError.js';
import { HttpStatus } from '../../shared/constants/httpStatusCodes.js';

const parseParam = (val: string | string[] | undefined): string => {
  if (!val) return '';
  return Array.isArray(val) ? val[0] : val;
};

export class OrdersController {
  constructor(private service: OrdersService = ordersService) {}

  // --- Cart Handlers ---
  getCart = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const cart = await this.service.getCart(req.user.id);
    sendSuccess(res, cart, 'Cart retrieved successfully');
  };

  addItemToCart = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const cart = await this.service.addItemToCart(req.user.id, req.body);
    sendSuccess(res, cart, 'Item added to cart', HttpStatus.CREATED);
  };

  clearCart = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const result = await this.service.clearCart(req.user.id);
    sendSuccess(res, result, 'Cart cleared');
  };

  // --- Checkout Handlers ---
  initializeCheckout = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const session = await this.service.initializeCheckout(req.user.id, req.body);
    sendSuccess(res, session, 'Checkout session initialized', HttpStatus.CREATED);
  };

  confirmCheckout = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const { checkoutSessionId } = req.body;
    const order = await this.service.confirmCheckoutAndCreateOrder(req.user.id, checkoutSessionId);
    sendSuccess(res, order, 'Order confirmed and placed successfully', HttpStatus.CREATED);
  };

  // --- Order Handlers ---
  listCustomerOrders = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const orders = await this.service.listCustomerOrders(req.user.id);
    sendSuccess(res, orders, 'Orders retrieved successfully');
  };

  getOrder = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const orderId = parseParam(req.params.orderId);
    const order = await this.service.getOrder(orderId, req.user.id, req.user.role);
    sendSuccess(res, order, 'Order details retrieved');
  };

  cancelOrder = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const orderId = parseParam(req.params.orderId);
    const { reason } = req.body;
    const order = await this.service.cancelOrder(orderId, req.user.id, reason || 'Customer requested cancellation');
    sendSuccess(res, order, 'Order cancelled successfully');
  };

  // --- Restaurant Order Queue Handlers ---
  listRestaurantOrders = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const orders = await this.service.listRestaurantOrders(restaurantId);
    sendSuccess(res, orders, 'Restaurant order queue retrieved');
  };

  acceptOrder = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const orderId = parseParam(req.params.orderId);
    const updated = await this.service.updateOrderStatus(orderId, 'accepted', req.user.id, req.user.role, 'Accepted by restaurant');
    sendSuccess(res, updated, 'Order accepted by kitchen');
  };

  rejectOrder = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const orderId = parseParam(req.params.orderId);
    const updated = await this.service.updateOrderStatus(orderId, 'rejected', req.user.id, req.user.role, 'Rejected by restaurant');
    sendSuccess(res, updated, 'Order rejected');
  };

  markPreparing = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const orderId = parseParam(req.params.orderId);
    const updated = await this.service.updateOrderStatus(orderId, 'preparing', req.user.id, req.user.role, 'Kitchen started preparation');
    sendSuccess(res, updated, 'Order state set to preparing');
  };

  markReady = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    const orderId = parseParam(req.params.orderId);
    const updated = await this.service.updateOrderStatus(orderId, 'ready', req.user.id, req.user.role, 'Order ready for pickup/delivery');
    sendSuccess(res, updated, 'Order state set to ready');
  };

  getQueueSummary = async (req: Request, res: Response): Promise<void> => {
    const restaurantId = parseParam(req.params.restaurantId);
    const summary = await this.service.getRestaurantQueueSummary(restaurantId);
    sendSuccess(res, summary, 'Restaurant queue summary retrieved');
  };
}

export const ordersController = new OrdersController();
