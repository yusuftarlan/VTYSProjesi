/*
Bu modül techican_details tablosu için SQL komutlarını içerir
*/ 
import pool from "../config/db.js";

//Tekniker detay kaydını oluşturur
export async function createTechnicianDetail(
    tech_id,
    profession,
    experience_years
) {
    let tech_score = 0;
    let availability_status = 0;
    const [result] = await pool.query(
        `INSERT INTO technician_details (technician_id, profession, technician_score, experience_years, availability_status)
        VALUES (?, ?, ?, ?, ?))`,
        [tech_id, profession, tech_score, experience_years, availability_status]
    );
    pool.end();
    return rows;
}

export async function getTechnicianDetailbyID(tech_id) {
    const [result] = await pool.query(
        `SELECT * FROM technician_details WHERE technician_id = ?`,
        tech_id
    );
    pool.end();
    return result;
}

export async function setTechnicianAvailable(id) {
    const [result] = await pool.query(
        `UPDATE technician_details SET availability_status=1 WHERE technician_id=?`,
        [id]
    );
    pool.end();
    return result;
}

export async function setTechnicianNotAvailable(id) {
    const [result] = await pool.query(
        `UPDATE technician_details SET availability_status=0 WHERE technician_id=?`,
        [id]
    );
    pool.end();
    return result;
}

export async function setTechnicianScore(id, score) {
    const [result] = await pool.query(
        `UPDATE technician_details SET technician_score=? WHERE technician_id=?`,
        [score,id]
    );
    pool.end();
    return result;
}
