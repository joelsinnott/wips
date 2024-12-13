// app/page.tsx
'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null); // TypeScript requires type for file
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return; // Ensure there's a file before submitting

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setMessage(data.message || 'Error uploading file');
    } catch {
      setMessage('Error uploading file');
    }
  };

  return (
    <div>
      <h1>Upload your music</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
