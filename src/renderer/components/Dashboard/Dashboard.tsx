import { useEffect, useState } from 'react';
import { useAppStore } from '../stores/appStore';

export function Dashboard() {
  const { nodeStatus, stats, startNode, stopNode, isLoading } = useAppStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const statusColors = {
    stopped: 'bg-gray-500',
    starting: 'bg-yellow-500',
    running: 'bg-green-500',
    error: 'bg-red-500',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium">Status</h3>
          <div className="mt-2 flex items-center space-x-2">
            <span
              className={`w-3 h-3 rounded-full ${
                statusColors[nodeStatus.status]
              }`}
            ></span>
            <span className="text-2xl font-bold capitalize">
              {nodeStatus.status}
            </span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium">Uptime</h3>
          <p className="mt-2 text-2xl font-bold">
            {formatUptime(nodeStatus.uptime ?? 0)}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium">Connected Peers</h3>
          <p className="mt-2 text-2xl font-bold">{nodeStatus.peers}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium">Requests</h3>
          <p className="mt-2 text-2xl font-bold">
            {stats.totalRequests.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {nodeStatus.status === 'stopped' ? (
              <button
                onClick={startNode}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                {isLoading ? 'Starting...' : 'Start Node'}
              </button>
            ) : (
              <button
                onClick={stopNode}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                {isLoading ? 'Stopping...' : 'Stop Node'}
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Tokens</span>
              <span className="font-medium">
                {stats.totalTokens.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Earnings</span>
              <span className="font-medium">{stats.totalEarnings} SHARE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Node Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Last Updated</span>
            <p className="font-medium">{currentTime.toLocaleTimeString()}</p>
          </div>
          {nodeStatus.lastError && (
            <div className="col-span-2">
              <span className="text-gray-400">Error</span>
              <p className="font-medium text-red-400">{nodeStatus.lastError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
