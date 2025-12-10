import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getShows } from '../api/client';
import type { Show } from '../types';
import { ShowCard } from '../components/ShowCard';
import { CreateShowForm } from '../components/CreateShowForm';

export const Home: React.FC = () => {
    const { role } = useAuth();
    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchShows = async () => {
        try {
            const res = await getShows();
            setShows(res.data);
        } catch {
            console.error('Failed to load shows');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShows();
    }, []);

    return (
        <div className="space-y-8">
            {role === 'ADMIN' && (
                <section>
                    <CreateShowForm onSuccess={fetchShows} />
                </section>
            )}

            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Shows</h2>
                {loading ? (
                    <div>Loading...</div>
                ) : shows.length === 0 ? (
                    <div className="text-gray-500">No shows available.</div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {shows.map(show => (
                            <ShowCard key={show.id} show={show} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};
