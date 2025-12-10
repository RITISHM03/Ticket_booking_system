import { Request, Response } from 'express';
import * as bookingService from '../services/booking.service';
import { z } from 'zod';

const bookSeatsSchema = z.object({
    userId: z.string().min(1),
    seatIds: z.array(z.number().int()).min(1),
});

export const bookSeats = async (req: Request, res: Response) => {
    try {
        const showId = parseInt(req.params.id);
        const { userId, seatIds } = bookSeatsSchema.parse(req.body);

        const booking = await bookingService.bookSeats(userId, showId, seatIds);
        res.status(201).json(booking);
    } catch (error: any) {
        if (error.message.includes('already booked') || error.message.includes('No seats selected')) {
            res.status(409).json({ error: error.message });
        } else {
            res.status(400).json({ error: error.message || 'Booking failed' });
        }
    }
};
