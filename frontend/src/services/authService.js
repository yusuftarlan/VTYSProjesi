import fakeDb from './fake_db.json';

const API_URL = import.meta.env.VITE_BACKEND_URL;
const IS_DEV = import.meta.env.VITE_IS_DEV === 'true';

const getMockDB = () => {
    const localData = localStorage.getItem('mock_db_users');
    if (localData) {
        return JSON.parse(localData);
    } else {
        // İlk açılışta JSON dosyasındaki verileri hafızaya al
        localStorage.setItem('mock_db_users', JSON.stringify(fakeDb.users));
        return fakeDb.users;
    }
};

const getMockDetails = () => {
    const localData = localStorage.getItem('mock_db_details');
    if (localData) return JSON.parse(localData);
    // İlk açılışta JSON'dan al
    localStorage.setItem('mock_db_details', JSON.stringify(fakeDb.technician_details));
    return fakeDb.technician_details;
};
const getMockOrders = () => {
    const localData = localStorage.getItem('mock_orders');
    if (localData) return JSON.parse(localData);
    return []; // Başlangıçta boş
};

const saveMockDetails = (details) => localStorage.setItem('mock_db_details', JSON.stringify(details));
const saveMockUsers = (users) => localStorage.setItem('mock_db_users', JSON.stringify(users));
const saveMockOrders = (orders) => localStorage.setItem('mock_orders', JSON.stringify(orders));

export const authService = {
    // 1. LOGIN
    login: async (email, password) => {
        // --- DEV MODU (SUNUCUSUZ) ---
        if (IS_DEV) {
            console.log("🟡 Dev Mode: Login Simulation");

            // Yapay bir gecikme ekleyelim (gerçekçi olsun)
            await new Promise(resolve => setTimeout(resolve, 500));

            const users = getMockDB();
            const user = users.find(u => u.email === email && u.passwd === password);

            if (!user) {
                throw new Error('E-posta veya şifre hatalı (Dev Mode)');
            }

            // Oturumu taklit etmek için localStorage'a 'session' kaydediyoruz
            const sessionUser = {
                id: user.id,
                name: user.first_name,
                isTechnician: user.role_id === 1
            };
            localStorage.setItem('mock_session', JSON.stringify(sessionUser));

            return { success: true, user: sessionUser };
        }

        // --- PRODUCTION MODU (BACKEND) ---
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
            console.log("🟡 Dev Mode: Register");
            await new Promise(resolve => setTimeout(resolve, 500));

            const users = getMockUsers();

            if (users.find(u => u.email === formData.email)) {
                throw new Error('Bu e-posta zaten kayıtlı.');
            }

            const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
            const role_id = formData.isTechnician ? 1 : 2;

            // User tablosuna ekle
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

            // EĞER TEKNİSYENSE DETAY TABLOSUNA EKLE (YENİ)
            if (role_id === 1) {
                const details = getMockDetails();
                details.push({
                    technician_id: newId,
                    profession: formData.profession,
                    technician_score: 0, // Yeni başlayan 0 puan
                    experience_years: parseInt(formData.experienceYears) || 0,
                    availability_status: true // Varsayılan müsait
                });
                saveMockDetails(details);
            }

            return { success: true };
        }

        // Prod
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
        // --- DEV MODU (SUNUCUSUZ) ---
        if (IS_DEV) {
            // LocalStorage'dan session kontrolü yap
            const session = localStorage.getItem('mock_session');
            if (session) {
                return {
                    isAuthenticated: true,
                    user: JSON.parse(session)
                };
            }
            return { isAuthenticated: false };
        }

        // --- PRODUCTION MODU (BACKEND) ---
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                method: 'GET',
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
        // --- DEV MODU (SUNUCUSUZ) ---
        if (IS_DEV) {
            localStorage.removeItem('mock_session');
            return { success: true };
        }

        // --- PRODUCTION MODU (BACKEND) ---
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        return { success: true };
    },

    // 5. GET TECHNICIANS
    getTechnicians: async (filters = {}) => {
        // filters: { q, minExp, maxExp, city, minScore, onlyAvailable }

        if (IS_DEV) {
            console.log("🟡 Filtreler:", filters);
            await new Promise(resolve => setTimeout(resolve, 300));

            const users = getMockDB();
            const details = fakeDb.technician_details;

            // 1. JOIN İşlemi (User + Details)
            let techs = users
                .filter(u => u.role_id === 1)
                .map(user => {
                    const detail = details.find(d => d.technician_id === user.id) || {
                        profession: "Belirtilmedi", technician_score: 0, experience_years: 0, availability_status: false
                    };
                    return { ...user, ...detail };
                });

            // 2. Arama (İsim, Meslek)
            if (filters.q) {
                const q = filters.q.toLowerCase();
                techs = techs.filter(t =>
                    t.first_name.toLowerCase().includes(q) ||
                    t.surname.toLowerCase().includes(q)
                );
            }

            // 3. Deneyim Yılı
            if (filters.minExp) techs = techs.filter(t => t.experience_years >= parseInt(filters.minExp));
            if (filters.maxExp) techs = techs.filter(t => t.experience_years <= parseInt(filters.maxExp));

            // 4. Şehir Filtresi (home_address içinde arar)
            if (filters.city && filters.city !== "") {
                techs = techs.filter(t => t.home_address.toLowerCase().includes(filters.city.toLowerCase()));
            }

            // 5. Min Puan Filtresi
            if (filters.minScore) {
                techs = techs.filter(t => t.technician_score >= parseFloat(filters.minScore));
            }

            // 6. Sadece Müsait Olanlar
            if (filters.onlyAvailable === true || filters.onlyAvailable === 'true') {
                techs = techs.filter(t => t.availability_status === true);
            }

            return techs;
        }

        // Production için query string oluşturma (Backend varsa)
        const params = new URLSearchParams(filters);
        const response = await fetch(`${API_URL}/auth/technicians?${params.toString()}`);
        if (!response.ok) throw new Error('Veri çekilemedi');
        return await response.json();
    },

    // 6. GET PRODUCT TYPES
    getProfessions: async () => {
        if (IS_DEV) {
            // Fake DB'deki "products" tablosunu döndür
            const details = fakeDb.technician_details || [];
            const uniqueProfessions = [...new Set(details.map(d => d.profession))];
            return uniqueProfessions.sort();
        }
        const response = await fetch(`${API_URL}/auth/technicians/professions`);
        return await response.json();
    },

    // --- 7. CREATE ORDER ---
    createOrder: async (orderData) => {
        // orderData: { technician_id, brand, product_name, description, price_offer }

        if (IS_DEV) {
            console.log("🟡 Dev Mode: Creating Order", orderData);
            await new Promise(resolve => setTimeout(resolve, 800)); // Loading simülasyonu

            // 1. Oturum kontrolü
            const session = localStorage.getItem('mock_session');
            if (!session) throw new Error("Sipariş oluşturmak için giriş yapmalısınız.");
            const currentUser = JSON.parse(session);

            // 2. Mevcut siparişleri çek
            const orders = getMockOrders();

            // 3. Yeni sipariş objesi
            const newOrder = {
                id: Date.now(), // Benzersiz ID
                customer_id: currentUser.id,
                technician_id: orderData.technician_id,
                brand: orderData.brand,
                product_name: orderData.product_name,
                description: orderData.description,
                price_offer: parseFloat(orderData.price_offer),
                status: 'pending', // pending, accepted, rejected, completed
                created_at: new Date().toISOString()
            };

            // 4. Kaydet
            orders.push(newOrder);
            saveMockOrders(orders);

            return { success: true, orderId: newOrder.id };
        }

        // Prod implementation
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });
        if (!response.ok) throw new Error('Sipariş oluşturulamadı');
        return await response.json();
    }
};