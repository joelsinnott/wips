'use client';

import { useEffect, useState } from 'react';

type FileData = {
  name: string;
  path: string;
  createdAt: string;
};

export default function Home() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setMessage(data.message || 'Error uploading file');
      fetchFiles(); // Refresh file list after upload
    } catch {
      setMessage('Error uploading file');
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/upload'); // Call the GET method on the upload route
      const data: FileData[] = await response.json();
      setFiles(data);
    } catch {
      setMessage('Error fetching files');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <h1>Upload your music</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      <p>{message}</p>
      <ul>
        {files.map((file) => (
          <li key={file.name}>
            <a href={file.path} target="_blank" rel="noopener noreferrer">
              {file.name}
            </a>
            <br />
            Uploaded on: {new Date(file.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
