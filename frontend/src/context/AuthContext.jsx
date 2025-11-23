import React, { createContext, useState, useEffect, useContext } from 'react';
import { fakeApi } from '../services/fakeApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Uygulama ilk açıldığında kontrol ediliyor mu?

    // Sayfa yenilenince oturumu kontrol et (GET /auth/me)
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fakeApi.me();
                if (response.isAuthenticated) {
                    setUser(response.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkSession();
    }, []);

    const login = async (email, password) => {
        const response = await fakeApi.login(email, password);
        if (response.success) {
            setUser(response.user);
            return true;
        }
        return false;
    };

    const register = async (formData) => {
        const response = await fakeApi.register(formData);
        return response.success;
    };

    const logout = async () => {
        await fakeApi.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);