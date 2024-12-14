import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable body parsing to handle file upload
export const config = {
  api: {
    bodyParser: false,
  },
};

// Handling the POST request
export async function POST(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();
    const uploadDir = path.join(process.cwd(), '/public/uploads');

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    form.uploadDir = uploadDir;
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Error parsing file:', err);
        reject(new Response(JSON.stringify({ error: 'Error parsing file' }), { status: 500 }));
      }

      const tempPath = files.file?.[0]?.filepath;
      if (!tempPath) {
        console.error('File not found in request.');
        reject(new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 }));
      }

      const targetPath = path.join(uploadDir, files.file[0].newFilename);

      fs.rename(tempPath, targetPath, (err) => {
        if (err) {
          console.error('Error saving file:', err);
          reject(new Response(JSON.stringify({ error: 'Error saving the file' }), { status: 500 }));
        }

        console.log('File uploaded successfully:', targetPath);
        resolve(new Response(JSON.stringify({ message: 'File uploaded successfully', filePath: `/uploads/${files.file[0].newFilename}` }), { status: 200 }));
      });
    });
  });
}
