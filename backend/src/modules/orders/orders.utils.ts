import { ORDER_CONSTANTS } from './orders.constants.js';
import { IOrderPricingSnapshot } from './orders.model.js';

export const generateOrderNumber = (): string => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
  return `FST-${dateStr}-${randomHex}`;
};

export const calculateOrderPricing = (
  subtotal: number,
  deliveryFee: number = ORDER_CONSTANTS.DEFAULT_DELIVERY_FEE,
  packagingFee: number = ORDER_CONSTANTS.DEFAULT_PACKAGING_FEE,
  discountAmount: number = 0,
  tipAmount: number = 0,
  currency: string = 'USD'
): IOrderPricingSnapshot => {
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const taxAmount = Number((taxableSubtotal * ORDER_CONSTANTS.TAX_RATE).toFixed(2));
  const totalAmount = Number(
    (taxableSubtotal + taxAmount + deliveryFee + packagingFee + tipAmount).toFixed(2)
  );

  return {
    subtotal: Number(subtotal.toFixed(2)),
    taxAmount,
    deliveryFee: Number(deliveryFee.toFixed(2)),
    packagingFee: Number(packagingFee.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    tipAmount: Number(tipAmount.toFixed(2)),
    totalAmount,
    currency,
  };
};
