import formidable from 'formidable';
import fs from 'fs';
import { getConnection } from '../../lib/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: 'Form parse error' });

    const { name, location, description } = fields;
    const image = files.image;

    if (!name || !location || !description || !image) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const imageBuffer = fs.readFileSync(image.filepath);

    try {
      const connection = await getConnection();
      await connection.query(
        'INSERT INTO forts (name, location, description, image) VALUES (?, ?, ?, ?)',
        [name, location, description, imageBuffer]
      );
      await connection.end();
      res.status(200).json({ message: 'Fort added' });
    } catch (error) {
      res.status(500).json({ message: 'DB error', error: error.message });
    }
  });
}
