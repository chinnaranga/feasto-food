import { Router } from 'express';
import { ordersController } from '../orders.controller.js';
import { validateRequest } from '../../../shared/validators/common.js';
import { addItemToCartSchema } from '../orders.validation.js';
import { authenticate } from '../../../shared/middleware/authMiddleware.js';
import { catchAsync } from '../../../shared/utils/catchAsync.js';

const router = Router();

router.use(authenticate);

router.get('/', catchAsync(ordersController.getCart));
router.post('/items', validateRequest({ body: addItemToCartSchema }), catchAsync(ordersController.addItemToCart));
router.delete('/', catchAsync(ordersController.clearCart));

export default router;
