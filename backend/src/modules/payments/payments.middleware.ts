import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../../shared/errors/ForbiddenError.js';
import { UnauthorizedError } from '../../shared/errors/UnauthorizedError.js';
import { paymentsRepository } from './payments.repository.js';
import { verifyWebhookSignature } from './payments.utils.js';

export async function requirePaymentOwnership(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const user = req.user;
  if (!user) throw new UnauthorizedError('User authentication context missing');

  if (user.role === 'admin') return next();

  const paymentId = req.params.paymentId;
  if (!paymentId) return next();

  const payment = await paymentsRepository.findPaymentById(paymentId);
  if (!payment) return next(); // Let controller handle 404

  if (user.role === 'customer' && payment.customerId !== user.id) {
    throw new ForbiddenError('You can only access your own payment details');
  }

  if (user.role === 'restaurant_owner' && payment.restaurantId !== user.id) {
    throw new ForbiddenError('You can only access payment details for your restaurant');
  }

  if (user.role === 'rider' && payment.riderId !== user.id) {
    throw new ForbiddenError('You can only access payment details assigned to your delivery');
  }

  next();
}

export async function requireWalletOwnership(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const user = req.user;
  if (!user) throw new UnauthorizedError('User authentication context missing');

  if (user.role === 'admin') return next();

  const walletId = req.params.walletId;
  if (!walletId) return next();

  const wallet = await paymentsRepository.findWalletById(walletId);
  if (!wallet) return next();

  if (wallet.ownerId !== user.id) {
    throw new ForbiddenError('You can only access your own wallet');
  }

  next();
}

export function verifyWebhookHeader(req: Request, _res: Response, next: NextFunction): void {
  const signature = (req.headers['x-webhook-signature'] || req.headers['stripe-signature']) as string;
  const rawBody = JSON.stringify(req.body);
  const secret = process.env.WEBHOOK_SECRET || 'dev_webhook_secret';

  const isValid = verifyWebhookSignature(rawBody, signature, secret);
  if (!isValid) {
    throw new UnauthorizedError('Invalid webhook signature');
  }

  next();
}
