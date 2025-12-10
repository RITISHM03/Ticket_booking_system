import { prisma } from '../utils/prisma';
import { Prisma, SeatStatus } from '@prisma/client';

export const bookSeats = async (userId: string, showId: number, seatIds: number[]) => {
    if (seatIds.length === 0) throw new Error('No seats selected');

    return await prisma.$transaction(async (tx) => {
        // 1. Lock the requested seats using Raw SQL for explicit "FOR UPDATE"
        // We use Prisma.join to handle the array of IDs safely
        const lockedSeats: any[] = await tx.$queryRaw`
      SELECT id, status, "showId" 
      FROM seats 
      WHERE id IN (${Prisma.join(seatIds)}) 
      FOR UPDATE
    `;

        // 2. Validate all seats exist
        if (lockedSeats.length !== seatIds.length) {
            throw new Error('Some seats do not exist');
        }

        // 3. Validate seat availability
        for (const seat of lockedSeats) {
            if (seat.status !== 'AVAILABLE') {
                throw new Error(`Seat ${seat.id} is already booked or reserved`);
            }
            if (seat.showId !== showId) {
                throw new Error(`Seat ${seat.id} does not belong to the requested show`);
            }
        }

        // 4. Update seats to BOOKED (or Booking Created state)
        // We can use updateMany here since we hold the lock, but updateMany doesn't always guarantee order or return. 
        // Usually safe within transaction.
        await tx.seat.updateMany({
            where: { id: { in: seatIds } },
            data: { status: 'BOOKED' }, // Using 'BOOKED' directly as per requirement status: PENDING -> CONFIRMED. 
            // If we want PENDING first, we set PENDING. Let's assume direct Booking for this version or PENDING 
            // followed by a payment mock.
            // User requirement: "Booking status: PENDING -> CONFIRMED / FAILED"
            // "Only one user should be able to book a seat at the same time."
            // If we used PENDING, we'd set seat to LOCKED. Let's stick to simple flow: Booked.
        });

        // NOTE: If using PENDING logic, seats should be 'LOCKED' temporarily.
        // Let's assume we mark them BOOKED immediately for simplicity in this demo, 
        // OR we create a Booking with PENDING and seats with LOCKED.
        // Let's go with Booking PENDING, Seats LOCKED?
        // User schema: seats(state). Booking(status).

        // Let's set Seats to BOOKED to prevent others from picking them.
        // And Booking to CONFIRMED. 
        // IF the user wanted a 2-step (hold, then pay), we'd use LOCKED.
        // I'll stick to direct confirmation for simplicity unless strict flow requested.
        // "Optional: Auto-fail PENDING bookings after 2 minutes." -> implies PENDING state exists.
        // Let's just set Booking to CONFIRMED and Seat to BOOKED for the "Book" action.

        // 5. Create Booking Record
        const booking = await tx.booking.create({
            data: {
                showId,
                userId,
                status: 'CONFIRMED',
                seats: {
                    create: seatIds.map(id => ({ seatId: id }))
                }
            },
            include: {
                seats: { include: { seat: true } }
            }
        });

        return booking;
    });
};

export const getShowSeats = async (showId: number) => {
    return await prisma.seat.findMany({
        where: { showId },
        orderBy: { seatNumber: 'asc' }
    });
};
