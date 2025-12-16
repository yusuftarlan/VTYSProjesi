import { API_URL, IS_DEV, getMockUsers, getMockDetails, getMockProducts, getMockProductModels } from './mockDb';

export const technicianService = {
    // 1. Teknisyenleri getir
    getTechnicians: async (filters = {}) => {
        if (IS_DEV) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const users = getMockUsers();
            const details = getMockDetails();

            let techs = users
                .filter(u => u.role_id === 1)
                .map(user => {
                    const detail = details.find(d => d.technician_id === user.id) || {
                        profession: "Belirtilmedi", technician_score: 0, experience_years: 0, availability_status: false
                    };
                    return { ...user, ...detail };
                });

            if (filters.q) {
                const q = filters.q.toLowerCase();
                techs = techs.filter(t =>
                    t.first_name.toLowerCase().includes(q) || t.surname.toLowerCase().includes(q)
                );
            }
            if (filters.profession) techs = techs.filter(t => t.profession === filters.profession);
            if (filters.city) techs = techs.filter(t => t.home_address.toLowerCase().includes(filters.city.toLowerCase()));
            if (filters.minScore) techs = techs.filter(t => t.technician_score >= parseFloat(filters.minScore));
            if (filters.onlyAvailable === true || filters.onlyAvailable === 'true') techs = techs.filter(t => t.availability_status === true);

            return techs;
        }

        const params = new URLSearchParams(filters);
        const response = await fetch(`${API_URL}/auth/technicians?${params.toString()}`, { credentials: 'include' });
        return await response.json();
    },

    // 2. Uzmanlıkları getir
    getProfessions: async () => {
        if (IS_DEV) {
            const details = getMockDetails();
            const uniqueProfessions = [...new Set(details.map(d => d.profession))];
            return uniqueProfessions.sort();
        }

        const response = await fetch(`${API_URL}/auth/technicians/professions`, { credentials: 'include' });
        return await response.json();
    },

    // 3. Ürün Listesini Getir
    getProducts: async () => {
        if (IS_DEV) {
            return getMockProducts();
        }

        const response = await fetch(`${API_URL}/types`, { credentials: 'include' });
        return await response.json();
    },

    // 4. Modelleri Getir 
    getModels: async (productName = null) => {
        if (IS_DEV) {
            const models = getMockProductModels();
            if (productName) {
                const products = getMockProducts();
                const matchedProduct = products.find(p =>
                    (p.product_name === productName) || (p === productName)
                );
                if (matchedProduct && matchedProduct.id) {
                    return models.filter(m => m.product_id === matchedProduct.id);
                }

                return [];
            }

            return models;
        }

        const response = await fetch(`${API_URL}/brands`, { credentials: 'include' });
        return await response.json();
    },

    getTechniciansWithStats: async (filters = {}) => {
        if (IS_DEV) {
            await new Promise(resolve => setTimeout(resolve, 400));
            const users = getMockUsers();
            const details = getMockDetails();
            const requests = getMockRequests();
            const complaints = getMockComplaints();

            // Sadece teknisyenleri al
            let techs = users.filter(u => u.role_id === 1).map(user => {
                const detail = details.find(d => d.technician_id === user.id) || {};

                // Bu ustanın işleri (requestleri)
                const techRequestIds = requests
                    .filter(r => r.technician_id === user.id)
                    .map(r => r.id);

                // Bu işlere ait şikayet sayısı
                const complaintCount = complaints.filter(c => techRequestIds.includes(c.request_id)).length;

                return {
                    ...user,
                    ...detail,
                    complaint_count: complaintCount
                };
            });

            // Filtreleme (Arama)
            if (filters.q) {
                const q = filters.q.toLowerCase();
                techs = techs.filter(t =>
                    t.first_name.toLowerCase().includes(q) ||
                    t.surname.toLowerCase().includes(q) ||
                    (t.profession && t.profession.toLowerCase().includes(q))
                );
            }

            // Varsayılan Sıralama: Şikayet sayısı (Çoktan aza)
            techs.sort((a, b) => b.complaint_count - a.complaint_count);

            return techs;
        }
        const params = new URLSearchParams(filters);
        const response = await fetch(`${API_URL}/admin/technicians-stats`, {
            credentials: 'include'
        });
        return await response.json();
    }
};