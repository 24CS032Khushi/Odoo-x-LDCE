import { Router } from 'express';
import { getAdminAnalytics } from './admin.controller.js';
import { requireAuth, requireAdmin } from '../shared/auth-middleware.js';

const router = Router();

router.use(requireAuth);
router.use(requireAdmin);

router.get('/analytics', getAdminAnalytics);

export default router;
