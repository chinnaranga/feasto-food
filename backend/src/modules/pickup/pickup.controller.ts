import { Request, Response } from 'express';
import { pickupService } from './pickup.service.js';
import { HttpStatus } from '../../shared/constants/httpStatusCodes.js';

function parseParam(val: string | string[] | undefined): string {
  if (Array.isArray(val)) return val[0];
  return val || '';
}

export class PickupController {
  async getHandoff(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const orderId = parseParam(req.params.orderId);
    const handoff = await pickupService.getHandoffDetails(restaurantId, orderId);
    res.status(HttpStatus.OK).json({
      success: true,
      data: handoff,
      timestamp: new Date().toISOString(),
    });
  }

  async startHandoff(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const orderId = parseParam(req.params.orderId);
    const handoff = await pickupService.startHandoff(restaurantId, orderId, req.body);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Handoff to rider started',
      data: handoff,
      timestamp: new Date().toISOString(),
    });
  }

  async confirmHandoff(req: Request, res: Response): Promise<void> {
    const restaurantId = parseParam(req.params.restaurantId);
    const orderId = parseParam(req.params.orderId);
    const handoff = await pickupService.confirmHandoff(restaurantId, orderId, req.body);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Handoff confirmed and order out for delivery',
      data: handoff,
      timestamp: new Date().toISOString(),
    });
  }
}

export const pickupController = new PickupController();
