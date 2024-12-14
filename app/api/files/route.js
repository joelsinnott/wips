// app/api/files/route.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const directoryPath = path.join(process.cwd(), 'public/uploads');
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        res.status(500).json({ error: 'Error reading the directory' });
        return;
      }

      // Map through files and create an array of file data
      const fileData = files.map((file) => {
        const stats = fs.statSync(path.join(directoryPath, file));
        return {
          name: file,
          path: `/uploads/${file}`,
          createdAt: stats.mtime,
        };
      });

      res.status(200).json(fileData);
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
