
import { createPool } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
  const pool = createPool();

  try {
    if (req.method === 'GET') {
      const { rows } = await pool.query('SELECT * FROM matches');
      // We slaan alle matches op als één blob in één rij voor eenvoud, of per rij
      return res.status(200).json(rows.map(r => r.data));
    }

    if (req.method === 'PUT') {
      const matches = req.body;
      // We gebruiken een simpele 'upsert' logica
      for (const match of matches) {
        await pool.query(
          'INSERT INTO matches (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2',
          [match.id, JSON.stringify(match)]
        );
      }
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
