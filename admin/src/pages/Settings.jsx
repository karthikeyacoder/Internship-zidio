import React, { useState } from 'react'
import { Save, Database, Shield, Mail, Server } from 'lucide-react'
import toast from 'react-hot-toast'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(false)

  const tabs = [
    { id: 'general', label: 'General', icon: Server },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'email', label: 'Email', icon: Mail }
  ]

  const handleSave = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600">Configure system-wide settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-brown text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon size={18} />
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-brown/10 p-3 rounded-full">
                    <Server className="text-brown" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">General Settings</h2>
                    <p className="text-gray-600">Configure basic system settings</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Application Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Excel Analytics Platform"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max File Size (MB)
                    </label>
                    <input
                      type="number"
                      defaultValue="10"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      defaultValue="60"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Chart Type
                    </label>
                    <select className="input-field">
                      <option value="bar">Bar Chart</option>
                      <option value="line">Line Chart</option>
                      <option value="pie">Pie Chart</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maintenance Mode
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="maintenance"
                      className="h-4 w-4 text-brown focus:ring-brown border-gray-300 rounded"
                    />
                    <label htmlFor="maintenance" className="text-sm text-gray-700">
                      Enable maintenance mode (prevents user access)
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-brown/10 p-3 rounded-full">
                    <Shield className="text-brown" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
                    <p className="text-gray-600">Configure security and authentication</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      JWT Secret Key
                    </label>
                    <input
                      type="password"
                      defaultValue="your-secret-key"
                      className="input-field"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Change this key to invalidate all existing sessions
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Token Expiration (days)
                    </label>
                    <input
                      type="number"
                      defaultValue="7"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rate Limit (requests per 15 minutes)
                    </label>
                    <input
                      type="number"
                      defaultValue="100"
                      className="input-field"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="require2fa"
                        className="h-4 w-4 text-brown focus:ring-brown border-gray-300 rounded"
                      />
                      <label htmlFor="require2fa" className="text-sm text-gray-700">
                        Require two-factor authentication for admin accounts
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="logFailedAttempts"
                        defaultChecked
                        className="h-4 w-4 text-brown focus:ring-brown border-gray-300 rounded"
                      />
                      <label htmlFor="logFailedAttempts" className="text-sm text-gray-700">
                        Log failed login attempts
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="emailAlerts"
                        defaultChecked
                        className="h-4 w-4 text-brown focus:ring-brown border-gray-300 rounded"
                      />
                      <label htmlFor="emailAlerts" className="text-sm text-gray-700">
                        Send email alerts for security events
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'database' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-brown/10 p-3 rounded-full">
                    <Database className="text-brown" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Database Settings</h2>
                    <p className="text-gray-600">Configure database connection and backup</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      MongoDB Connection String
                    </label>
                    <input
                      type="text"
                      defaultValue="mongodb://localhost:27017/excel-analytics"
                      className="input-field"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Connection Pool Size
                      </label>
                      <input
                        type="number"
                        defaultValue="10"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Query Timeout (seconds)
                      </label>
                      <input
                        type="number"
                        defaultValue="30"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Backup Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="autoBackup"
                          defaultChecked
                          className="h-4 w-4 text-brown focus:ring-brown border-gray-300 rounded"
                        />
                        <label htmlFor="autoBackup" className="text-sm text-gray-700">
                          Enable automatic backups
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Backup Frequency
                        </label>
                        <select className="input-field">
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Retention Period (days)
                        </label>
                        <input
                          type="number"
                          defaultValue="30"
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-brown/10 p-3 rounded-full">
                    <Mail className="text-brown" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Email Settings</h2>
                    <p className="text-gray-600">Configure email notifications and SMTP</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        placeholder="smtp.gmail.com"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SMTP Port
                      </label>
                      <input
                        type="number"
                        defaultValue="587"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="email"
                        placeholder="your-email@gmail.com"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="App password"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="noreply@yourapp.com"
                      className="input-field"
                    />
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Notification Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="welcomeEmail"
                          defaultChecked
                          className="h-4 w-4 text-brown focus:ring-brown border-gray-300 rounded"
                        />
                        <label htmlFor="welcomeEmail" className="text-sm text-gray-700">
                          Send welcome email to new users
                        </label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="securityAlerts"
                          defaultChecked
                          className="h-4 w-4 text-brown focus:ring-brown border-gray-300 rounded"
                        />
                        <label htmlFor="securityAlerts" className="text-sm text-gray-700">
                          Send security alerts to admins
                        </label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="systemAlerts"
                          defaultChecked
                          className="h-4 w-4 text-brown focus:ring-brown border-gray-300 rounded"
                        />
                        <label htmlFor="systemAlerts" className="text-sm text-gray-700">
                          Send system maintenance notifications
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center space-x-2 btn-primary disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save size={16} />
                )}
                <span>{loading ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings