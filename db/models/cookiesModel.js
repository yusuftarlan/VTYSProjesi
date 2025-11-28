/*
 Cookies SQL komutları
*/
import pool from "../config/db.js";

// Yeni bir cookie oluşturur (Login olunca)
export async function createCookie(user_id, token, expiry_date) {
    const [result] = await pool.query(
        `INSERT INTO cookies (customer_id, cookie_info, expiry_date)
         VALUES (?, ?, ?)`,
        [user_id, token, expiry_date]
    );
    return result;
}

// Token bilgisine göre cookie ve kullanıcıyı getirir (Auth/Me için)
export async function getCookieByToken(token) {
    const [rows] = await pool.query(
        `SELECT c.*, u.id as user_id, u.first_name, u.surname, u.role_id 
         FROM cookies c
         JOIN users u ON c.customer_id = u.id
         WHERE c.cookie_info = ? AND c.expiry_date > NOW()`,
        [token]
    );
    return rows[0];
}

// Cookie siler (Logout için)
export async function deleteCookie(token) {
    const [result] = await pool.query(
        `DELETE FROM cookies WHERE cookie_info = ?`,
        [token]
    );
    return result;
}

export async function getAllValidCookies() {
    const [result] = await pool.query(
        `SELECT * FROM cookies WHERE expiry_date < NOW();`
    );
    return result;
}