import { Router } from 'express';
import { createTrip, getTrips, getTripById, updateTrip, deleteTrip } from './trips.controller.js';
import { addTripStop, reorderTripStops, updateTripStop, deleteTripStop } from './stops.controller.js';
import { getTripItinerary, addItineraryItem, updateItineraryItem, deleteItineraryItem } from '../itinerary/itinerary.controller.js';
import { requireAuth } from '../shared/auth-middleware.js';

const router = Router();

router.use(requireAuth);

// Trips CRUD
router.post('/', createTrip);
router.get('/', getTrips);
router.get('/:id', getTripById);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);

// Stops Endpoints
router.post('/:id/stops', addTripStop);
router.put('/:id/stops/reorder', reorderTripStops);
router.put('/:id/stops/:stopId', updateTripStop);
router.delete('/:id/stops/:stopId', deleteTripStop);

// Itinerary Endpoints
router.get('/:id/itinerary', getTripItinerary);
router.post('/:id/itinerary-items', addItineraryItem);
router.put('/:id/itinerary-items/:itemId', updateItineraryItem);
router.delete('/:id/itinerary-items/:itemId', deleteItineraryItem);

export default router;
