// src/renderer/components/auth/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        try {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch (error) {
            // Ignorar errores silenciosamente
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            if (!window.api || !window.api.login) {
                return { success: false, error: 'Error de configuración de la aplicación' };
            }

            const result = await window.api.login(email, password);

            if (result.success) {
                setUser(result.user);
                localStorage.setItem('user', JSON.stringify(result.user));
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            if (error.message?.includes('Failed to fetch') || error.message?.includes('Network Error')) {
                return { success: false, error: 'Error de conexión con el servidor' };
            } else if (error.message?.includes('timeout')) {
                return { success: false, error: 'Tiempo de espera agotado' };
            } else {
                return { success: false, error: 'Error de conexión. Intente nuevamente.' };
            }
        }
    };

    const createUser = async (userData) => {
        try {
            if (!window.api || !window.api.createUser) {
                return { success: false, error: 'Error de configuración de la aplicación' };
            }

            const result = await window.api.createUser(userData);
            return result;
        } catch (error) {
            return { success: false, error: 'Error al crear usuario. Intente nuevamente.' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = {
        user,
        login,
        logout,
        createUser,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};