import { Router } from 'express';
import { getPublicTripBySlug, copyTrip } from '../trips/share.controller.js';
import { requireAuth } from '../shared/auth-middleware.js';

const router = Router();

// Public route (no auth required)
router.get('/:share_slug', getPublicTripBySlug);

// Authenticated copy route
router.post('/:share_slug/copy', requireAuth, copyTrip);

export default router;
