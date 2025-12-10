import bcrypt from 'bcrypt';
import crypto from 'crypto';
import * as userModel from '../models/userModel.js';
import * as technicianModel from '../models/technicianModel.js';
import * as messageModel from '../models/messageModel.js';
import * as cookiesModel from '../models/cookiesModel.js';
import * as requestModel from '../models/requestModel.js';
import * as complainsModel from '../models/complainsModel.js';
import * as productModel from '../models/productModel.js';


// --- REGISTER ---
export const register = async (req, res) => {
    try {
        // Frontend'den gelen profession ve experience verilerini de alıyoruz
        const { name, surname, email, password, phone, address, isTechnician, profession, experience_years } = req.body;

        // 1. Kullanıcı var mı kontrol et
        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Bu e-posta zaten kayıtlı." });
        }

        // 2. Şifreleme
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. ROL BELİRLEME
        const role_id = isTechnician ? 1 : 2;

        // 4. Kullanıcıyı oluştur
        const userId = await userModel.createUser(name, surname, email, hashedPassword, phone, address, role_id);

        // 5. Eğer Teknisyen ise detayları kaydet
        if (role_id === 1) {
            // Formdan gelen veriyi kullan, gelmediyse varsayılan ata
            const techProfession = profession || "Genel Tamir";
            const techExp = experience_years || 0;
            
            await technicianModel.createTechnicianDetail(userId, techProfession, techExp); 
        }

        res.status(201).json({
            success: true,
            user: {
                id: userId,
                name: name,
                isTechnician: role_id === 1
            }
        });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ success: false, message: "Sunucu hatası." });
    }
};

// --- LOGIN ---
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ success: false, message: "E-posta veya şifre hatalı." });
        }

        const validPassword = await bcrypt.compare(password, user.passwd);
        if (!validPassword) {
            return res.status(401).json({ success: false, message: "E-posta veya şifre hatalı." });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 1);
        
        await cookiesModel.createCookie(user.id, token, expiryDate);

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        // Role ID 1 ise Teknisyendir
        const isTechnician = user.role_id === 1;

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.first_name,
                isTechnician: isTechnician
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Sunucu hatası." });
    }
};

// --- ME (Oturum Kontrol) ---
export const getMe = async (req, res) => {
    try {
        const token = req.cookies.access_token;
        if (!token) return res.json({ isAuthenticated: false });

        // SQL sorgusunda user tablosunu da joinlediğimiz için role_id gelir
        const session = await cookiesModel.getCookieByToken(token);
        
        if (!session) return res.json({ isAuthenticated: false });

        // Role ID 1 ise Teknisyendir
        const isTechnician = session.role_id === 1;

        res.json({
            isAuthenticated: true,
            user: {
                id: session.user_id,
                name: session.first_name,
                isTechnician: isTechnician
            }
        });

    } catch (error) {
        console.error("Me Error:", error);
        res.json({ isAuthenticated: false });
    }
};

// --- LOGOUT ---
export const logout = async (req, res) => {
    try {
        const token = req.cookies.access_token;
        if (token) await cookiesModel.deleteCookie(token);
        
        res.clearCookie('access_token');
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};


export const getTechnicians = async (req, res) => {
    try {
        
        const filters = {
            q: req.query.q,
            profession: req.query.profession,
            city: req.query.city,
            minExp: req.query.minExp,
            maxExp: req.query.maxExp,
            minScore: req.query.minScore,
            onlyAvailable: req.query.onlyAvailable
        };

        const technicians = await technicianModel.getTechniciansWithFilters(filters);
        res.json(technicians);

    } catch (error) {
        console.error("Get Technicians Error:", error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
};

// Uzmanlık Listesini Getir
export const getProfessions = async (req, res) => {
    try {
        const rows = await technicianModel.getDistinctProfessions();
       
        const professions = rows.map(row => row.profession);
        res.json(professions);
    } catch (error) {
        console.error("Get Professions Error:", error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
};

export const getProductTypes = async (req, res) => {
    try {
        const rows = await productModel.getAllProductTypes();
       
        const types = rows.map(row => row.product_name);
        res.json(types);
    } catch (error) {
        console.error("Get Types Error:", error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
};


export const getBrands = async (req, res) => {
    try {
        const rows = await productModel.getAllBrands();
       
        const brands = rows.map(row => row.brand);
        res.json(brands);
    } catch (error) {
        console.error("Get Brands Error:", error);
        res.status(500).json({ message: "Sunucu hatası" });
    }
};



// 1. Sipariş Oluştur
export const createOrder = async (req, res) => {
    try {
        const token = req.cookies.access_token;
        const session = await cookiesModel.getCookieByToken(token);
        if (!session) return res.status(401).json({ message: "Oturum açmalısınız" });

        // Frontend'den gelen JSON'ı karşılıyoruz
        // JSON yapısı: { technician_id, brand, product_name, description, price_offer, model_text }
        const { technician_id, brand, product_name, model_text, model, description, price_offer } = req.body;

        if (!technician_id) {
            return res.status(400).json({ message: "Teknisyen ID eksik" });
        }

        // Model bilgisi 'model_text' olarak gelebilir, 'model' olarak gelebilir veya boş olabilir.
        const finalModel = model_text || model || "Model Belirtilmedi";

        // Stored Procedure Çağrısı (requestModel.js içindeki fonksiyon)
        // Sıralama: customer_id, technician_id, product, brand, model, detail, price
        await requestModel.newCreateRequest(
            session.user_id,
            technician_id,
            product_name,
            brand,
            finalModel,
            description,
            price_offer
        );

        res.json({ success: true, message: "Sipariş oluşturuldu" });

    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ message: "Sipariş oluşturulamadı: " + error.message });
    }
};

// 2. Müşteri Taleplerini Getir (Mesajlarla Birlikte)
export const getCustomerRequests = async (req, res) => {
    try {
        const token = req.cookies.access_token;
        const session = await cookiesModel.getCookieByToken(token);
        if (!session) return res.status(401).json({ message: "Yetkisiz" });

        const requests = await userModel.getAllServiceRequestsByCustomerID(session.user_id);

        const enrichedRequests = await Promise.all(requests.map(async (req) => {
            const messages = await messageModel.getAllMessagesByServiceId(req.id);
            
            const formattedMessages = messages.map(m => ({
                id: m.id,
                content: m.message, 
                date: m.date,
                senderName: m.sender_id === session.user_id ? "Ben" : `${m.first_name}`,
                isMe: m.sender_id === session.user_id
            }));

            let uiStatus = 'waiting_offer';
            if (req.request_status_id === 3) uiStatus = 'completed';
            else if (req.request_status_id === 2) uiStatus = 'agreed';
            else if (req.request_status_id === 1 && req.price) uiStatus = 'offer_received';

            return {
                id: req.id,
                technician_name: req.technician_name,
                profession: req.profession,
                date: req.request_date,
                status: uiStatus,
                price: req.price,
                service_score: req.service_score,
                details: req.detail || (req.product_name ? `${req.product_name}  ${req.brand} ${req.model_code} ` : "Detay yok"),
                messages: formattedMessages
            };
        }));

        res.json(enrichedRequests);

    } catch (error) {
        console.error("Get My Requests Error:", error);
        res.status(500).json({ message: "Talepler alınamadı" });
    }
};

// 3. Durum Güncelleme
export const updateRequestStatus = async (req, res) => {
    try {
        const requestId = req.params.id;
        const { action, newPrice } = req.body;

        if (action === 'accept') {
            await requestModel.setRequestStatus_DEALOK(requestId);
        } else if (action === 'new_offer') {
            await requestModel.setRequestPrice(requestId, newPrice);
        } else if (action === 'reject') {
            await requestModel.setRequestStatus_COMPLETED(requestId);
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({ message: "Güncellenemedi" });
    }
};

// 4. Puanlama
export const rateTechnician = async (req, res) => {
    try {
        const requestId = req.params.id;
        const { score } = req.body;
        await requestModel.setServiceScore(requestId, score);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: "Puanlanamadı" });
    }
};

// 5. Mesaj Gönder
export const sendMessage = async (req, res) => {
    try {
        const token = req.cookies.access_token;
        const session = await cookiesModel.getCookieByToken(token);
        if (!session) return res.status(401).json({ message: "Yetkisiz" });

        const requestId = req.params.id;
        const { content } = req.body;

        await messageModel.createMessage(requestId, session.user_id, content);
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: "Mesaj gönderilemedi" });
    }
};

// 6. Şikayet Oluştur
export const createComplaint = async (req, res) => {
    try {
        const { request_id, message } = req.body;
        await complaintModel.createComplain(request_id, message);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: "Şikayet oluşturulamadı" });
    }
};