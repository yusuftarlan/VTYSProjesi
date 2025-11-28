/*
Cookies SQL komtuları
*/
import pool from "../config/db.js";

//Geçerlilik tarihi süren çerezleri getirir
export async function getAllValidCookies() {
    const [result] = await pool.query(
        `SELECT * FROM cookies WHERE expiry_date < NOW();`
    );
    pool.end();
    return result;
}
