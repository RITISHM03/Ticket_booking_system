import React, { useState } from 'react';
import { createShow } from '../api/client';

export const CreateShowForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setLoading(true);
        try {
            await createShow({
                name: formData.get('name') as string,
                startTime: formData.get('startTime') as string,
                totalSeats: Number(formData.get('totalSeats')),
            });
            onSuccess();
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            alert('Failed to create show');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Create New Show</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Show Name</label>
                    <input required name="name" type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                    <input required name="startTime" type="datetime-local" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Total Seats</label>
                    <input required name="totalSeats" type="number" min="1" max="500" defaultValue="50" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                </div>
                <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Show'}
                </button>
            </div>
        </form>
    );
};
