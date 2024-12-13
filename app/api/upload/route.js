// app/api/upload/route.js
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to handle file upload
  },
};

export async function POST(req) {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), '/public/uploads'); // Save files in 'public/uploads' folder
  form.keepExtensions = true; // Keep file extensions

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(new Response(JSON.stringify({ error: 'Something went wrong during the upload' }), { status: 500 }));
        return;
      }

      // Move file to a permanent location
      const tempPath = files.file[0].filepath;
      const targetPath = path.join(process.cwd(), 'public/uploads', files.file[0].newFilename);

      fs.rename(tempPath, targetPath, (err) => {
        if (err) {
          reject(new Response(JSON.stringify({ error: 'Error saving the file' }), { status: 500 }));
          return;
        }
        resolve(new Response(JSON.stringify({ message: 'File uploaded successfully', filePath: `/uploads/${files.file[0].newFilename}` }), { status: 200 }));
      });
    });
  });
}
