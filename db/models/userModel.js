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
    const [rows] = await pool.query(
        `INSERT INTO users (first_name, surname, email, passwd, tel_no, home_address, role_id)
        values(?, ?, ?, ?, ?, ?, ?)`,
        [f_name, s_name, email, passwd, tel_no, address, role_id]
    );
    pool.end();
    return rows;
}
//Users tablosundaki bütün kayıtları getirir
export async function getAllUsers() {
    const [rows] = await pool.query("SELECT * FROM users");
    pool.end();
    return rows;
}

//Users tablosundan bir kişiyi id numarası ile getirir
export async function getUserByID(id) {
    const [rows] = await pool.query("SELECT * FROM users WHERE id=?", id);
    pool.end();
    return rows;
}

//Users tablosundan role_id parametresi ile kişileri getirir
export async function getUserByRoleID(role_id) {
    const [rows] = await pool.query(
        "SELECT * FROM users WHERE role_id=?",
        role_id
    );
    pool.end();
    return rows;
}
