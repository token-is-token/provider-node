import { useState } from 'react';
import { useAppStore } from '../stores/appStore';

interface Transaction {
  id: string;
  type: 'stake' | 'claim' | 'earning';
  amount: string;
  timestamp: Date;
  status: 'pending' | 'confirmed';
}

export function Earnings() {
  const { stats, isLoading } = useAppStore();
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'earning',
      amount: '10.5',
      timestamp: new Date(Date.now() - 86400000),
      status: 'confirmed',
    },
    {
      id: '2',
      type: 'earning',
      amount: '15.2',
      timestamp: new Date(Date.now() - 172800000),
      status: 'confirmed',
    },
    {
      id: '3',
      type: 'claim',
      amount: '25.7',
      timestamp: new Date(Date.now() - 259200000),
      status: 'confirmed',
    },
  ]);

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const handleWithdraw = () => {
    setShowWithdrawModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium">Total Earnings</h3>
          <p className="mt-2 text-3xl font-bold text-green-400">
            {stats.totalEarnings} SHARE
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium">Pending</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-400">0 SHARE</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium">Available</h3>
          <p className="mt-2 text-3xl font-bold">{stats.totalEarnings} SHARE</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Transaction History</h2>
          <button
            onClick={handleWithdraw}
            disabled={isLoading || parseFloat(stats.totalEarnings) === 0}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            Withdraw
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-700/50">
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        tx.type === 'earning'
                          ? 'bg-green-900 text-green-400'
                          : tx.type === 'claim'
                          ? 'bg-blue-900 text-blue-400'
                          : 'bg-purple-900 text-purple-400'
                      }`}
                    >
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium">
                    {tx.type === 'earning' ? '+' : '-'}
                    {tx.amount} SHARE
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {tx.timestamp.toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        tx.status === 'confirmed'
                          ? 'bg-green-900 text-green-400'
                          : 'bg-yellow-900 text-yellow-400'
                      }`}
                    >
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {transactions.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No transactions yet
          </div>
        )}
      </div>
    </div>
  );
}
