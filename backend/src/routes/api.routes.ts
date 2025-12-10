import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import * as showController from '../controllers/show.controller';
import * as bookingController from '../controllers/booking.controller';

const router = Router();

// Admin
router.post('/admin/shows', adminController.createShow);

// Show
router.get('/shows', showController.getShows);
router.get('/shows/:id/seats', showController.getShowSeats);

// Booking
router.post('/shows/:id/book', bookingController.bookSeats);

// Health
router.get('/health', (req, res) => res.json({ status: 'ok' }));

export default router;
