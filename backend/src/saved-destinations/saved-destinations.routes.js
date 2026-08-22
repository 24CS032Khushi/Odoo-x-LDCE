import { Router } from 'express';
import { getSavedDestinations, saveDestination, removeSavedDestination } from './saved-destinations.controller.js';
import { requireAuth } from '../shared/auth-middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', getSavedDestinations);
router.post('/', saveDestination);
router.delete('/:cityId', removeSavedDestination);

export default router;
