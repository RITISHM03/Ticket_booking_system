import { Request, Response } from 'express';
import * as adminService from '../services/admin.service';
import { z } from 'zod';

const createShowSchema = z.object({
    name: z.string().min(1),
    startTime: z.coerce.date(),
    totalSeats: z.coerce.number().int().positive(),
});

export const createShow = async (req: Request, res: Response) => {
    try {
        const data = createShowSchema.parse(req.body);
        const show = await adminService.createShow(data.name, data.startTime, data.totalSeats);
        res.status(201).json(show);
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'Invalid request' });
    }
};
