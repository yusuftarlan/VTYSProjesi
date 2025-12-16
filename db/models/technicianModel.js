/*
Bu modül techican_details tablosu için SQL komutlarını içerir
*/
import pool from "../config/db.js";

//Tekniker detay kaydını oluşturur
export async function createTechnicianDetail(tech_id, profession, experience_years) {
    let tech_score = 0;
    let availability_status = 1;
    const [result] = await pool.query(
        `INSERT INTO technician_details (technician_id, profession, technician_score, experience_years, availability_status)
        VALUES (?, ?, ?, ?, ?)`,
        [tech_id, profession, tech_score, experience_years, availability_status]
    );

    return result;
}

export async function deleteTechnician(tech_id) {
    const [result] = await pool.query(
        `UPDATE users SET role_id = 4 WHERE id = ?`,
        [tech_id]
    );
    return result;
}

export async function getTechniciansWithFilters(filters) {
    // Role ID = 1 olan (Teknisyen) kullanıcıları ve detaylarını çek
    let sql = `
        SELECT t.*, u.first_name, u.surname, u.home_address 
        FROM technician_details t
        JOIN users u ON t.technician_id = u.id
        WHERE u.role_id = 1
    `;
    const params = [];

    // 1. İsim Arama (Ad veya Soyad)
    if (filters.q) {
        sql += ` AND (u.first_name LIKE ? OR u.surname LIKE ?)`;
        const searchTerm = `${filters.q}%`;
        params.push(searchTerm, searchTerm, searchTerm);
    }

    // 2. Uzmanlık Filtresi
    if (filters.profession) {
        sql += ` AND t.profession = ?`;
        params.push(filters.profession);
    }

    // 3. Şehir Filtresi
    if (filters.city) {
        sql += ` AND u.home_address LIKE ?`;
        params.push(`%${filters.city}%`);
    }

    // 4. Deneyim Aralığı
    if (filters.minExp) {
        sql += ` AND t.experience_years >= ?`;
        params.push(filters.minExp);
    }
    if (filters.maxExp) {
        sql += ` AND t.experience_years <= ?`;
        params.push(filters.maxExp);
    }

    // 5. Minimum Puan
    if (filters.minScore) {
        sql += ` AND t.technician_score >= ?`;
        params.push(filters.minScore);
    }

    // 6. Sadece Uygun Olanlar
    if (filters.onlyAvailable === "true" || filters.onlyAvailable === true) {
        sql += ` AND t.availability_status = 1`;
    }

    // Puanı yüksek olan en üstte çıksın
    sql += ` ORDER BY t.technician_score DESC`;

    const [rows] = await pool.query(sql, params);
    return rows;
}

//TeknikerID alarak tekniker detaylarını getirir
export async function getTechnicianDetailByID(tech_id) {
    const [rows] = await pool.query(`SELECT * FROM technician_details WHERE technician_id = ?`, [tech_id]);

    return rows[0];
}

//Tekniker alanlarını getirir
export async function getDistinctProfessions() {
    const [rows] = await pool.query(`SELECT DISTINCT profession FROM technician_details`);
    return rows;
}

export async function setTechnicianAvailable(id , status) {
    const [result] = await pool.query(`UPDATE technician_details SET availability_status=? WHERE technician_id=?`, [status , id]);

    return result;
}

export async function setTechnicianNotAvailable(id) {
    const [result] = await pool.query(`UPDATE technician_details SET availability_status=0 WHERE technician_id=?`, [id]);

    return result;
}

/*
TEKNİKER SKORU İŞLEMLERİ
*/
export async function setTechnicianScore(tech_id, score) {
    const [result] = await pool.query(`UPDATE technician_details SET technician_score=? WHERE technician_id=?`, [score, tech_id]);

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

//Bir ustanın tüm hizmet bilgilerini getirir
export async function getTechnicianRequests(tech_id) {
    const [result] = await pool.query(
        `SELECT s.id , u.first_name, u.surname, u.home_address , u.tel_no , p.product_name, pm.brand, pm.model_code, s.request_date, rs.name, s.service_score, d.detail, d.price , s.request_status_id
        FROM service_requests as s 
        JOIN technician_details as t ON s.technician_id = t.technician_id
        JOIN users as u ON s.customer_id = u.id
        JOIN product_models as pm ON s.model_id = pm.id
        JOIN products as p ON pm.product_id = p.id 
        JOIN request_statuses as rs ON s.request_status_id = rs.id 
        JOIN request_details as d ON d.request_id = s.id
        WHERE s.technician_id= ?`,
        [tech_id]
    );
    return result;
}

//Ustaları şikayet sayılarına göre sıralar
export async function getTechniciansByComplainCount() {
    const [result] = await pool.query(
        `SELECT t.*, sub.sikayet_sayisi
        FROM technician_details t
        JOIN (
            SELECT s.technician_id,
            COUNT(*) as sikayet_sayisi
            FROM complaints c
            JOIN service_requests s ON s.id = c.request_id
            GROUP BY s.technician_id
        ) sub ON t.technician_id = sub.technician_id
        ORDER BY sub.sikayet_sayisi DESC;`,
        [profession]
    );
    return result;
}

//Ustaları şikayet sayılarına göre sıralar
export async function getTechnicianComplainCount(tech_id) {
    const [result] = await pool.query(
        `SELECT COUNT(*) as sikayet_sayisi
        FROM complaints c
        JOIN service_requests s ON s.id = c.request_id
        WHERE technician_id = ?
        GROUP BY s.technician_id`,
        [tech_id]
    );
    return result;
}

export async function getTechniciansWithComplaintStats(filters = {}) {
   
    let sql = `
        SELECT 
            t.*,
            u.id, 
            u.first_name, 
            u.surname, 
            u.home_address,
            COUNT(c.id) AS complaint_count
        FROM technician_details t
        JOIN users u ON t.technician_id = u.id
        LEFT JOIN service_requests sr ON t.technician_id = sr.technician_id
        LEFT JOIN complaints c ON sr.id = c.request_id
        WHERE u.role_id = 1
    `;

    const params = [];

    
    if (filters && filters.q) {
        sql += ` AND (u.first_name LIKE ? OR u.surname LIKE ? OR t.profession LIKE ?)`;
        const searchTerm = `${filters.q}%`;
        params.push(searchTerm, searchTerm, searchTerm);
    }

    
    sql += ` GROUP BY t.technician_id, u.id, u.first_name, u.surname, u.home_address`;

    sql += ` ORDER BY complaint_count DESC`;

    const [rows] = await pool.query(sql, params);
    return rows;
}