import { Router } from 'express';
import { getMe, updateMe } from './users.controller.js';
import { requireAuth } from '../shared/auth-middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/me', getMe);
router.put('/me', updateMe);

export default router;
