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

export async function getComplainsByUserId(user_id) {
    const [result] = await pool.query(
        `SELECT request_id, message, status, 
        response, created_at, resolved_at, response_by 
        FROM complaints as c
        JOIN service_requests as s
        ON c.request_id = s.id 
        WHERE s.customer_id = ?`,
        [user_id]
    );
    return result;
}

// Cevaplanmamış şikayetleri getirir
export async function getAllNonClosedComplain() {
    const [result] = await pool.query(`SELECT 
        c.id, c.request_id, c.message, c.response, c.status, c.created_at,u_tech.first_name as t_name,  u_tech.surname as t_surname,u_cust.first_name as c_name, u_cust.surname as c_surname
        FROM complaints c
        JOIN service_requests sr ON c.request_id = sr.id
        JOIN users u_tech ON sr.technician_id = u_tech.id
        JOIN users u_cust ON sr.customer_id = u_cust.id
        
        WHERE c.response_by IS NULL
        
        ORDER BY c.created_at DESC`);
    return result;
}


export async function respondToComplaint(complaint_id, response, response_by) {
    const [result] = await pool.query(
        `UPDATE complaints
         SET response = ?,
             status = 'Cevaplandı',
             resolved_at = NOW(),
             response_by = ?
         WHERE id = ?`,
        [response, response_by, complaint_id]
    );
    return result;
}
