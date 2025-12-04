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
