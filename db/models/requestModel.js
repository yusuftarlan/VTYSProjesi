/*
Request tablosu SQL komutları 
*/
import pool from "../config/db.js";

export async function createRequest(customer_id, technician_id, model_id) {
    const [rows] = await pool.query(
        `INSERT INTO service_requests (customer_id, technician_id, model_id, request_status_id)
        values(?, ?, ?, 1)`,
        [customer_id, technician_id, model_id]
    );
    pool.end();
    return rows;
}

//Hizmeti fiyatını değiştirir
export async function setRequestPrice(request_id, price) {
    const [rows] = await pool.query(
        `UPDATE request_details SET price = ? WHERE request_id = ?`,
        [price, request_id]
    );
    pool.end();
    return rows;
}

//Hizmeti 'taraflar anlaştı' yapar
export async function setRequestStatus_DEALOK(request_id) {
    const [rows] = await pool.query(
        `UPDATE service_requests SET request_status_id = 2 WHERE id = ?`,
        [request_id]
    );
    pool.end();
    return rows;
}

//Hizmeti 'tamamlandı' yapar
export async function setRequestStatus_COMPLETED(request_id) {
    const [rows] = await pool.query(
        `UPDATE service_requests SET request_status_id = 3 WHERE id = ?`,
        [request_id]
    );
    pool.end();
    return rows;
}

//Servis hizmeti puanını değiştirir
export async function setServiceScore(request_id, score) {
    const [rows] = await pool.query(
        `UPDATE service_requests SET service_score = ? WHERE id = ?`,
        [score, request_id]
    );
    pool.end();
    return rows;
}

//Bir hizmetin detaylarını getirir
export async function getRequestDetailByID(request_id) {
    const [rows] = await pool.query(
        `SELECT * FROM request_details 
        WHERE request_id = ?`,
        [request_id]
    );
    pool.end();
    return rows;
}

//Müşterinin tüm servis taleplerini getirir
export async function getAllRequestsByCustomerID(customer_id) {
    const [rows] = await pool.query(
        `SELECT * FROM service_requests 
        WHERE customer_id = ?`,
        [customer_id]
    );
    pool.end();
    return rows;
}

//Teknikerin tüm servis taleperini getirir
export async function getAllRequestsByTechnicianID(tech_id) {
    const [rows] = await pool.query(
        `SELECT * FROM service_requests 
        WHERE technician_id = ?`,
        [tech_id]
    );
    pool.end();
    return rows;
}
