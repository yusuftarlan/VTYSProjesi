import bcrypt from 'bcrypt';
import crypto from 'crypto';
import * as userModel from '../models/userModel.js';
import * as technicianModel from '../models/technicianModel.js';
import * as cookiesModel from '../models/cookiesModel.js';

// --- REGISTER ---
export const register = async (req, res) => {
    try {
        const { name, surname, email, password, phone, address, isTechnician } = req.body;

        // 1. Kullanıcı var mı kontrol et
        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Bu e-posta zaten kayıtlı." });
        }

        // 2. Şifreleme
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. ROL BELİRLEME (YENİ MANTIK)
        // isTechnician true ise Role ID = 1 (Teknisyen)
        // isTechnician false ise Role ID = 2 (Müşteri)
        const role_id = isTechnician ? 1 : 2;

        // 4. Kullanıcıyı oluştur
        const userId = await userModel.createUser(name, surname, email, hashedPassword, phone, address, role_id);

        // 5. Eğer Teknisyen (Rol 1) ise detay tablosuna ekle
        if (role_id === 1) {
            await technicianModel.createTechnicianDetail(userId, "Belirtilmedi", 0); 
        }

        res.status(201).json({
            success: true,
            user: {
                id: userId,
                name: name,
                isTechnician: role_id === 1 // Frontend için boolean değer
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