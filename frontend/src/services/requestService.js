import {
    API_URL, IS_DEV,
    getMockRequests, saveMockRequests,
    getMockUsers, getMockDetails,
    getMockProductModels, getMockRequestDetails,
    getMockMessages, saveMockMessages,
    getMockComplaints, saveMockComplaints, saveMockDetails
} from './mockDb';

export const requestService = {
    // 1. Sipariş Oluştur
    createOrder: async (orderData) => {
        if (IS_DEV) {
            await new Promise(resolve => setTimeout(resolve, 600));
            const session = localStorage.getItem('mock_session');
            if (!session) throw new Error("Giriş yapmalısınız.");
            const currentUser = JSON.parse(session);

            const requests = getMockRequests();
            const newOrder = {
                id: Date.now(),
                customer_id: currentUser.id,
                technician_id: orderData.technician_id,
                model_id: null,
                brand: orderData.brand,
                product_name: orderData.product_name,
                description: orderData.description,
                price_offer: parseFloat(orderData.price_offer) || null,
                request_status_id: 1, // 1: Başvuru Alındı
                request_date: new Date().toISOString(),
                completed_date: null,
                service_score: null,
                model_text: orderData.model,
            };
            requests.push(newOrder);
            saveMockRequests(requests);
            return { success: true, orderId: newOrder.id };
        }

        // Prod
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
            credentials: 'include'
        });
        return await response.json();
    },

    // 2. Müşteri taleplerini getir
    getCustomerRequests: async () => {
        if (IS_DEV) {
            await new Promise(resolve => setTimeout(resolve, 500));

            const session = localStorage.getItem('mock_session');
            if (!session) throw new Error("Oturum açılmamış");
            const currentUser = JSON.parse(session);

            // Gerekli tüm tabloları çek
            const requests = getMockRequests();
            const users = getMockUsers();
            const details = getMockDetails();
            const productModels = getMockProductModels();
            const requestDetails = getMockRequestDetails();
            const messagesTable = getMockMessages();

            // Kullanıcının taleplerini filtrele
            const myRequests = requests.filter(r => r.customer_id === currentUser.id);

            return myRequests.map(req => {
                const techUser = users.find(u => u.id === req.technician_id);
                const techDetail = details.find(d => d.technician_id === req.technician_id);
                const model = productModels.find(m => m.id === req.model_id);

                const detailRow = requestDetails.find(rd => rd.request_id === req.id);
                const finalPrice = req.price_offer || (detailRow ? detailRow.price : null);

                let detailText = req.description || (detailRow ? detailRow.detail : null);
                if (!detailText) {
                    detailText = model
                        ? `${model.brand} ${model.model_code} Arızası`
                        : (req.product_name ? `${req.brand || ''} ${req.product_name}` : "Arıza Bildirimi");
                }

                const requestMessages = messagesTable
                    .filter(m => m.request_id === req.id)
                    .map(m => {
                        const sender = users.find(u => u.id === m.sender_id);
                        const isMe = m.sender_id === currentUser.id;
                        return {
                            id: m.id,
                            content: m.content,
                            date: m.m_date,
                            senderName: isMe ? "Ben" : (sender ? sender.first_name : "Usta"),
                            isMe: isMe
                        };
                    })
                    .sort((a, b) => new Date(a.date) - new Date(b.date));

                let uiStatus = 'waiting_offer';
                if (req.request_status_id === 3) {
                    uiStatus = 'completed';
                } else if (req.request_status_id === 2) {
                    uiStatus = 'agreed';
                } else if (req.request_status_id === 1) {
                    uiStatus = finalPrice ? 'offer_received' : 'waiting_offer';
                }

                return {
                    id: req.id,
                    technician_name: techUser ? `${techUser.first_name} ${techUser.surname}` : 'Bilinmeyen Usta',
                    profession: techDetail ? techDetail.profession : 'Genel Servis',
                    date: new Date(req.request_date).toLocaleDateString('tr-TR'),
                    status: uiStatus,
                    price: finalPrice,
                    service_score: req.service_score,
                    details: detailText,
                    messages: requestMessages
                };
            }).reverse();
        }

        // Prod
        const response = await fetch(`${API_URL}/requests/my-requests`, {
            method: 'GET',
            credentials: 'include' // Cookie gönderimi için şart
        });

        // EĞER CEVAP BAŞARISIZSA (401, 500 vb.) HATA FIRLAT
        if (!response.ok) {
            throw new Error('Talepler çekilemedi');
        }
        return await response.json();
    },

    // 3. Durum güncelleme
    updateRequestStatus: async (requestId, action, newPrice = null) => {
        if (IS_DEV) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const requests = getMockRequests();
            const index = requests.findIndex(r => r.id === requestId);

            if (index !== -1) {
                if (action === 'accept') {
                    requests[index].request_status_id = 2;
                    if (newPrice) requests[index].price_offer = parseFloat(newPrice);
                } else if (action === 'reject') {
                    requests.splice(index, 1);
                } else if (action === 'new_offer') {
                    requests[index].price_offer = parseFloat(newPrice);
                }
                saveMockRequests(requests);
            }
            return { success: true };
        }

        // Prod
        const response = await fetch(`${API_URL}/requests/${requestId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, newPrice }),
            credentials: 'include'
        });
        return await response.json();
    },

    // 4. Teknisyen poanlama
    rateTechnician: async (requestId, score) => {
        if (IS_DEV) {
            const requests = getMockRequests();
            const req = requests.find(r => r.id === requestId);
            if (req) {
                req.service_score = score;
                saveMockRequests(requests);
            }
            return { success: true };
        }

        // Prod
        const response = await fetch(`${API_URL}/requests/${requestId}/rate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score }),
            credentials: 'include'
        });
        return await response.json();
    },

    // 5. Mesaj gönder
    sendMessage: async (requestId, content) => {
        if (IS_DEV) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const session = localStorage.getItem('mock_session');
            if (!session) throw new Error("Oturum kapalı");
            const currentUser = JSON.parse(session);

            const messages = getMockMessages();
            const newMessage = {
                id: Date.now(),
                request_id: requestId,
                sender_id: currentUser.id,
                content: content,
                m_date: new Date().toISOString().slice(0, 19).replace('T', ' ')
            };

            messages.push(newMessage);
            saveMockMessages(messages);
            return { success: true, message: newMessage };
        }

        // Prod
        const response = await fetch(`${API_URL}/requests/${requestId}/message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
            credentials: 'include'
        });
        return await response.json();
    },

    // 6. Şikayet oluştur
    createComplaint: async (requestId, message) => {
        if (IS_DEV) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const complaints = getMockComplaints();

            const newComplaint = {
                id: Date.now(),
                request_id: requestId,
                message: message,
                status: 'İnceleniyor',
                response: null,
                created_at: new Date().toISOString(),
                resolved_at: null,
                response_by: null
            };

            complaints.push(newComplaint);
            saveMockComplaints(complaints);
            return { success: true };
        }

        // Prod
        const response = await fetch(`${API_URL}/complaints`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ request_id: requestId, message }),
            credentials: 'include'
        });
        return await response.json();
    },

    // 7. Kullanıcı şikayetleri
    getCustomerComplaints: async () => {
        if (IS_DEV) {
            await new Promise(resolve => setTimeout(resolve, 500));

            const session = localStorage.getItem('mock_session');
            if (!session) throw new Error("Oturum açılmamış");
            const currentUser = JSON.parse(session);

            const complaints = getMockComplaints();
            const requests = getMockRequests();
            const users = getMockUsers();

            const userRequestIds = requests
                .filter(r => r.customer_id === currentUser.id)
                .map(r => r.id);

            const userComplaints = complaints.filter(c => userRequestIds.includes(c.request_id));

            return userComplaints.map(comp => {
                const request = requests.find(r => r.id === comp.request_id);
                const techUser = users.find(u => u.id === request.technician_id);

                return {
                    id: comp.id,
                    request_id: comp.request_id,
                    technician_name: techUser ? `${techUser.first_name} ${techUser.surname}` : 'Bilinmeyen Usta',
                    message: comp.message,
                    response: comp.response,
                    status: comp.status,
                    date: new Date(comp.created_at).toLocaleDateString('tr-TR'),
                    resolved_date: comp.resolved_at ? new Date(comp.resolved_at).toLocaleDateString('tr-TR') : null
                };
            }).reverse();
        }

        // Prod
    },

    getTechnicianRequests: async () => {
        if (IS_DEV) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const session = localStorage.getItem('mock_session');
            if (!session) throw new Error("Oturum açılmamış");
            const currentUser = JSON.parse(session);

            const requests = getMockRequests();
            const users = getMockUsers();
            const productModels = getMockProductModels();
            const messagesTable = getMockMessages();
            const details = getMockDetails(); // Usta detayları

            // Sadece bu ustaya atanmış işleri filtrele
            const myJobs = requests.filter(r => r.technician_id === currentUser.id);

            // Ustanın güncel müsaitlik durumunu bul
            const myDetail = details.find(d => d.technician_id === currentUser.id);
            const isAvailable = myDetail ? myDetail.availability_status : false;

            const mappedJobs = myJobs.map(req => {
                const customerUser = users.find(u => u.id === req.customer_id);
                const model = productModels.find(m => m.id === req.model_id);

                // Başlık oluştur
                let detailText = req.description;
                if (!detailText) {
                    detailText = model
                        ? `${model.brand} ${model.model_code} Arızası`
                        : (req.product_name ? `${req.brand || ''} ${req.product_name}` : "Arıza Bildirimi");
                }

                // Mesajları çek
                const requestMessages = messagesTable
                    .filter(m => m.request_id === req.id)
                    .map(m => {
                        const sender = users.find(u => u.id === m.sender_id);
                        const isMe = m.sender_id === currentUser.id;
                        return {
                            id: m.id,
                            content: m.content,
                            date: m.m_date,
                            senderName: isMe ? "Ben" : (sender ? sender.first_name : "Müşteri"),
                            isMe: isMe
                        };
                    });

                return {
                    id: req.id,
                    customer_name: customerUser ? `${customerUser.first_name} ${customerUser.surname}` : 'Gizli Müşteri',
                    customer_address: customerUser ? customerUser.home_address : '',
                    customer_phone: customerUser ? customerUser.tel_no : '',
                    date: new Date(req.request_date).toLocaleDateString('tr-TR'),
                    status_id: req.request_status_id, // 1: Yeni, 2: Devam, 3: Bitti
                    price_offer: req.price_offer,
                    details: detailText,
                    messages: requestMessages
                };
            }).reverse();

            return { jobs: mappedJobs, isAvailable };
        }

        // Prod 
    },

    updateRequestStatus: async (requestId, action, payload = null) => {
        if (IS_DEV) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const requests = getMockRequests();
            const index = requests.findIndex(r => r.id === requestId);

            if (index !== -1) {
                // Müşteri Kabul/Red işlemleri (Mevcut)
                if (action === 'accept') {
                    requests[index].request_status_id = 2; // İşe başla
                } else if (action === 'reject') {
                    requests.splice(index, 1); // İptal
                }
                // [YENİ] Usta Fiyat Teklifi Verme
                else if (action === 'offer_price') {
                    requests[index].price_offer = parseFloat(payload);
                    // Status hala 1 kalır, müşteri onayı beklenir
                }
                // [YENİ] İşi Tamamlama
                else if (action === 'complete_job') {
                    requests[index].request_status_id = 3;
                    requests[index].completed_date = new Date().toISOString();
                }
                saveMockRequests(requests);
            }
            return { success: true };
        }
        // Prod
    },

    toggleAvailability: async (status) => {
        if (IS_DEV) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const session = localStorage.getItem('mock_session');
            const currentUser = JSON.parse(session);

            const details = getMockDetails();
            const myDetail = details.find(d => d.technician_id === currentUser.id);
            if (myDetail) {
                myDetail.availability_status = status;
                saveMockDetails(details);
            }
            return { success: true, newStatus: status };
        }
        // Prod
    }
};