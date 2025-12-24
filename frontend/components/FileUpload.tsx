'use client';

import { useState } from 'react';

interface UploadResponse {
  message: string;
  inserted_count: number;
}

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setMessage('');
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    if (!file.name.endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setMessage('');

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/upload/transactions', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Upload failed');
      }

      const data: UploadResponse = await response.json();
      setMessage(`✓ ${data.message}`);
      setFile(null);
      if (document.getElementById('file-input') instanceof HTMLInputElement) {
        (document.getElementById('file-input') as HTMLInputElement).value = '';
      }

      // Refresh transactions after upload
      window.dispatchEvent(new CustomEvent('transactionsUpdated'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded border border-gray-200">
      <label className="font-semibold">Upload Transactions CSV</label>
      <input
        id="file-input"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        disabled={uploading}
        className="p-2 border border-gray-300 rounded"
      />
      <div className="text-sm text-gray-600">
        {file ? `Selected: ${file.name}` : 'No file selected'}
      </div>
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {message && <div className="text-green-600 text-sm">{message}</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </div>
  );
}
