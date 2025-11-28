/*
Product ve model tablosu SQL komutları 
*/

import pool from "../config/db.js";

export async function getProductNameByServieID(serviceRequest_id) {
    const [rows] = await pool.query(
        `SELECT p.product_name FROM service_requests AS s
        JOIN product_models AS m ON m.id = s.model_id
        JOIN products AS p ON p.id = m.product_id
        WHERE s.id = ?;`,
        [serviceRequest_id]
    );
    pool.end();
    return rows;
}