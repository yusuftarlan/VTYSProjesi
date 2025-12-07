/*
Product ve model tablosu SQL komutları 
*/

import pool from "../config/db.js";

export async function getProductNameByServiceID(serviceRequest_id) {
    const [rows] = await pool.query(
        `SELECT p.product_name FROM service_requests AS s
        JOIN product_models AS m ON m.id = s.model_id
        JOIN products AS p ON p.id = m.product_id
        WHERE s.id = ?;`,
        [serviceRequest_id]
    );

    return rows;
}

//Tüm ürün türlerini getirir
export async function getAllProductTypes() {
    const [rows] = await pool.query(`SELECT DISTINCT product_name FROM products`);
    return rows;
}

//Tüm marka türlerini getirir
export async function getAllBrands() {
    const [rows] = await pool.query(`SELECT DISTINCT brand FROM product_models ORDER BY 1 ASC`);
    return rows;
}
