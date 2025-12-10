import React, { createContext, useContext, useState } from 'react';

type UserRole = 'ADMIN' | 'USER';

interface AuthContextType {
    role: UserRole;
    userId: string;
    toggleRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [role, setRole] = useState<UserRole>('USER');
    const [userId] = useState(`user_${Math.floor(Math.random() * 10000)}`);

    const toggleRole = () => setRole(prev => (prev === 'USER' ? 'ADMIN' : 'USER'));

    return (
        <AuthContext.Provider value={{ role, userId, toggleRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
