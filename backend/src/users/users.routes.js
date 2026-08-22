import { Router } from 'express';
import { getMe, updateMe, deleteMe } from './users.controller.js';
import { requireAuth } from '../shared/auth-middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/me', getMe);
router.put('/me', updateMe);
router.delete('/me', deleteMe);

export default router;
