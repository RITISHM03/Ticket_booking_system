import { prisma } from '../utils/prisma';

export const createShow = async (name: string, startTime: Date, totalSeats: number) => {
    return await prisma.$transaction(async (tx) => {
        // 1. Create Show
        const show = await tx.show.create({
            data: {
                name,
                startTime,
                totalSeats,
            },
        });

        // 2. Generate Seats
        const seatsData = [];
        for (let i = 1; i <= totalSeats; i++) {
            seatsData.push({
                showId: show.id,
                seatNumber: i,
                status: 'AVAILABLE' as const,
            });
        }

        // Bulk insert seats
        await tx.seat.createMany({
            data: seatsData,
        });

        return show;
    });
};

export const getAllShows = async () => {
    return await prisma.show.findMany({
        orderBy: { startTime: 'asc' },
    });
};
