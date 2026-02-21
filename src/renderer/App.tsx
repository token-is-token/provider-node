import { useState } from 'react';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Settings } from './components/Settings/Settings';
import { Earnings } from './components/Earnings/Earnings';

type Tab = 'dashboard' | 'settings' | 'earnings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-primary-400">Provider Node</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Settings
              </button>
              <button
                onClick={() => setActiveTab('earnings')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'earnings'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Earnings
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'settings' && <Settings />}
        {activeTab === 'earnings' && <Earnings />}
      </main>
    </div>
  );
}
