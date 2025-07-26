import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { listOffers, createOffer, bookSlot, updateBookingStatus, deleteOffer, listBookings, getMyBookings, getMyAcceptedBookings } from '../controllers/skill.controller';

const router = Router();

router.get('/', listOffers);
router.post('/', authenticate, createOffer);
// routes for the logged-in student must appear before dynamic :id routes to avoid collision
router.get('/my/bookings', authenticate, getMyBookings);
router.get('/my/accepted-bookings', authenticate, getMyAcceptedBookings);
router.get('/:id/bookings', authenticate, listBookings);
router.post('/:id/book', authenticate, bookSlot);
router.patch('/bookings/:id', authenticate, updateBookingStatus);

router.delete('/:id', authenticate, deleteOffer);

export default router;
