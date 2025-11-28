/*
Mesaj SQL komutları
*/
import pool from "../config/db.js";

export async function getAllMessagesByServiceId(serviceRequest_id) {
    const [result] = await pool.query(
        `SELECT * FROM messages JOIN service_requests ON service_requests.id = messages.id
        WHERE service_requests.id = ?`,
        [serviceRequest_id]
    );
    pool.end();
    return result;
}
