import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Ticket, User, Shield } from 'lucide-react';

export const Layout: React.FC = () => {
    const { role, toggleRole, userId } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center text-indigo-600 font-bold text-xl">
                                <Ticket className="w-6 h-6 mr-2" />
                                TicketBooker
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-500">ID: {userId}</div>
                            <button
                                onClick={toggleRole}
                                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
                            >
                                {role === 'ADMIN' ? <Shield className="w-4 h-4 mr-2" /> : <User className="w-4 h-4 mr-2" />}
                                {role} Mode
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
};
