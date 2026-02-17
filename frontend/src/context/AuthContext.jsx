import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const adminData = localStorage.getItem('admin');

        if (token && adminData) {
            setAdmin(JSON.parse(adminData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await authAPI.login(email, password);

            localStorage.setItem('token', data.token);
            localStorage.setItem('admin', JSON.stringify({
                _id: data._id,
                email: data.email
            }));

            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

            setAdmin({
                _id: data._id,
                email: data.email
            });

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        delete axios.defaults.headers.common['Authorization'];
        setAdmin(null);
    };

    const value = {
        admin,
        loading,
        login,
        logout,
        isAuthenticated: !!admin
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
