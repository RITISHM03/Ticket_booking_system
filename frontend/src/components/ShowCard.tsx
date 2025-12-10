import React from 'react';
import type { Show } from '../types';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

export const ShowCard: React.FC<{ show: Show }> = ({ show }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{show.name}</h3>
                    <div className="flex items-center text-gray-500 mt-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(show.startTime).toLocaleString()}
                    </div>
                </div>
                <Link
                    to={`/booking/${show.id}`}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium"
                >
                    Book Now
                </Link>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between text-sm text-gray-500">
                <span>Total Seats: {show.totalSeats}</span>
            </div>
        </div>
    );
};
