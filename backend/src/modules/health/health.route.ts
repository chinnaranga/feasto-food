import { Router } from 'express';
import { getHealthStatus } from './health.controller.js';
import { catchAsync } from '../../shared/utils/catchAsync.js';

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: System Health Check
 *     description: Returns runtime health status for API, MongoDB, Redis, FCM, system memory, and uptime.
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: Health report successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 */
router.get('/', catchAsync(getHealthStatus));

export default router;
