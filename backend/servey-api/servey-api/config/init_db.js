import { pool } from './config/db.js';

const initDatabase = async () => {
    try {
        console.log("🔌 Connecting to database...");
        const client = await pool.connect();

        console.log("🔨 Creating tables...");

        // 1. Create Users Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user'
            );
        `);
        console.log("✅ Table 'users' created!");

        // 2. Create Surveys Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS surveys (
                id SERIAL PRIMARY KEY,
                submitted_by VARCHAR(255),
                generated_filename TEXT,
                data JSONB, 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ Table 'surveys' created!");

        client.release();
        console.log("🎉 All tables set up successfully!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Error setting up database:", err);
        process.exit(1);
    }
};

initDatabase();