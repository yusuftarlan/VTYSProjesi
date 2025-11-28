import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { testDBConnection } from './db/config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware'ler
// CORS ayarı: Frontend (React) ile Backend'in konuşabilmesi için
app.use(cors({
    origin: 'http://localhost:5173', // Vite varsayılan portu, senin frontend portun farklıysa değiştir
    credentials: true // Cookie transferi için zorunlu
}));

app.use(express.json()); // JSON body okumak için
app.use(cookieParser()); // Cookie okumak için

// Veritabanı Testi
testDBConnection();

// Rotalar
app.use('/api/auth', authRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('API Çalışıyor...');
});

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor.`);
});