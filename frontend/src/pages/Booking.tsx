import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getShowSeats, bookSeats } from '../api/client';
import type { Seat } from '../types';
import { SeatGrid } from '../components/SeatGrid';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BookingPage: React.FC = () => {
    const { id } = useParams();
    const showId = Number(id);
    const { userId } = useAuth();
    // const navigate = useNavigate();

    const [seats, setSeats] = useState<Seat[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSeats = useCallback(async () => {
        try {
            const res = await getShowSeats(showId);
            setSeats(res.data);
            // Clear selected if they became unavailable
            const bookedIds = res.data.filter((s: Seat) => s.status !== 'AVAILABLE').map((s: Seat) => s.id);
            setSelectedIds(prev => prev.filter(id => !bookedIds.includes(id)));
        } catch (e) {
            setError('Failed to load seats');
        } finally {
            setLoading(false);
        }
    }, [showId]);

    useEffect(() => {
        fetchSeats();
        // Poll every 5s for updates (bonus)
        const interval = setInterval(fetchSeats, 5000);
        return () => clearInterval(interval);
    }, [fetchSeats]);

    const toggleSeat = (seatId: number) => {
        setSelectedIds(prev =>
            prev.includes(seatId)
                ? prev.filter(id => id !== seatId)
                : [...prev, seatId]
        );
    };

    const handleBook = async () => {
        if (selectedIds.length === 0) return;
        setBooking(true);
        setError(null);
        try {
            await bookSeats(showId, { userId, seatIds: selectedIds });
            alert('Booking Confirmed!');
            setSelectedIds([]);
            fetchSeats();
        } catch (err: any) {
            const msg = err.response?.data?.error || 'Booking failed';
            setError(msg);
            // Refresh to show why it failed (someone else booked?)
            fetchSeats();
        } finally {
            setBooking(false);
        }
    };

    if (loading) return <div className="p-8">Loading seats...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Shows
                </Link>
                <h1 className="text-2xl font-bold">Select Seats</h1>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="mb-8 text-center text-gray-500 text-sm">
                    <div className="w-64 h-2 bg-gray-300 mx-auto rounded-full mb-2"></div>
                    Screen this way
                </div>

                <SeatGrid seats={seats} selectedIds={selectedIds} onToggle={toggleSeat} />

                <div className="mt-8 flex items-center justify-between border-t pt-6">
                    <div className="flex gap-4 text-sm">
                        <div className="flex items-center"><div className="w-4 h-4 bg-gray-100 rounded mr-2 border"></div> Available</div>
                        <div className="flex items-center"><div className="w-4 h-4 bg-indigo-600 rounded mr-2"></div> Selected</div>
                        <div className="flex items-center"><div className="w-4 h-4 bg-red-200 rounded mr-2"></div> Booked</div>
                    </div>

                    <div className="flex items-center gap-4">
                        {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
                        <div className="text-right">
                            <div className="text-sm text-gray-500">Selected: {selectedIds.length}</div>
                            <div className="font-bold text-lg">Total: ${selectedIds.length * 10}</div>
                        </div>
                        <button
                            onClick={handleBook}
                            disabled={selectedIds.length === 0 || booking}
                            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {booking ? 'Booking...' : 'Confirm Booking'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
