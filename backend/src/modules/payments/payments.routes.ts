import { Router } from 'express';
import paymentsSubRouter from './routes/payments.routes.js';
import transactionsSubRouter from './routes/transactions.routes.js';
import walletsSubRouter from './routes/wallets.routes.js';
import payoutsSubRouter from './routes/payouts.routes.js';
import refundsSubRouter from './routes/refunds.routes.js';
import settlementsSubRouter from './routes/settlements.routes.js';
import webhooksSubRouter from './routes/webhooks.routes.js';
import './payments.docs.js';

const paymentsModuleRouter = Router();

paymentsModuleRouter.use('/payments', paymentsSubRouter);
paymentsModuleRouter.use('/transactions', transactionsSubRouter);
paymentsModuleRouter.use('/wallets', walletsSubRouter);
paymentsModuleRouter.use('/payouts', payoutsSubRouter);
paymentsModuleRouter.use('/refunds', refundsSubRouter);
paymentsModuleRouter.use('/settlements', settlementsSubRouter);
paymentsModuleRouter.use('/webhooks', webhooksSubRouter);

export default paymentsModuleRouter;
