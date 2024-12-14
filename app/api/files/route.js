// app/api/files/route.js
import fs from 'fs';
import path from 'path';

export async function GET(req, res) {
  const directoryPath = path.join(process.cwd(), 'public/uploads');

  try {
    const files = await fs.promises.readdir(directoryPath);

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
}
