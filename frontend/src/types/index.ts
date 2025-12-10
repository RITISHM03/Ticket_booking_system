export interface Show {
    id: number;
    name: string;
    startTime: string;
    totalSeats: number;
}

export type SeatStatus = 'AVAILABLE' | 'LOCKED' | 'BOOKED';

export interface Seat {
    id: number;
    showId: number;
    seatNumber: number;
    status: SeatStatus;
}

export interface Booking {
    id: number;
    showId: number;
    userId: string;
    status: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'CANCELLED';
    seats: { seat: Seat }[];
}
