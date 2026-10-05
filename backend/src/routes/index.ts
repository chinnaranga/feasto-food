import { Router } from 'express';
import healthRouter from '../modules/health/health.route.js';
import authRouter from '../modules/auth/auth.routes.js';
import usersRouter from '../modules/users/users.routes.js';
import restaurantsRouter from '../modules/restaurants/restaurants.routes.js';
import cartRouter from '../modules/orders/routes/cart.routes.js';
import checkoutRouter from '../modules/orders/routes/checkout.routes.js';
import ordersRouter from '../modules/orders/orders.routes.js';
import ridersRouter from '../modules/riders/riders.routes.js';
import trackingRouter from '../modules/tracking/tracking.routes.js';
import paymentsSubRouter from '../modules/payments/routes/payments.routes.js';
import razorpayRouter from '../modules/payments/routes/razorpay.routes.js';
import cashfreeRouter from '../modules/payments/routes/cashfree.routes.js';
import transactionsSubRouter from '../modules/payments/routes/transactions.routes.js';
import walletsSubRouter from '../modules/payments/routes/wallets.routes.js';
import payoutsSubRouter from '../modules/payments/routes/payouts.routes.js';
import refundsSubRouter from '../modules/payments/routes/refunds.routes.js';
import settlementsSubRouter from '../modules/payments/routes/settlements.routes.js';
import webhooksSubRouter from '../modules/payments/routes/webhooks.routes.js';
import notificationsSubRouter from '../modules/notifications/routes/notifications.routes.js';
import preferencesSubRouter from '../modules/notifications/routes/preferences.routes.js';
import devicesSubRouter from '../modules/notifications/routes/devices.routes.js';
import restaurantOperationsRouter from '../modules/restaurantOperations/restaurantOperations.routes.js';
import kitchenRouter from '../modules/kitchen/kitchen.routes.js';
import pickupRouter from '../modules/pickup/pickup.routes.js';
import {
  dispatchRouter,
  riderOffersRouter,
  riderAssignmentsRouter,
} from '../modules/dispatch/dispatch.routes.js';
import adminRouter from '../modules/admin/admin.routes.js';

const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/restaurants', restaurantsRouter);

// Phase 10 Restaurant Operations, Kitchen & Pickup Routers
apiRouter.use('/restaurants/:restaurantId', restaurantOperationsRouter);
apiRouter.use('/restaurants/:restaurantId', kitchenRouter);
apiRouter.use('/restaurants/:restaurantId', pickupRouter);

apiRouter.use('/cart', cartRouter);
apiRouter.use('/checkout', checkoutRouter);
apiRouter.use('/orders', ordersRouter);
apiRouter.use('/riders', ridersRouter);
apiRouter.use('/tracking', trackingRouter);

// Phase 11 Dispatch Engine Routers
apiRouter.use('/dispatch', dispatchRouter);
apiRouter.use('/rider/offers', riderOffersRouter);
apiRouter.use('/rider/assignments', riderAssignmentsRouter);

// Phase 8 Payments Domain Routers
apiRouter.use('/payments', paymentsSubRouter);
apiRouter.use('/razorpay', razorpayRouter);
apiRouter.use('/cashfree', cashfreeRouter);
apiRouter.use('/transactions', transactionsSubRouter);
apiRouter.use('/wallets', walletsSubRouter);
apiRouter.use('/payouts', payoutsSubRouter);
apiRouter.use('/refunds', refundsSubRouter);
apiRouter.use('/settlements', settlementsSubRouter);
apiRouter.use('/webhooks', webhooksSubRouter);

// Phase 9 Notifications Domain Routers
apiRouter.use('/notifications/preferences', preferencesSubRouter);
apiRouter.use('/notifications/devices', devicesSubRouter);
apiRouter.use('/notifications', notificationsSubRouter);

// Phase 12 Admin Platform Router
apiRouter.use('/admin', adminRouter);

export default apiRouter;
