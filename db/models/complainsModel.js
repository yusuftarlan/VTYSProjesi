/*
 Şikayet SQL komutları
*/
import pool from "../config/db.js";

// Yeni bir şikayet oluşturur
export async function createComplain(serviceRequest_id, message) {
    const [result] = await pool.query(
        `INSERT INTO complaints (request_id, message, status, response, created_at, resolved_at, response_by) VALUES
        (?, ?, 'İnceleniyor', NULL, NOW(), NULL , NULL)`,
        [serviceRequest_id, message]
    );
    return result;
}

// Şikayet bilgilerini getirir
export async function getComplain(serviceRequest_id) {
    const [result] = await pool.query(
        `SELECT request_id, message, status, 
        response, created_at, resolved_at, response_by 
        FROM complaints WHERE request_id = ?`,
        [serviceRequest_id]
    );
    return result;
}

// Test için

