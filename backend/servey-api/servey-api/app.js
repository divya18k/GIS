// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import path from 'path';
// import surveyRoutes from './routes/surveyRoutes.js';
// import userRoutes from './routes/userRoutes.js';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 4000;

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const UPLOAD_BASE = process.env.UPLOAD_PATH || path.resolve(process.cwd(), 'uploads');
// app.use('/uploads', express.static(UPLOAD_BASE));

// app.use('/surveys', surveyRoutes);


// app.use('/users', userRoutes);


// app.get('/', (req, res) => res.json({ ok: true }));

// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import surveyRoutes from './routes/surveyRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { pool } from './config/db.js'; // Import the database connection

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// --- CORS Configuration (Allows your Render Frontend) ---
app.use(cors({
    origin: ["http://localhost:3000", "https://gis-kpj2.onrender.com"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UPLOAD_BASE = process.env.UPLOAD_PATH || path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(UPLOAD_BASE));

app.use('/surveys', surveyRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => res.json({ ok: true, message: "Backend is running!" }));

// --- AUTOMATIC DATABASE SETUP ---
const initDB = async () => {
    try {
        console.log("🛠️ Checking database tables...");
        
        // 1. Create Users Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user'
            );
        `);

        // 2. Create Surveys Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS surveys (
                id SERIAL PRIMARY KEY,
                submitted_by VARCHAR(255),
                generated_filename TEXT,
                data JSONB, 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ Database tables are ready!");
    } catch (err) {
        console.error("❌ Database setup failed:", err.message);
    }
};

// Initialize DB then Start Server
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server listening on port ${PORT}`);
    });
});