/*
 Bu modül user tablosuna ait SQL komutlarını içerir
*/
import pool from "../config/db.js";

//Users tablosuna yeni kullanıcı kaydeder
export async function createUser(
    f_name,
    s_name,
    email,
    passwd,
    tel_no,
    address,
    role_id
) {
    const [result] = await pool.query(
        `INSERT INTO users (first_name, surname, email, passwd, tel_no, home_address, role_id)
        values(?, ?, ?, ?, ?, ?, ?)`,
        [f_name, s_name, email, passwd, tel_no, address, role_id]
    );
    // Insert işleminden sonra yeni eklenen ID'yi döndürelim
    return result.insertId;
}

// E-posta adresine göre kullanıcıyı getirir (Login için gerekli)
export async function getUserByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0]; // Tek bir kullanıcı veya undefined döner
}

// ID'ye göre kullanıcı getirir
export async function getUserByID(id) {
    const [rows] = await pool.query("SELECT * FROM users WHERE id=?", [id]);
    return rows[0];
}
//Users tablosundaki bütün kayıtları getirir
export async function getAllUsers() {
    const [rows] = await pool.query("SELECT * FROM users");
    
    return rows;
}


//Users tablosundan role_id parametresi ile kişileri getirir
export async function getUserByRoleID(role_id) {
    const [rows] = await pool.query(
        "SELECT * FROM users WHERE role_id=?",
        [role_id]
    );
   
    return rows;
}

//Hiç servis talebinde bulunmamış kullanıcıları getirir
export async function getUsersNoAnyRequest() {
    const [rows] = await pool.query(
        `SELECT * FROM users AS u WHERE NOT EXISTS (SELECT * FROM service_requests as s 
        WHERE s.customer_id = u.id )`
    );
   
    return rows;
}

//Müşterinin tüm talep bilgilerini döndürür
export async function getAllServiceRequestsByCustomerID(customer_id) {
    const [result] = await pool.query(
        `SELECT t.profession ,p.product_name, pm.brand, pm.model_code , CONCAT(u.first_name, ' ', u.surname) AS technician_name,
        rs.name, rd.price
        FROM service_requests as sr
        JOIN product_models as pm ON sr.model_id = pm.id
        JOIN products as p ON pm.product_id = p.id
        JOIN users as u ON sr.technician_id = u.id
        JOIN technician_details as t ON u.id = t.technician_id
        JOIN request_statuses as rs ON sr.request_status_id = rs.id
        JOIN request_details as rd ON sr.id = rd.request_id
        WHERE sr.customer_id = ?;`,
        [customer_id]
    );
    return result;
}