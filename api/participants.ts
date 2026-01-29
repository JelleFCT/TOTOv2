
import { createPool } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
  const pool = createPool();
  
  try {
    if (req.method === 'GET') {
      const { rows } = await pool.query('SELECT * FROM participants ORDER BY total_points DESC');
      // Map de database kolommen terug naar onze TypeScript types
      const participants = rows.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        predictions: r.predictions,
        bonusAnswers: r.bonus_answers,
        totalPoints: r.total_points,
        avatar: r.avatar,
        registeredAt: r.registered_at
      }));
      return res.status(200).json(participants);
    }

    if (req.method === 'POST') {
      const p = req.body;
      await pool.query(
        'INSERT INTO participants (id, name, email, phone, predictions, bonus_answers, total_points, avatar) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [
          p.id, 
          p.name, 
          p.email, 
          p.phone, 
          JSON.stringify(p.predictions), 
          JSON.stringify(p.bonusAnswers), 
          p.totalPoints || 0, 
          p.avatar
        ]
      );
      return res.status(200).json({ success: true });
    }
    
    // Voor het bijwerken van punten door de admin
    if (req.method === 'PUT') {
      const { id, totalPoints } = req.body;
      await pool.query('UPDATE participants SET total_points = $1 WHERE id = $2', [totalPoints, id]);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
