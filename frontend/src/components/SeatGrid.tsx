import React from 'react';
import type { Seat } from '../types';
import clsx from 'clsx';

interface SeatGridProps {
    seats: Seat[];
    selectedIds: number[];
    onToggle: (id: number) => void;
}

export const SeatGrid: React.FC<SeatGridProps> = ({ seats, selectedIds, onToggle }) => {
    return (
        <div className="grid grid-cols-10 gap-2 w-fit mx-auto p-4 bg-white rounded-lg shadow border border-gray-200">
            {seats.map((seat) => {
                const isSelected = selectedIds.includes(seat.id);
                const isBooked = seat.status === 'BOOKED';
                const isLocked = seat.status === 'LOCKED';

                return (
                    <button
                        key={seat.id}
                        disabled={isBooked || isLocked}
                        onClick={() => onToggle(seat.id)}
                        className={clsx(
                            'w-8 h-8 rounded text-xs flex items-center justify-center font-medium transition-colors',
                            isBooked ? 'bg-red-200 text-red-800 cursor-not-allowed' :
                                isLocked ? 'bg-yellow-200 text-yellow-800 cursor-not-allowed' :
                                    isSelected ? 'bg-indigo-600 text-white' :
                                        'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        )}
                        title={`Seat ${seat.seatNumber} - ${seat.status}`}
                    >
                        {seat.seatNumber}
                    </button>
                );
            })}
        </div>
    );
};
