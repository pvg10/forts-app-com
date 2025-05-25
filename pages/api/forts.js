import { getConnection } from '../../lib/db';

export default async function handler(req, res) {
  try {
    const connection = await getConnection();
    const [rows] = await connection.query("SELECT id, name, location,TO_BASE64(image) AS fortImage, description FROM forts");
    await connection.end();
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching forts' });
  }
}
