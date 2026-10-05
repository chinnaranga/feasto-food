import { Router } from 'express';
import notificationsSubRouter from './routes/notifications.routes.js';
import preferencesSubRouter from './routes/preferences.routes.js';
import devicesSubRouter from './routes/devices.routes.js';
import './notifications.docs.js';

const notificationsModuleRouter = Router();

notificationsModuleRouter.use('/notifications/preferences', preferencesSubRouter);
notificationsModuleRouter.use('/notifications/devices', devicesSubRouter);
notificationsModuleRouter.use('/notifications', notificationsSubRouter);

export default notificationsModuleRouter;
