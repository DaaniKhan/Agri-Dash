// readingService.js
import pool from './db.js';

// Get the latest reading record for a specific user
export async function getLatestReadingByUserID(user_id) {
  const query = `
    SELECT * FROM readings WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1
  `;

  try {
    const result = await pool.query(query, [user_id]);
    return result.rows[0]; // Return only the latest record
  } catch (error) {
    console.error('Error: Could Not Get Latest Reading by User ID.', error);
    return null;
  }
}