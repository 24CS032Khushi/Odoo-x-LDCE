import { Router } from 'express';
import { getCities, getCityById, getRecommendations } from './cities.controller.js';
import { optionalAuth } from '../shared/auth-middleware.js';

const router = Router();

router.get('/recommendations', optionalAuth, getRecommendations);
router.get('/', getCities);
router.get('/:id', getCityById);

export default router;
