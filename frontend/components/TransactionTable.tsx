'use client';

import { useEffect, useState } from 'react';

// this is what a transaction object should look like
interface Transaction {
  id: number;
  acc_id: number;
  amount: number;
  purpose: string;
  date: null;
  counterparty: string;
  account?: number;
}

// this is the react component
export default function TransactionTable() {

  // state variables (the components memory)
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [duplicateIds, setDuplicateIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // runs code when component loads
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:8000/transactions');
      // const response = await fetch('/transactions')
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();

      setTransactions(data.transactions as Transaction[]);

      console.log(data)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const highlightDuplicates = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:8000/getduplicates');
      if (!response.ok) throw new Error('Failed to get duplicates');
      const data = await response.json();

      const dupIds = new Set<number>(data.duplicates.map((tx: Transaction) => tx.id));
      setDuplicateIds(dupIds);
    }
    catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to highlight duplicates');
    } finally {
      setLoading(false);
    }
  }

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
            <th className="border border-gray-300 px-4 py-2 text-white font-semibold text-left">Counterparty</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <tr
                key={tx.id}
                className={`hover:bg-gray-100 ${duplicateIds.has(tx.id) ? 'bg-red-100' : ''}`}
              >
                <td className="border border-gray-300 px-4 py-2">{tx.id}</td>
                <td className="border border-gray-300 px-4 py-2">{tx.acc_id || tx.account || '-'}</td>
                <td className="border border-gray-300 px-4 py-2">${tx.amount}</td>
                <td className="border border-gray-300 px-4 py-2">{tx.purpose}</td>
                <td className="border border-gray-300 px-4 py-2">{tx.counterparty}</td>
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
      <hr></hr>
      <br></br>
      <button
        onClick={highlightDuplicates}
        // disabled={!file || uploading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        Highlight Duplicates
        {/*{uploading ? 'Uploading...' : 'Upload'}*/}
      </button>
    </div>
  );
}
