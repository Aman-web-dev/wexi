




const Settings = () => {
  const [config, setConfig] = useState({
    autoCloseEnabled: true,
    confidenceThreshold: 0.78,
    slaHours: 24
  });

  const handleSave = () => {
    // Save config logic
    console.log('Saving config:', config);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Configure AI agent behavior and system preferences</p>
      </div>

      <div className="space-y-6">
        {/* AI Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Agent Configuration</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Auto-close tickets</h3>
                <p className="text-sm text-gray-600">Automatically resolve high-confidence tickets</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.autoCloseEnabled}
                  onChange={(e) => setConfig({ ...config, autoCloseEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confidence Threshold ({config.confidenceThreshold})
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={config.confidenceThreshold}
                onChange={(e) => setConfig({ ...config, confidenceThreshold: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low (0.0)</span>
                <span>High (1.0)</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Tickets with confidence above this threshold will be auto-resolved if auto-close is enabled
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SLA Hours
              </label>
              <input
                type="number"
                value={config.slaHours}
                onChange={(e) => setConfig({ ...config, slaHours: parseInt(e.target.value) })}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <p className="text-sm text-gray-600 mt-2">
                Service level agreement for ticket response time
              </p>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email notifications</h3>
                <p className="text-sm text-gray-600">Receive email updates for ticket status changes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">In-app notifications</h3>
                <p className="text-sm text-gray-600">Show notifications within the application</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Version</h3>
              <p className="text-sm text-gray-900 mt-1">v1.0.0</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Environment</h3>
              <p className="text-sm text-gray-900 mt-1">Development</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">AI Model</h3>
              <p className="text-sm text-gray-900 mt-1">GPT-4 (Stub Mode)</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Last Updated</h3>
              <p className="text-sm text-gray-900 mt-1">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};


export default Settings;