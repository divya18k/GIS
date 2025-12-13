// // // import express from 'express';
// // // import cors from 'cors';
// // // import dotenv from 'dotenv';
// // // import path from 'path';
// // // import surveyRoutes from './routes/surveyRoutes.js';
// // // import userRoutes from './routes/userRoutes.js';

// // // dotenv.config();

// // // const app = express();
// // // const PORT = process.env.PORT || 4000;

// // // app.use(cors());
// // // app.use(express.json());
// // // app.use(express.urlencoded({ extended: true }));

// // // const UPLOAD_BASE = process.env.UPLOAD_PATH || path.resolve(process.cwd(), 'uploads');
// // // app.use('/uploads', express.static(UPLOAD_BASE));

// // // app.use('/surveys', surveyRoutes);


// // // app.use('/users', userRoutes);


// // // app.get('/', (req, res) => res.json({ ok: true }));

// // // app.listen(PORT, () => {
// // //   console.log(`Server listening on port ${PORT}`);
// // // });


// // import express from 'express';
// // import cors from 'cors';
// // import dotenv from 'dotenv';
// // import path from 'path';
// // import surveyRoutes from './routes/surveyRoutes.js';
// // import userRoutes from './routes/userRoutes.js';
// // import { pool } from './config/db.js'; // Import the database connection

// // dotenv.config();

// // const app = express();
// // const PORT = process.env.PORT || 4000;

// // // --- CORS Configuration (Allows your Render Frontend) ---
// // app.use(cors({
// //     origin: ["http://localhost:3000", "https://gis-kpj2.onrender.com"],
// //     credentials: true
// // }));

// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));

// // const UPLOAD_BASE = process.env.UPLOAD_PATH || path.resolve(process.cwd(), 'uploads');
// // app.use('/uploads', express.static(UPLOAD_BASE));

// // app.use('/surveys', surveyRoutes);
// // app.use('/users', userRoutes);

// // app.get('/', (req, res) => res.json({ ok: true, message: "Backend is running!" }));

// // // --- AUTOMATIC DATABASE SETUP ---
// // const initDB = async () => {
// //     try {
// //         console.log("🛠️ Checking database tables...");
        
// //         // 1. Create Users Table
// //         await pool.query(`
// //             CREATE TABLE IF NOT EXISTS users (
// //                 id SERIAL PRIMARY KEY,
// //                 username VARCHAR(255) UNIQUE NOT NULL,
// //                 password VARCHAR(255) NOT NULL,
// //                 role VARCHAR(50) DEFAULT 'user'
// //             );
// //         `);

// //         // 2. Create Surveys Table
// //         await pool.query(`
// //             CREATE TABLE IF NOT EXISTS surveys (
// //                 id SERIAL PRIMARY KEY,
// //                 submitted_by VARCHAR(255),
// //                 generated_filename TEXT,
// //                 data JSONB, 
// //                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// //             );
// //         `);
// //         console.log("✅ Database tables are ready!");
// //     } catch (err) {
// //         console.error("❌ Database setup failed:", err.message);
// //     }
// // };

// // // Initialize DB then Start Server
// // initDB().then(() => {
// //     app.listen(PORT, () => {
// //         console.log(`🚀 Server listening on port ${PORT}`);
// //     });
// // });


// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import path from 'path';
// import surveyRoutes from './routes/surveyRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import { pool } from './config/db.js';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 4000;

// // --- CORS Configuration ---
// app.use(cors({
//     origin: ["http://localhost:3000", "https://gis-kpj2.onrender.com"],
//     credentials: true
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const UPLOAD_BASE = process.env.UPLOAD_PATH || path.resolve(process.cwd(), 'uploads');
// app.use('/uploads', express.static(UPLOAD_BASE));

// app.use('/surveys', surveyRoutes);
// app.use('/users', userRoutes);

// app.get('/', (req, res) => res.json({ ok: true, message: "Backend is running!" }));

// // --- AUTOMATIC DATABASE SETUP ---
// const initDB = async () => {
//     try {
//         console.log("🛠️ Checking database tables...");

//         // *** THIS LINE FIXES YOUR ERROR ***
//         // It deletes the "bad" table so the correct one can be created
//         await pool.query('DROP TABLE IF EXISTS surveys'); 

//         // 1. Create Users Table
//         await pool.query(`
//             CREATE TABLE IF NOT EXISTS users (
//                 id SERIAL PRIMARY KEY,
//                 username VARCHAR(255) UNIQUE NOT NULL,
//                 password VARCHAR(255) NOT NULL,
//                 role VARCHAR(50) DEFAULT 'user'
//             );
//         `);

//         // 2. Create Surveys Table (With ALL correct columns now)
//         await pool.query(`
//             CREATE TABLE IF NOT EXISTS surveys (
//                 id SERIAL PRIMARY KEY,
//                 district VARCHAR(255),
//                 block VARCHAR(255),
//                 route_name VARCHAR(255),
//                 location_type VARCHAR(255),
//                 shot_number VARCHAR(100),
//                 ring_number VARCHAR(100),
//                 start_location VARCHAR(255),
//                 end_location VARCHAR(255),
//                 latitude DECIMAL,
//                 longitude DECIMAL,
//                 surveyor_name VARCHAR(255),
//                 surveyor_mobile VARCHAR(50),
//                 generated_filename TEXT,
//                 submitted_by VARCHAR(255),
//                 survey_date TIMESTAMP,
//                 photos JSONB,
//                 videos JSONB,
//                 selfie_path TEXT,
//                 remarks TEXT,
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//             );
//         `);
//         console.log("✅ Database tables are reset and ready!");
//     } catch (err) {
//         console.error("❌ Database setup failed:", err.message);
//     }
// };

// // Start Server
// initDB().then(() => {
//     app.listen(PORT, () => {
//         console.log(`🚀 Server listening on port ${PORT}`);
//     });
// });


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import surveyRoutes from './routes/surveyRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { pool } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Allow your Render Frontend to talk to this Backend
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

// --- DATABASE AUTO-FIXER ---
const initDB = async () => {
    try {
        console.log("🛠️ Repairing Database...");

        // 1. DELETE THE OLD TABLE (This fixes the column errors)
        await pool.query('DROP TABLE IF EXISTS surveys'); 

        // 2. CREATE USERS TABLE
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user'
            );
        `);

        // 3. CREATE SURVEYS TABLE (With all correct columns)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS surveys (
                id SERIAL PRIMARY KEY,
                district VARCHAR(255),
                block VARCHAR(255),
                route_name VARCHAR(255),
                location_type VARCHAR(255),
                shot_number VARCHAR(100),
                ring_number VARCHAR(100),
                start_location VARCHAR(255),
                end_location VARCHAR(255),
                latitude DECIMAL,
                longitude DECIMAL,
                surveyor_name VARCHAR(255),
                surveyor_mobile VARCHAR(50),
                generated_filename TEXT,
                submitted_by VARCHAR(255),
                survey_date TIMESTAMP,
                photos JSONB,
                videos JSONB,
                selfie_path TEXT,
                remarks TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ Database is FIXED and READY!");
    } catch (err) {
        console.error("❌ Database setup failed:", err.message);
    }
};

// Start Server
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server listening on port ${PORT}`);
    });
});