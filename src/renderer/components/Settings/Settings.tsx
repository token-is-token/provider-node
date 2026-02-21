import { useState, useEffect } from 'react';
import { useAppStore } from '../stores/appStore';

export function Settings() {
  const { config, updateConfig, isLoading } = useAppStore();
  const [localConfig, setLocalConfig] = useState(config);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleSave = async () => {
    try {
      await updateConfig(localConfig);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save config', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-6">LLM Configuration</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Provider
            </label>
            <select
              value={localConfig.llm.provider}
              onChange={(e) =>
                setLocalConfig({
                  ...localConfig,
                  llm: { ...localConfig.llm, provider: e.target.value as any },
                })
              }
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="anthropic">Anthropic</option>
              <option value="openai">OpenAI</option>
              <option value="seedance">Seedance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              API Key
            </label>
            <input
              type="password"
              value={localConfig.llm.apiKey}
              onChange={(e) =>
                setLocalConfig({
                  ...localConfig,
                  llm: { ...localConfig.llm, apiKey: e.target.value },
                })
              }
              placeholder="sk-..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Max Quota (tokens/month)
            </label>
            <input
              type="number"
              value={localConfig.llm.maxQuota}
              onChange={(e) =>
                setLocalConfig({
                  ...localConfig,
                  llm: { ...localConfig.llm, maxQuota: parseInt(e.target.value) },
                })
              }
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-6">P2P Configuration</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Bootstrap Nodes (one per line)
            </label>
            <textarea
              value={localConfig.p2p.bootstrapNodes.join('\n')}
              onChange={(e) =>
                setLocalConfig({
                  ...localConfig,
                  p2p: {
                    ...localConfig.p2p,
                    bootstrapNodes: e.target.value.split('\n').filter(Boolean),
                  },
                })
              }
              placeholder="/ip4/..."
              rows={4}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="relayEnabled"
              checked={localConfig.p2p.relayEnabled}
              onChange={(e) =>
                setLocalConfig({
                  ...localConfig,
                  p2p: { ...localConfig.p2p, relayEnabled: e.target.checked },
                })
              }
              className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
            />
            <label htmlFor="relayEnabled" className="ml-2 text-sm font-medium text-gray-400">
              Enable Relay
            </label>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-6">Proxy Configuration</h2>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="proxyEnabled"
              checked={localConfig.proxy.enabled}
              onChange={(e) =>
                setLocalConfig({
                  ...localConfig,
                  proxy: { ...localConfig.proxy, enabled: e.target.checked }
                })
              }
              className="w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
            />
            <label htmlFor="proxyEnabled" className="ml-2 text-sm font-medium text-gray-400">
              Enable Proxy Server
            </label>
          </div>

          {localConfig.proxy.enabled && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Port
              </label>
              <input
                type="number"
                value={localConfig.proxy.port}
                onChange={(e) =>
                  setLocalConfig({
                    ...localConfig,
                    proxy: { ...localConfig.proxy, port: parseInt(e.target.value) },
                  })
                }
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4">
        {saved && (
          <span className="text-green-400 text-sm">Settings saved successfully!</span>
        )}
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
        >
          {isLoading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
