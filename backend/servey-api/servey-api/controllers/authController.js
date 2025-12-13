// import { pool } from '../config/db.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = 'super_secret_random_string_here'; // In production, use process.env.JWT_SECRET

// // --- REGISTER ---
// export const registerUser = async (req, res) => {
//     try {
//         const { username, password, role } = req.body;

//         // 1. Check if user exists
//         const userExist = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
//         if (userExist.rows.length > 0) {
//             return res.status(400).json({ error: "Username already taken" });
//         }

//         // 2. Hash the password (Security Step)
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // 3. Insert into DB
//         const newUser = await pool.query(
//             "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role",
//             [username, hashedPassword, role || 'user']
//         );

//         res.json({ success: true, message: "User created successfully", user: newUser.rows[0] });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Server error during registration" });
//     }
// };

// // --- LOGIN ---
// export const loginUser = async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         // 1. Check if user exists
//         const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
//         if (result.rows.length === 0) {
//             return res.status(400).json({ error: "Invalid Credentials" });
//         }

//         const user = result.rows[0];

//         // 2. Compare Password (Security Step)
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ error: "Invalid Credentials" });
//         }

//         // 3. Generate Token
//         const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

//         res.json({ 
//             success: true, 
//             token, 
//             user: { username: user.username, role: user.role } 
//         });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Server error during login" });
//     }
// };

// import { pool } from '../config/db.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
// dotenv.config();

// const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// // REGISTER
// export const registerUser = async (req, res) => {
//     try {
//         console.log("Register Request Body:", req.body); // <--- Add this log to debug

//         const { username, password, role } = req.body;

//         if (!username || !password) {
//             return res.status(400).json({ error: "Username and Password are required" });
//         }

//         // Check user
//         const userExist = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
//         if (userExist.rows.length > 0) {
//             return res.status(400).json({ error: "Username already taken" });
//         }

//         // Hash
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Insert
//         const newUser = await pool.query(
//             "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role",
//             [username, hashedPassword, role || 'user']
//         );

//         res.json({ success: true, user: newUser.rows[0] });

//     } catch (err) {
//         console.error("Register Error:", err);
//         res.status(500).json({ error: err.message });
//     }
// };

// // LOGIN
// export const loginUser = async (req, res) => {
//     try {
//         console.log("Login Request Body:", req.body); // <--- Add this log to debug

//         const { username, password } = req.body;

//         const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        
//         if (result.rows.length === 0) {
//             return res.status(400).json({ error: "User not found" });
//         }

//         const user = result.rows[0];

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ error: "Invalid Credentials" });
//         }

//         const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

//         res.json({ success: true, token, user: { username: user.username, role: user.role } });

//     } catch (err) {
//         console.error("Login Error:", err);
//         res.status(500).json({ error: "Server error" });
//     }
// };


// *** FIX: Import 'db' instead of 'pool' ***
import { db } from '../config/db.js'; 
import bcrypt from 'bcryptjs'; // Ensure you have installed 'bcryptjs' or 'bcrypt'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// --- REGISTER ---
export const registerUser = async (req, res) => {
    try {
        console.log("Register Request:", req.body); 

        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and Password are required" });
        }

        // *** FIX: Use db.query ***
        const userExist = await db.query("SELECT * FROM users WHERE username = $1", [username]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ error: "Username already taken" });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // *** FIX: Use db.query ***
        const newUser = await db.query(
            "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role",
            [username, hashedPassword, role || 'user']
        );

        res.json({ success: true, user: newUser.rows[0] });

    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ error: err.message });
    }
};

// --- LOGIN ---
export const loginUser = async (req, res) => {
    try {
        console.log("Login Request:", req.body); 

        const { username, password } = req.body;

        // *** FIX: Use db.query ***
        const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
        
        if (result.rows.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

        res.json({ success: true, token, user: { username: user.username, role: user.role } });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Server error" });
    }
};