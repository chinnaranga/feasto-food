import { Router, Request, Response, NextFunction } from 'express';
import { aiController } from './ai.controller.js';
import { validateRequest } from '../../shared/validators/common.js';
import { authenticate } from '../../shared/middleware/authMiddleware.js';
import { verifyAccessToken } from '../../shared/utils/jwt.js';
import { ROLE_PERMISSIONS } from '../../shared/constants/permissions.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';
import {
  discoverFoodSchema,
  searchAISchema,
  recommendAISchema,
  cartAssistSchema,
  restaurantAssistSchema,
  orderAssistSchema,
  trackingAssistSchema,
  chatAISchema,
} from './ai.schemas.js';

const router = Router();

/**
 * Optional authentication middleware:
 * Attaches req.user if a valid bearer token is supplied, but does not reject guests.
 */
const optionalAuthenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        const decoded = verifyAccessToken(token);
        req.user = {
          id: decoded.sub,
          email: decoded.email,
          role: decoded.role,
          permissions: ROLE_PERMISSIONS[decoded.role] || [],
        };
      } catch {
        // Token expired or invalid: proceed as unauthenticated guest
      }
    }
  }
  next();
};

// AI Status & Health
router.get('/health', catchAsync(aiController.getHealth));

// 1. Food Discovery
router.post(
  '/discover',
  optionalAuthenticate,
  validateRequest({ body: discoverFoodSchema }),
  catchAsync(aiController.discover)
);

// 2. Upgraded AI Search
router.post(
  '/search',
  optionalAuthenticate,
  validateRequest({ body: searchAISchema }),
  catchAsync(aiController.search)
);

// 3. Explainable Recommendations
router.post(
  '/recommend',
  optionalAuthenticate,
  validateRequest({ body: recommendAISchema }),
  catchAsync(aiController.recommend)
);

// 4. Cart Assistant
router.post(
  '/cart-assist',
  optionalAuthenticate,
  validateRequest({ body: cartAssistSchema }),
  catchAsync(aiController.cartAssist)
);

// 5. Restaurant Menu Sommelier
router.post(
  '/restaurant-assist',
  validateRequest({ body: restaurantAssistSchema }),
  catchAsync(aiController.restaurantAssist)
);

// 6. Order Assistant / Combo Planner
router.post(
  '/order-assist',
  optionalAuthenticate,
  validateRequest({ body: orderAssistSchema }),
  catchAsync(aiController.orderAssist)
);

// 7. Live Order Telemetry Assistant
router.post(
  '/tracking-assist',
  optionalAuthenticate,
  validateRequest({ body: trackingAssistSchema }),
  catchAsync(aiController.trackingAssist)
);

// 8. User Taste Profile
router.get(
  '/taste-profile',
  authenticate,
  catchAsync(aiController.getTasteProfile)
);

// 9. Conversational Chat
router.post(
  '/chat',
  optionalAuthenticate,
  validateRequest({ body: chatAISchema }),
  catchAsync(aiController.chat)
);

// 10. Real-time Streaming
router.post(
  '/stream',
  optionalAuthenticate,
  catchAsync(aiController.stream)
);

export default router;
