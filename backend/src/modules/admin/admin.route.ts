import { Router } from 'express';
import { sendSuccess } from '../../shared/utils/response.js';

const router = Router();

router.get('/status', (_req, res) => {
  sendSuccess(res, { module: 'admin', status: 'initialized' }, 'Admin platform base router ready');
});

export default router;
