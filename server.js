require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. Middleware ---
app.use(cors()); // Prevents "CORS Policy" errors in the browser
app.use(express.json()); // Allows your server to read JSON sent from the frontend

// --- 2. Database Connection ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // REQUIRED for Render/Cloud Postgres
  }
});

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Connection failed:', err.stack);
  }
  console.log('✅ Connected to PostgreSQL on Render!');
  release();
});

// --- 3. The API Routes ---

// A "Health Check" route to see if the server is alive
app.get('/', (req, res) => {
  res.send('Backend Server is Running!');
});

// The main route to get data from the database
app.get('/api/data', async (req, res) => {
  try {
    // IMPORTANT: Replace 'your_table_name' with an actual table in the DB
    const result = await pool.query('SELECT * FROM media_items LIMIT 20;');
    
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error("Query Error:", err.message);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// --- 4. Start the Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
