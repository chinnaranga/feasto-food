import { Request, Response } from 'express';
import { restaurantOperationsService } from './restaurantOperations.service.js';
import { HttpStatus } from '../../shared/constants/httpStatusCodes.js';

function parseParam(val: string | string[] | undefined): string {
  if (Array.isArray(val)) return val[0];
  return val || '';
}

export class RestaurantOperationsController {
  async getIncomingOrders(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const orders = await restaurantOperationsService.getIncomingOrders(restaurantId);
    res.status(HttpStatus.OK).json({
      success: true,
      count: orders.length,
      data: orders,
      timestamp: new Date().toISOString(),
    });
  }

  async getActiveOrders(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const orders = await restaurantOperationsService.getActiveOrders(restaurantId);
    res.status(HttpStatus.OK).json({
      success: true,
      count: orders.length,
      data: orders,
      timestamp: new Date().toISOString(),
    });
  }

  async getOrderDetails(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const orderId = parseParam(req.params.orderId);
    const order = await restaurantOperationsService.getOrderDetails(restaurantId, orderId);
    res.status(HttpStatus.OK).json({
      success: true,
      data: order,
      timestamp: new Date().toISOString(),
    });
  }

  async acceptOrder(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const orderId = parseParam(req.params.orderId);
    const order = await restaurantOperationsService.acceptOrder(
      restaurantId,
      orderId,
      req.body,
      req.user?.id || ''
    );
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Order accepted by restaurant',
      data: order,
      timestamp: new Date().toISOString(),
    });
  }

  async rejectOrder(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const orderId = parseParam(req.params.orderId);
    const order = await restaurantOperationsService.rejectOrder(
      restaurantId,
      orderId,
      req.body,
      req.user?.id || ''
    );
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Order rejected by restaurant',
      data: order,
      timestamp: new Date().toISOString(),
    });
  }

  async prepareOrder(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const orderId = parseParam(req.params.orderId);
    const order = await restaurantOperationsService.prepareOrder(
      restaurantId,
      orderId,
      req.body,
      req.user?.id || ''
    );
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Order preparation started',
      data: order,
      timestamp: new Date().toISOString(),
    });
  }

  async readyOrder(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const orderId = parseParam(req.params.orderId);
    const order = await restaurantOperationsService.markOrderReady(
      restaurantId,
      orderId,
      req.body,
      req.user?.id || ''
    );
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Order marked ready for pickup',
      data: order,
      timestamp: new Date().toISOString(),
    });
  }

  async delayOrder(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const orderId = parseParam(req.params.orderId);
    const delay = await restaurantOperationsService.reportDelay(
      restaurantId,
      orderId,
      req.body,
      req.user?.id || ''
    );
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Order delay reported',
      data: delay,
      timestamp: new Date().toISOString(),
    });
  }

  async getOrderTimeline(req: Request, res: Response): Promise<void> {
    const orderId = parseParam(req.params.orderId);
    const timeline = await restaurantOperationsService.getOrderTimeline(orderId);
    res.status(HttpStatus.OK).json({
      success: true,
      count: timeline.length,
      data: timeline,
      timestamp: new Date().toISOString(),
    });
  }

  async getOperationalStatus(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const statusDoc = await restaurantOperationsService.getOperationalStatus(restaurantId);
    res.status(HttpStatus.OK).json({
      success: true,
      data: statusDoc,
      timestamp: new Date().toISOString(),
    });
  }

  async updateOperationalStatus(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const statusDoc = await restaurantOperationsService.updateOperationalStatus(
      restaurantId,
      req.body,
      req.user?.id || ''
    );
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Restaurant operational status updated',
      data: statusDoc,
      timestamp: new Date().toISOString(),
    });
  }

  async pauseRestaurant(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const duration = req.body.durationMinutes || 30;
    const pausedUntil = new Date(Date.now() + duration * 60 * 1000);

    const statusDoc = await restaurantOperationsService.updateOperationalStatus(
      restaurantId,
      {
        status: 'PAUSED',
        pauseReason: req.body.pauseReason || 'Temporarily paused by staff',
        pausedUntil,
      },
      req.user?.id || ''
    );

    res.status(HttpStatus.OK).json({
      success: true,
      message: `Restaurant paused for ${duration} minutes`,
      data: statusDoc,
      timestamp: new Date().toISOString(),
    });
  }

  async resumeRestaurant(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const statusDoc = await restaurantOperationsService.updateOperationalStatus(
      restaurantId,
      { status: 'OPEN', pauseReason: undefined, pausedUntil: undefined },
      req.user?.id || ''
    );

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Restaurant resumed operations',
      data: statusDoc,
      timestamp: new Date().toISOString(),
    });
  }
}

export const restaurantOperationsController = new RestaurantOperationsController();
