import {
    API_URL, IS_DEV,
    getMockUsers, saveMockUsers,
    getMockDetails, saveMockDetails
} from './mockDb';

export const authService = {
    // 1. LOGIN
    login: async (email, password) => {
        if (IS_DEV) {
            console.log("🟡 Dev Mode: Login");
            await new Promise(resolve => setTimeout(resolve, 400));
            const users = getMockUsers();
            const user = users.find(u => u.email === email && u.passwd === password);

            if (!user) throw new Error('E-posta veya şifre hatalı (Dev Mode)');

            const sessionUser = {
                id: user.id,
                name: user.first_name,
                surname: user.surname,
                isTechnician: user.role_id === 1
            };
            localStorage.setItem('mock_session', JSON.stringify(sessionUser));
            return { success: true, user: sessionUser };
        }

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
        if (IS_DEV) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const users = getMockUsers();

            if (users.find(u => u.email === formData.email)) {
                throw new Error('Bu e-posta zaten kayıtlı.');
            }

            const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
            const role_id = formData.isTechnician ? 1 : 2;

            const newUser = {
                id: newId,
                first_name: formData.name,
                surname: formData.surname || "",
                email: formData.email,
                passwd: formData.password,
                tel_no: formData.phone,
                home_address: formData.address,
                role_id: role_id
            };
            users.push(newUser);
            saveMockUsers(users);

            if (role_id === 1) {
                const details = getMockDetails();
                details.push({
                    technician_id: newId,
                    profession: formData.profession,
                    technician_score: 0,
                    experience_years: parseInt(formData.experienceYears) || 0,
                    availability_status: true
                });
                saveMockDetails(details);
            }
            return { success: true };
        }

        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Kayıt başarısız');
        return data;
    },

    // 3. ME
    me: async () => {
        if (IS_DEV) {
            const session = localStorage.getItem('mock_session');
            if (session) return { isAuthenticated: true, user: JSON.parse(session) };
            return { isAuthenticated: false };
        }

        try {
            const response = await fetch(`${API_URL}/auth/me`, { method: 'GET', credentials: 'include' });
            return await response.json();
        } catch (error) {
            return { isAuthenticated: false };
        }
    },

    // 4. LOGOUT
    logout: async () => {
        if (IS_DEV) {
            localStorage.removeItem('mock_session');
            return { success: true };
        }
        await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
        return { success: true };
    }
};