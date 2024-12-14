import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable body parsing to handle file upload
export const config = {
  api: {
    bodyParser: false,
  },
};

// Handling the POST request
export async function POST(req, res) {
  const form = new formidable.IncomingForm();
  const uploadDir = path.join(process.cwd(), '/public/uploads');

  // Ensure the upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  form.uploadDir = uploadDir;
  form.keepExtensions = true;

  try {
    // Parse the form data
    const { files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ files });
      });
    });

    const tempPath = files.file?.[0]?.filepath;
    if (!tempPath) {
      console.error('File not found in request.');
      return res.status(400).json({ error: 'No file provided' });
    }

    const targetPath = path.join(uploadDir, files.file[0].newFilename);

    // Rename and save the file to the target path
    await fs.promises.rename(tempPath, targetPath);
    console.log('File uploaded successfully:', targetPath);
    return res.status(200).json({ message: 'File uploaded successfully', filePath: `/uploads/${files.file[0].newFilename}` });
  } catch (err) {
    console.error('Error parsing file:', err);
    return res.status(500).json({ error: 'Error parsing file' });
  }
}
