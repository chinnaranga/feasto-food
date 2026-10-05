import { Request, Response } from 'express';
import { kitchenService } from './kitchen.service.js';
import { HttpStatus } from '../../shared/constants/httpStatusCodes.js';

function parseParam(val: string | string[] | undefined): string {
  if (Array.isArray(val)) return val[0];
  return val || '';
}

export class KitchenController {
  async getQueue(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const queue = await kitchenService.getKitchenQueue(restaurantId);
    res.status(HttpStatus.OK).json({
      success: true,
      count: queue.length,
      data: queue,
      timestamp: new Date().toISOString(),
    });
  }

  async getOrder(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const orderId = parseParam(req.params.orderId);
    const data = await kitchenService.getKitchenOrder(restaurantId, orderId);
    res.status(HttpStatus.OK).json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  async updateOrder(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const orderId = parseParam(req.params.orderId);
    const order = await kitchenService.updateKitchenOrder(restaurantId, orderId, req.body);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Kitchen order updated',
      data: order,
      timestamp: new Date().toISOString(),
    });
  }

  async startOrder(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const orderId = parseParam(req.params.orderId);
    const order = await kitchenService.startKitchenOrder(restaurantId, orderId, req.user?.id || '');
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Kitchen order preparation started',
      data: order,
      timestamp: new Date().toISOString(),
    });
  }

  async getStations(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const stations = await kitchenService.getStations(restaurantId);
    res.status(HttpStatus.OK).json({
      success: true,
      count: stations.length,
      data: stations,
      timestamp: new Date().toISOString(),
    });
  }

  async createStation(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const station = await kitchenService.createStation(restaurantId, req.body);
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Kitchen station created',
      data: station,
      timestamp: new Date().toISOString(),
    });
  }

  async updateStation(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const stationId = parseParam(req.params.stationId);
    const station = await kitchenService.updateStation(restaurantId, stationId, req.body);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Kitchen station updated',
      data: station,
      timestamp: new Date().toISOString(),
    });
  }

  async deleteStation(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const stationId = parseParam(req.params.stationId);
    await kitchenService.deleteStation(restaurantId, stationId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Kitchen station deleted',
      timestamp: new Date().toISOString(),
    });
  }

  async getOrderItems(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const orderId = parseParam(req.params.orderId);
    const items = await kitchenService.getOrderItems(restaurantId, orderId);
    res.status(HttpStatus.OK).json({
      success: true,
      count: items.length,
      data: items,
      timestamp: new Date().toISOString(),
    });
  }

  async startItem(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const orderId = parseParam(req.params.orderId);
    const itemId = parseParam(req.params.itemId);
    const item = await kitchenService.startItemPreparation(restaurantId, orderId, itemId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Item preparation started',
      data: item,
      timestamp: new Date().toISOString(),
    });
  }

  async completeItem(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const orderId = parseParam(req.params.orderId);
    const itemId = parseParam(req.params.itemId);
    const item = await kitchenService.completeItemPreparation(restaurantId, orderId, itemId, req.user?.id || '');
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Item preparation completed',
      data: item,
      timestamp: new Date().toISOString(),
    });
  }
}

export const kitchenController = new KitchenController();
