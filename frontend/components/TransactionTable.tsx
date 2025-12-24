'use client';

import { useEffect, useState } from 'react';

interface Transaction {
  id: number;
  acc_id?: string;
  account?: number;
  amount: number;
  purpose: string;
}

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:8000/transactions');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      
      // Convert object to array if needed
      const transactionsArray = Array.isArray(data) 
        ? data 
        : Object.values(data);
      setTransactions(transactionsArray as Transaction[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-600">
            <th className="border border-gray-300 px-4 py-2 text-white font-semibold text-left">ID</th>
            <th className="border border-gray-300 px-4 py-2 text-white font-semibold text-left">Account ID</th>
            <th className="border border-gray-300 px-4 py-2 text-white font-semibold text-left">Amount</th>
            <th className="border border-gray-300 px-4 py-2 text-white font-semibold text-left">Purpose</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{tx.id}</td>
                <td className="border border-gray-300 px-4 py-2">{tx.acc_id || tx.account || '-'}</td>
                <td className="border border-gray-300 px-4 py-2">${tx.amount}</td>
                <td className="border border-gray-300 px-4 py-2">{tx.purpose}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {error && <div className="text-red-600 mt-4">{error}</div>}
      <button
        onClick={fetchTransactions}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Refresh
      </button>
    </div>
  );
}
