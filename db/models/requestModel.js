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

    return rows;
}
/*
-- Örnek 1: Yeni ürün "Akıllı Saat" için servis talebi
CALL CreateServiceRequestWithNewProduct(
    7,                          -- customer_id (Fatma Koç)
    2,                          -- technician_id (Ahmet Yılmaz)
    'Akıllı Saat',              -- product_name (YENİ ÜRÜN)
    'Apple',                    -- brand
    'WatchSeries9',             -- model_code
    'Ekran kırıldı, değişim gerekiyor',  -- detail
    1800.00                     -- price
); */

export async function newCreateRequest(customer_id, technician_id, product, brand, model, detail, price) {
    const [rows] = await pool.query(
        `CALL CreateServiceRequestWithNewProduct(
        ?,                          -- customer_id (Fatma Koç)
        ?,                          -- technician_id (Ahmet Yılmaz)
        ?,              -- product_name (YENİ ÜRÜN)
        ?,                    -- brand
        ?,             -- model_code
        ?,  -- detail
        ?                    -- price
);`,
        [customer_id, technician_id, product, brand, model, detail, price]
    );
    return rows;
}

//Hizmeti fiyatını değiştirir
export async function setRequestPrice(request_id, price) {
    const [rows] = await pool.query(`UPDATE request_details SET price = ? WHERE request_id = ?`, [price, request_id]);

    return rows;
}

//Hizmeti 'taraflar anlaştı' yapar
export async function setRequestStatus_DEALOK(request_id) {
    const [rows] = await pool.query(`UPDATE service_requests SET request_status_id = 2 WHERE id = ?`, [request_id]);

    return rows;
}

//Hizmeti 'tamamlandı' yapar
export async function setRequestStatus_COMPLETED(request_id) {
    const [rows] = await pool.query(`UPDATE service_requests SET request_status_id = 3 WHERE id = ?`, [request_id]);

    return rows;
}

//Servis hizmeti puanını değiştirir
export async function setServiceScore(request_id, score) {
    const [rows] = await pool.query(`UPDATE service_requests SET service_score = ? WHERE id = ?`, [score, request_id]);

    return rows;
}

//Bir hizmetin detaylarını getirir
export async function getRequestDetailByID(request_id) {
    const [rows] = await pool.query(
        `SELECT * FROM request_details 
        WHERE request_id = ?`,
        [request_id]
    );

    return rows;
}

//Müşterinin tüm servis taleplerini getirir
export async function getAllRequestsByCustomerID(customer_id) {
    const [rows] = await pool.query(
        `SELECT * FROM service_requests 
        WHERE customer_id = ?`,
        [customer_id]
    );

    return rows;
}

//Teknikerin tüm servis taleperini getirir
export async function getAllRequestsByTechnicianID(tech_id) {
    const [rows] = await pool.query(
        `SELECT * FROM service_requests 
        WHERE technician_id = ?`,
        [tech_id]
    );

    return rows;
}

//Servi talep durumunu getirir
export async function getRequestStatuByID(serviceRequest_id) {
    const [rows] = await pool.query(
        `SELECT rs.name FROM
        service_requests as s JOIN
        request_statuses as rs
        ON s.request_status_id =
        rs.id WHERE s.id = ?`,
        [serviceRequest_id]
    );
    return rows;
}
