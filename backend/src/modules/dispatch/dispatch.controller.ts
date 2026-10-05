import { Request, Response } from 'express';
import { dispatchService } from './dispatch.service.js';
import { offerService } from './offers/offer.service.js';
import { assignmentService } from './assignments/assignment.service.js';
import { dispatchRepository } from './dispatch.repository.js';
import { HttpStatus } from '../../shared/constants/httpStatusCodes.js';

function parseParam(val: string | string[] | undefined): string {
  if (Array.isArray(val)) return val[0];
  return val || '';
}

export class DispatchController {
  // DISPATCH OPERATIONAL ENDPOINTS
  async triggerDispatch(req: Request, res: Response): Promise<void> {
    const orderId = parseParam(req.params.orderId);
    const result = await dispatchService.executeDispatch(orderId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Dispatch engine executed',
      data: result,
      timestamp: new Date().toISOString(),
    });
  }

  async getDispatchStatus(req: Request, res: Response): Promise<void> {
    const orderId = parseParam(req.params.orderId);
    const job = await dispatchRepository.findJobByOrderId(orderId);
    res.status(HttpStatus.OK).json({
      success: true,
      data: job,
      timestamp: new Date().toISOString(),
    });
  }

  async retryDispatch(req: Request, res: Response): Promise<void> {
    const orderId = parseParam(req.params.orderId);
    const result = await dispatchService.executeDispatch(orderId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Dispatch retried',
      data: result,
      timestamp: new Date().toISOString(),
    });
  }

  async cancelDispatch(req: Request, res: Response): Promise<void> {
    const orderId = parseParam(req.params.orderId);
    await dispatchService.cancelDispatch(orderId, req.body.reason);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Dispatch cancelled',
      timestamp: new Date().toISOString(),
    });
  }

  async getAttempts(req: Request, res: Response): Promise<void> {
    const orderId = parseParam(req.params.orderId);
    const attempts = await dispatchRepository.findAttemptsByOrderId(orderId);
    res.status(HttpStatus.OK).json({
      success: true,
      count: attempts.length,
      data: attempts,
      timestamp: new Date().toISOString(),
    });
  }

  async reassignOrder(req: Request, res: Response): Promise<void> {
    const orderId = parseParam(req.params.orderId);
    const reassigned = await assignmentService.reassignOrder(orderId, req.body.reason);
    await dispatchService.executeDispatch(orderId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Order reassigned and re-queued for dispatch',
      data: reassigned,
      timestamp: new Date().toISOString(),
    });
  }

  // RIDER OFFERS
  async getRiderOffers(req: Request, res: Response): Promise<void> {
    const riderId = req.user?.id || '';
    const offers = await offerService.findRiderOffers(riderId);
    res.status(HttpStatus.OK).json({
      success: true,
      count: offers.length,
      data: offers,
      timestamp: new Date().toISOString(),
    });
  }

  async getOffer(req: Request, res: Response): Promise<void> {
    const offerId = parseParam(req.params.offerId);
    const offer = await offerService.findOfferById(offerId);
    res.status(HttpStatus.OK).json({
      success: true,
      data: offer,
      timestamp: new Date().toISOString(),
    });
  }

  async acceptOffer(req: Request, res: Response): Promise<void> {
    const offerId = parseParam(req.params.offerId);
    const riderId = req.user?.id || '';
    const assignment = await assignmentService.acceptOfferAndAssign(offerId, riderId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Delivery offer accepted and assigned',
      data: assignment,
      timestamp: new Date().toISOString(),
    });
  }

  async rejectOffer(req: Request, res: Response): Promise<void> {
    const offerId = parseParam(req.params.offerId);
    const riderId = req.user?.id || '';
    const offer = await offerService.rejectOffer(offerId, riderId, req.body.reason);
    if (offer) {
      await dispatchService.handleRiderRejectionOrExpiry(offer.orderId, riderId);
    }
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Delivery offer rejected',
      data: offer,
      timestamp: new Date().toISOString(),
    });
  }

  // RIDER ASSIGNMENTS
  async getRiderAssignments(req: Request, res: Response): Promise<void> {
    const riderId = req.user?.id || '';
    const assignments = await assignmentService.findRiderAssignments(riderId);
    res.status(HttpStatus.OK).json({
      success: true,
      count: assignments.length,
      data: assignments,
      timestamp: new Date().toISOString(),
    });
  }

  async getAssignment(req: Request, res: Response): Promise<void> {
    const assignmentId = parseParam(req.params.assignmentId);
    const assignment = await assignmentService.findAssignmentById(assignmentId);
    res.status(HttpStatus.OK).json({
      success: true,
      data: assignment,
      timestamp: new Date().toISOString(),
    });
  }

  async startPickup(req: Request, res: Response): Promise<void> {
    const assignmentId = parseParam(req.params.assignmentId);
    const riderId = req.user?.id || '';
    const assignment = await assignmentService.startPickup(assignmentId, riderId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Pickup started',
      data: assignment,
      timestamp: new Date().toISOString(),
    });
  }

  async confirmPickup(req: Request, res: Response): Promise<void> {
    const assignmentId = parseParam(req.params.assignmentId);
    const riderId = req.user?.id || '';
    const assignment = await assignmentService.confirmPickup(assignmentId, riderId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Pickup confirmed',
      data: assignment,
      timestamp: new Date().toISOString(),
    });
  }

  async startDelivery(req: Request, res: Response): Promise<void> {
    const assignmentId = parseParam(req.params.assignmentId);
    const riderId = req.user?.id || '';
    const assignment = await assignmentService.startDelivery(assignmentId, riderId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Delivery started',
      data: assignment,
      timestamp: new Date().toISOString(),
    });
  }

  async completeDelivery(req: Request, res: Response): Promise<void> {
    const assignmentId = parseParam(req.params.assignmentId);
    const riderId = req.user?.id || '';
    const assignment = await assignmentService.completeDelivery(assignmentId, riderId);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Delivery completed',
      data: assignment,
      timestamp: new Date().toISOString(),
    });
  }

  // CONFIGURATION
  async getConfig(_req: Request, res: Response): Promise<void> {
    const config = await dispatchRepository.getDispatchConfig();
    res.status(HttpStatus.OK).json({
      success: true,
      data: config,
      timestamp: new Date().toISOString(),
    });
  }

  async updateConfig(req: Request, res: Response): Promise<void> {
    const config = await dispatchRepository.updateDispatchConfig(req.body);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Dispatch configuration updated',
      data: config,
      timestamp: new Date().toISOString(),
    });
  }
}

export const dispatchController = new DispatchController();
