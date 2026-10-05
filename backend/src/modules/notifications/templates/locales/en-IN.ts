import { NOTIFICATION_EVENT_TYPES } from '../../notifications.constants.js';

export const EN_IN_TEMPLATES: Record<
  string,
  {
    title: string;
    body: string;
    emailSubject?: string;
    emailHtml?: string;
    smsText?: string;
  }
> = {
  // ACCOUNT
  [NOTIFICATION_EVENT_TYPES.USER_REGISTERED]: {
    title: 'Welcome to Feasto!',
    body: 'Hello {{name}}, your Feasto account has been successfully created.',
    emailSubject: 'Welcome to Feasto Food Delivery!',
    emailHtml: '<h1>Welcome to Feasto, {{name}}!</h1><p>We are excited to bring delicious food to your doorstep.</p>',
    smsText: 'Welcome to Feasto {{name}}! Start exploring local top-rated kitchens now.',
  },
  [NOTIFICATION_EVENT_TYPES.PASSWORD_RESET]: {
    title: 'Password Reset Verification',
    body: 'Use verification code {{code}} to reset your Feasto account password.',
    emailSubject: 'Feasto Security — Reset Password',
    emailHtml: '<p>Your password reset code is <strong>{{code}}</strong>. Valid for 15 minutes.</p>',
    smsText: 'Feasto Security: {{code}} is your password reset code. Do not share it with anyone.',
  },
  [NOTIFICATION_EVENT_TYPES.SECURITY_ALERT]: {
    title: 'Security Alert: New Sign-in',
    body: 'A new sign-in was detected on {{device}} from {{location}}.',
    emailSubject: 'Security Notice — New Device Login',
    emailHtml: '<p>A new login was registered on {{device}} ({{location}}). If this was not you, please lock your account immediately.</p>',
    smsText: 'Feasto Security Alert: New login detected on {{device}}. Check your account if unauthorized.',
  },

  // ORDER
  [NOTIFICATION_EVENT_TYPES.ORDER_PLACED]: {
    title: 'Order Confirmed! 🍔',
    body: 'Your order #{{orderNumber}} for ₹{{amount}} has been placed with {{restaurantName}}.',
    emailSubject: 'Order Receipt #{{orderNumber}} — Feasto',
    emailHtml: '<h2>Order #{{orderNumber}} Confirmed</h2><p>Total: ₹{{amount}} at {{restaurantName}}.</p>',
    smsText: 'Feasto: Order #{{orderNumber}} of ₹{{amount}} is confirmed with {{restaurantName}}.',
  },
  [NOTIFICATION_EVENT_TYPES.ORDER_PREPARING]: {
    title: 'Kitchen is Cooking 🍳',
    body: '{{restaurantName}} has started preparing your order #{{orderNumber}}.',
    smsText: 'Feasto: {{restaurantName}} is preparing your order #{{orderNumber}}.',
  },
  [NOTIFICATION_EVENT_TYPES.ORDER_READY]: {
    title: 'Order Ready for Pickup 📦',
    body: 'Your order #{{orderNumber}} is ready at {{restaurantName}}.',
    smsText: 'Feasto: Order #{{orderNumber}} is packed and ready for pickup.',
  },
  [NOTIFICATION_EVENT_TYPES.ORDER_DELIVERED]: {
    title: 'Order Delivered! 🎉',
    body: 'Enjoy your meal! Order #{{orderNumber}} was delivered successfully.',
    smsText: 'Feasto: Order #{{orderNumber}} delivered! Rate your food in the app.',
  },
  [NOTIFICATION_EVENT_TYPES.ORDER_CANCELLED]: {
    title: 'Order Cancelled',
    body: 'Order #{{orderNumber}} has been cancelled. {{reason}}',
    emailSubject: 'Order Cancellation Notice #{{orderNumber}}',
    emailHtml: '<p>Order #{{orderNumber}} was cancelled. Reason: {{reason}}. Any debited funds will be refunded.</p>',
    smsText: 'Feasto: Order #{{orderNumber}} cancelled. Refund will be credited within 24h.',
  },

  // DELIVERY
  [NOTIFICATION_EVENT_TYPES.RIDER_ASSIGNED]: {
    title: 'Rider Assigned 🛵',
    body: '{{riderName}} has been assigned to pick up your order #{{orderNumber}}.',
  },
  [NOTIFICATION_EVENT_TYPES.ORDER_OUT_FOR_DELIVERY]: {
    title: 'Out for Delivery 🚀',
    body: '{{riderName}} is on the way with your food from {{restaurantName}}!',
    smsText: 'Feasto: {{riderName}} is out for delivery with your order #{{orderNumber}}.',
  },
  [NOTIFICATION_EVENT_TYPES.RIDER_NEAR_DESTINATION]: {
    title: 'Rider Arriving Soon 📍',
    body: '{{riderName}} is 2 minutes away with your delivery.',
  },

  // PAYMENTS
  [NOTIFICATION_EVENT_TYPES.PAYMENT_SUCCESS]: {
    title: 'Payment Successful ₹',
    body: 'Payment of ₹{{amount}} for order #{{orderNumber}} was processed successfully.',
  },
  [NOTIFICATION_EVENT_TYPES.PAYMENT_FAILED]: {
    title: 'Payment Failed ⚠️',
    body: 'Payment of ₹{{amount}} for order #{{orderNumber}} failed. Please retry checkout.',
  },
  [NOTIFICATION_EVENT_TYPES.PAYOUT_COMPLETED]: {
    title: 'Payout Completed 💳',
    body: 'Payout of ₹{{amount}} has been credited to your bank account.',
  },
  [NOTIFICATION_EVENT_TYPES.REFUND_COMPLETED]: {
    title: 'Refund Credited 💰',
    body: 'Refund of ₹{{amount}} for order #{{orderNumber}} has been credited to your wallet.',
  },
};
