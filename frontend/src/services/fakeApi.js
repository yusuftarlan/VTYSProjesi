const DELAY = 800;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fakeApi = {
    // --- 1. LOGIN ---
    login: async (email, password) => {
        await wait(DELAY);

        // Kayıtlı kullanıcıları çek
        const users = JSON.parse(localStorage.getItem('users_db') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('fake_cookie_token', 'xyz_token_' + user.id);

            return {
                success: true,
                user: {
                    id: user.id,
                    name: user.name,
                    isTechnician: user.isTechnician
                }
            };
        } else {
            throw new Error("E-posta veya şifre hatalı!");
        }
    },

    // --- 2. REGISTER ---
    register: async (userData) => {
        await wait(DELAY);
        const users = JSON.parse(localStorage.getItem('users_db') || '[]');

        if (users.find(u => u.email === userData.email)) {
            throw new Error("Bu e-posta adresi zaten kayıtlı.");
        }

        // Yeni kullanıcı oluştur 
        const newUser = {
            ...userData,
            id: Date.now().toString(), // Rastgele ID
            role: userData.isTechnician ? 'technician' : 'user'
        };

        // DB'ye kaydet
        users.push(newUser);
        localStorage.setItem('users_db', JSON.stringify(users));

        return {
            success: true,
            user: {
                id: newUser.id,
                name: newUser.name,
                isTechnician: newUser.isTechnician
            }
        };
    },

    // --- 3. ME (SESSION CHECK) ---
    me: async () => {
        await wait(DELAY);
        const token = localStorage.getItem('fake_cookie_token');

        if (token) {
            const userId = token.split('_')[2];
            const users = JSON.parse(localStorage.getItem('users_db') || '[]');
            const user = users.find(u => u.id === userId);

            if (user) {
                return {
                    isAuthenticated: true,
                    user: {
                        id: user.id,
                        name: user.name,
                        isTechnician: user.isTechnician
                    }
                };
            }
        }

        return { isAuthenticated: false };
    },

    // --- 4. LOGOUT ---
    logout: async () => {
        await wait(500);
        // Cookie'yi sil
        localStorage.removeItem('fake_cookie_token');
        return { success: true };
    }
};