import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to handle file upload
  },
};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    const uploadDir = path.join(process.cwd(), '/public/uploads');
    
    // Check if the upload directory exists, if not create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    form.uploadDir = uploadDir;
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Parsing error:', err);
        return res.status(500).json({ error: 'Error parsing the file' });
      }

      const tempPath = files.file?.[0]?.filepath;
      if (!tempPath) {
        console.error('File not found in request.');
        return res.status(400).json({ error: 'No file provided' });
      }

      const targetPath = path.join(uploadDir, files.file[0].newFilename);

      fs.rename(tempPath, targetPath, (err) => {
        if (err) {
          console.error('Error saving file:', err);
          return res.status(500).json({ error: 'Error saving the file' });
        }

        console.log('File uploaded successfully:', targetPath);
        return res.status(200).json({ message: 'File uploaded successfully', filePath: `/uploads/${files.file[0].newFilename}` });
      });
    });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
