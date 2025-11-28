import React, { createContext, useState, useEffect, useContext } from 'react';
// fakeApi yerine yeni yazdığımız authService'i import ediyoruz
import { authService } from '../services/authService'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Sayfa yenilenince oturumu kontrol et (Backend'e sor)
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await authService.me();
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
        try {
            const response = await authService.login(email, password);
            if (response.success) {
                setUser(response.user);
                return true;
            }
            return false;
        } catch (error) {
            throw error; // Hatayı Login ekranına fırlat (orada ekrana yazdırırız)
        }
    };

    const register = async (formData) => {
        try {
            const response = await authService.register(formData);
            return response.success;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);