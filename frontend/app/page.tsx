'use client';

import { useEffect, useState } from 'react';
import FileUpload from '@/components/FileUpload';
import TransactionTable from '@/components/TransactionTable';

export default function Home() {

  // state data (when changed would cause the page to rerender)
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      setRefreshKey(prev => prev + 1);
    };
    window.addEventListener('transactionsUpdated', handleUpdate);
    return () => window.removeEventListener('transactionsUpdated', handleUpdate);
  }, []);

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Transactions Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Upload Transactions</h2>
            <FileUpload />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Transactions List</h2>
            <TransactionTable key={refreshKey} />
          </div>
        </div>
      </div>
    </main>
  );
}
