
const API_URL = import.meta.env.VITE_BACKEND_URL;

export const authService = {
    // 1. LOGIN
    login: async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Giriş başarısız');
        return data;
    },

    // 2. REGISTER
    register: async (formData) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Kayıt başarısız');
        return data;
    },

    // 3. SESSION CHECK (ME)
    me: async () => {
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                method: 'GET',
                // Cookie'yi backend'e göndermek için bu satır çok önemli:
                credentials: 'include' 
            });
            const data = await response.json();
            return data;
        } catch (error) {
            return { isAuthenticated: false };
        }
    },

    // 4. LOGOUT
    logout: async () => {
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        return { success: true };
    }
};