
import { createPool } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
  const pool = createPool();
  
  try {
    // Maak de participants tabel aan
    await pool.query(`
      CREATE TABLE IF NOT EXISTS participants (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        predictions JSONB NOT NULL,
        bonus_answers JSONB NOT NULL,
        total_points INTEGER DEFAULT 0,
        avatar TEXT,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Maak de matches tabel aan
    await pool.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL
      );
    `);

    return res.status(200).json({ 
      success: true, 
      message: "Database succesvol klaargezet! De tabellen 'participants' en 'matches' zijn aangemaakt." 
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
