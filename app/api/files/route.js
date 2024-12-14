// app/api/files/route.js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const directoryPath = path.join(process.cwd(), 'public/uploads');

    try {
      const files = await fs.promises.readdir(directoryPath);

      // Map through files and create an array of file data
      const fileData = await Promise.all(
        files.map(async (file) => {
          const stats = await fs.promises.stat(path.join(directoryPath, file));
          return {
            name: file,
            path: `/uploads/${file}`,
            createdAt: stats.mtime,
          };
        })
      );

      res.status(200).json(fileData);
    } catch (err) {
      console.error('Error reading the directory:', err);
      res.status(500).json({ error: 'Error reading the directory' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
