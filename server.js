require('dotenv').config(); // MUST be at the very top
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = 5000;

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. Database Configuration
// This uses the variables from your .env file
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false } 
});

// 3. The Listener Route
app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM your_table_name LIMIT 10;');
    res.status(200).json({ results: result.rows });
  } catch (err) {
    console.error("DB Error:", err.message);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// 4. Start the Server
app.listen(PORT, () => {
  console.log(`Backend listener is active at http://localhost:${PORT}`);
});
