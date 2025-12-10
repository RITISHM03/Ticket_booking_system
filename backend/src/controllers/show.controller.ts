import { Request, Response } from 'express';
import * as adminService from '../services/admin.service';
import * as bookingService from '../services/booking.service';

export const getShows = async (req: Request, res: Response) => {
    try {
        const shows = await adminService.getAllShows();
        res.json(shows);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch shows' });
    }
};

export const getShowSeats = async (req: Request, res: Response) => {
    try {
        const showId = parseInt(req.params.id);
        const seats = await bookingService.getShowSeats(showId);
        res.json(seats);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch seats' });
    }
};
