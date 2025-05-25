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

    const { id, name, location, description } = fields;
    const image = files.image;

    if (!id || !name || !location || !description) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    try {
      const connection = await getConnection();
      if (image) {
        const imageBuffer = fs.readFileSync(image.filepath);
        await connection.query(
          'UPDATE forts SET name = ?, location = ?, description = ?, image = ? WHERE id = ?',
          [name, location, description, imageBuffer, id]
        );
      } else {
        await connection.query(
          'UPDATE forts SET name = ?, location = ?, description = ? WHERE id = ?',
          [name, location, description, id]
        );
      }
      await connection.end();
      res.status(200).json({ message: 'Fort updated' });
    } catch (error) {
      res.status(500).json({ message: 'DB error', error: error.message });
    }
  });
}
