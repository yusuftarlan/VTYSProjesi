/*
Mesaj SQL komutları
*/
import pool from "../config/db.js";

export async function getAllMessagesByServiceId(serviceRequest_id) {
    const [result] = await pool.query(
        `SELECT sender_id, content, m_date FROM messages 
        WHERE request_id = ? ORDER BY m_date`,
        [serviceRequest_id]
    );

    return result;
}


export async function createMessage(request_id, sender_id, content) {
    const [result] = await pool.query(
        `INSERT INTO messages (request_id, sender_id, message, date) 
         VALUES (?, ?, ?, NOW())`,
        [request_id, sender_id, content]
    );
    return result;
}