import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// יצירת pool של חיבורים
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// בדיקת חיבור עם async/await
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to the database.');
    connection.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  }
})();

export default pool;
