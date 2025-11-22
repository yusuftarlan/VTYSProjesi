import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config(); // .env dosyasını yükle
console.log(process.env.DB_PASSWORD)
// Veritabanı bağlantı havuzu oluştur (pool)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10, // aynı anda max 10 bağlantı
});

console.log({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
});
// Bağlantı test fonksiyonu
export async function testDBConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("✅ MySQL bağlantısı başarılı!");
        connection.release();
    } catch (error) {
        console.error("❌ MySQL bağlantı hatası:", error.message);
    }
}

export default pool;

