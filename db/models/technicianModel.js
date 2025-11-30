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

    return rows;
}

//TeknikerID alarak tekniker detaylarını getirir
export async function getTechnicianDetailByID(tech_id) {
    const [result] = await pool.query(
        `SELECT * FROM technician_details WHERE technician_id = ?`,
        tech_id
    );

    return result;
}

//Tekniker alanlarını getirir
export async function getTechnicianProfessions() {
    const [result] = await pool.query(
        `SELECT DISTINCT profession FROM technician_details`
    );

    return result;
}

export async function setTechnicianAvailable(id) {
    const [result] = await pool.query(
        `UPDATE technician_details SET availability_status=1 WHERE technician_id=?`,
        [id]
    );

    return result;
}

export async function setTechnicianNotAvailable(id) {
    const [result] = await pool.query(
        `UPDATE technician_details SET availability_status=0 WHERE technician_id=?`,
        [id]
    );

    return result;
}

/*
TEKNİKER SKORU İŞLEMLERİ
*/
export async function setTechnicianScore(tech_id, score) {
    const [result] = await pool.query(
        `UPDATE technician_details SET technician_score=? WHERE technician_id=?`,
        [score, tech_id]
    );

    return result;
}
export async function updateTechnicianScore(tech_id) {
    const [result] = await pool.query(
        `UPDATE technician_details AS t 
        SET t.technician_score = (SELECT AVG(s.service_score) FROM service_requests as s 
        WHERE s.technician_id = t.technician_id) WHERE t.technician_id = ?`,
        [tech_id]
    );

    return result;
}

//Tüm teknikerlerin id ve servis sayılarını getirir
export async function getAllTechniciansServiceCount() {
    const [result] = await pool.query(
        `SELECT t.technician_id,
            count(service_requests.id) FROM
            service_requests as s JOIN
            technician_details as t ON
            s.technician_id = t.technician_id
            GROUP BY t.technician_id`
    );

    return result;
}
//Bir alandaki ustaları puanlarına göre sıralayarak döndürür
export async function getTechniciansScoreByProfession(profession) {
    const [result] = await pool.query(
        `SELECT u.name, u.surname,
        t.technician_score FROM
        technician_details as t JOIN
        users AS u
        ON t.technician_id = u.id WHERE
        t.profession = ? ORDER BY
        t.technician_score DESC `,
        [profession]
    );

    return result;
}

//Puanı input skordan yüksek tüm ustaların bilgilerini getirir
export async function getTechniciansExpYearByGreaterScore(score) {
    const [result] = await pool.query(
        `SELECT *
        FROM technician_details as t
        JOIN users AS u
        ON t.technician_id = u.id WHERE
        t.technician_score > ? ORDER BY t.
        experience_years
        DESC`,
        [score]
    );

    return result;
}

//Puanı input skordan küçük tüm ustaların bilgilerini getirir
export async function getTechniciansByLessScore(score) {
    const [result] = await pool.query(
        `SELECT *
        FROM technician_details as t
        JOIN users AS u
        ON t.technician_id = u.id WHERE
        t.technician_score < ? ORDER BY t.
        experience_years
        DESC`,
        [score]
    );

    return result;
}

//İsme göre usta-arama fonksiyonu
export async function getTechniciansByName(word) {
    const [result] = await pool.query(
        `SELECT *
        FROM technician_details as t
        JOIN users AS u
        ON t.technician_id = u.id WHERE
        (u.first_name || ' ' || u.surname) LIKE '?%'; ORDER BY t.
        experience_years
        DESC`,
        [word]
    );

    return result;
}

//Bir alandaki ustaları deneyimlerine göre sıralayarak döndürür
export async function getTechniciansExpYearByProfession(profession) {
    const [result] = await pool.query(
        `SELECT u.name, u.surname, t.
        experience_years
        FROM technician_details as t
        JOIN users AS u
        ON t.technician_id = u.id WHERE
        t.profession = ? ORDER BY t.
        experience_years
        DESC`,
        [profession]
    );

    return result;
}

//10'dan fazla şikayet almış ustaları döndürür
export async function getAllTechniciansTenTimesGetComplained() {
    const [result] = await pool.query(
        `SELECT sr.technician_id, u.first_name, u.surname, COUNT(c.id) AS complaint_count
        FROM complaints c JOIN service_requests sr ON c.request_id = sr.id
        JOIN users u ON sr.technician_id = u.id
        GROUP BY sr.technician_id, u.first_name, u.surname
        HAVING COUNT(c.id) > 10;`
    );

    return result;
}
