import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Monitor, Bell, Globe, Shield, Palette, Database, Save, RotateCcw } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useNotifications } from '../hooks/useNotifications';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AppSettings {
  notifications: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  mapStyle: 'dark' | 'light' | 'satellite' | 'terrain';
  language: string;
  timezone: string;
  dataRetention: number;
  soundEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  alertThreshold: 'low' | 'medium' | 'high';
  compactMode: boolean;
  showTooltips: boolean;
  animationsEnabled: boolean;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('general');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const [settings, setSettings] = useLocalStorage<AppSettings>('appSettings', {
    notifications: true,
    autoRefresh: true,
    refreshInterval: 5,
    mapStyle: 'dark',
    language: 'en',
    timezone: 'UTC',
    dataRetention: 30,
    soundEnabled: true,
    emailNotifications: true,
    pushNotifications: true,
    alertThreshold: 'medium',
    compactMode: false,
    showTooltips: true,
    animationsEnabled: true
  });

  const [tempSettings, setTempSettings] = useState(settings);

  const tabs = [
    { id: 'general', label: 'General', icon: Monitor },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'display', label: 'Display', icon: Palette },
    { id: 'data', label: 'Data & Privacy', icon: Database },
    { id: 'advanced', label: 'Advanced', icon: Settings }
  ];

  const updateTempSetting = (key: keyof AppSettings, value: any) => {
    setTempSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const saveSettings = () => {
    setSettings(tempSettings);
    setHasUnsavedChanges(false);
    addNotification({
      type: 'success',
      title: 'Settings Saved',
      message: 'Your preferences have been successfully updated.'
    });
  };

  const resetSettings = () => {
    setTempSettings(settings);
    setHasUnsavedChanges(false);
    addNotification({
      type: 'info',
      title: 'Changes Discarded',
      message: 'All unsaved changes have been reverted.'
    });
  };

  const resetToDefaults = () => {
    const defaultSettings: AppSettings = {
      notifications: true,
      autoRefresh: true,
      refreshInterval: 5,
      mapStyle: 'dark',
      language: 'en',
      timezone: 'UTC',
      dataRetention: 30,
      soundEnabled: true,
      emailNotifications: true,
      pushNotifications: true,
      alertThreshold: 'medium',
      compactMode: false,
      showTooltips: true,
      animationsEnabled: true
    };
    
    setTempSettings(defaultSettings);
    setHasUnsavedChanges(true);
    addNotification({
      type: 'warning',
      title: 'Reset to Defaults',
      message: 'Settings have been reset to default values. Click Save to apply.'
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
              <select
                value={tempSettings.language}
                onChange={(e) => updateTempSetting('language', e.target.value)}
                className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 focus:border-sky-400 focus:outline-none"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
              <select
                value={tempSettings.timezone}
                onChange={(e) => updateTempSetting('timezone', e.target.value)}
                className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 focus:border-sky-400 focus:outline-none"
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="EST">EST (Eastern Standard Time)</option>
                <option value="PST">PST (Pacific Standard Time)</option>
                <option value="GMT">GMT (Greenwich Mean Time)</option>
                <option value="CET">CET (Central European Time)</option>
                <option value="JST">JST (Japan Standard Time)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto Refresh Data</label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Automatically update dashboard data</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => updateTempSetting('autoRefresh', !tempSettings.autoRefresh)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  tempSettings.autoRefresh ? 'bg-sky-600' : 'bg-gray-400 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    tempSettings.autoRefresh ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </motion.button>
            </div>

            {tempSettings.autoRefresh && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Refresh Interval: {tempSettings.refreshInterval} seconds
                </label>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={tempSettings.refreshInterval}
                  onChange={(e) => updateTempSetting('refreshInterval', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>1s</span>
                  <span>30s</span>
                  <span>60s</span>
                </div>
              </motion.div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Tooltips</label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Display helpful tooltips throughout the interface</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => updateTempSetting('showTooltips', !tempSettings.showTooltips)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  tempSettings.showTooltips ? 'bg-sky-600' : 'bg-gray-400 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    tempSettings.showTooltips ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </motion.button>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Push Notifications</label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Receive browser notifications for alerts</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => updateTempSetting('pushNotifications', !tempSettings.pushNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  tempSettings.pushNotifications ? 'bg-sky-600' : 'bg-gray-400 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    tempSettings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </motion.button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications</label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Receive email alerts for critical events</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => updateTempSetting('emailNotifications', !tempSettings.emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  tempSettings.emailNotifications ? 'bg-sky-600' : 'bg-gray-400 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    tempSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </motion.button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sound Notifications</label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Play sound for important alerts</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => updateTempSetting('soundEnabled', !tempSettings.soundEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  tempSettings.soundEnabled ? 'bg-sky-600' : 'bg-gray-400 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    tempSettings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </motion.button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alert Threshold</label>
              <select
                value={tempSettings.alertThreshold}
                onChange={(e) => updateTempSetting('alertThreshold', e.target.value as 'low' | 'medium' | 'high')}
                className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 focus:border-sky-400 focus:outline-none"
              >
                <option value="low">Low - Show all notifications</option>
                <option value="medium">Medium - Important notifications only</option>
                <option value="high">High - Critical notifications only</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Controls which notifications are displayed</p>
            </div>
          </div>
        );
      
      case 'display':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Map Style</label>
              <select
                value={tempSettings.mapStyle}
                onChange={(e) => updateTempSetting('mapStyle', e.target.value as any)}
                className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 focus:border-sky-400 focus:outline-none"
              >
                <option value="dark">Dark Theme</option>
                <option value="light">Light Theme</option>
                <option value="satellite">Satellite View</option>
                <option value="terrain">Terrain View</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Compact Mode</label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Reduce spacing and padding for more content</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => updateTempSetting('compactMode', !tempSettings.compactMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  tempSettings.compactMode ? 'bg-sky-600' : 'bg-gray-400 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    tempSettings.compactMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </motion.button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Animations</label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Enable smooth transitions and animations</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => updateTempSetting('animationsEnabled', !tempSettings.animationsEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  tempSettings.animationsEnabled ? 'bg-sky-600' : 'bg-gray-400 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    tempSettings.animationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </motion.button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="text-blue-800 dark:text-blue-400 font-medium mb-2">Theme Settings</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Use the theme toggle button in the header to switch between light and dark modes. 
                Your preference will be automatically saved.
              </p>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Retention Period: {tempSettings.dataRetention} days
              </label>
              <input
                type="range"
                min="7"
                max="365"
                value={tempSettings.dataRetention}
                onChange={(e) => updateTempSetting('dataRetention', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>7 days</span>
                <span>6 months</span>
                <span>1 year</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">How long to keep historical data and logs</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <h4 className="text-gray-900 dark:text-white font-medium mb-3">Data Export</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Export your data for backup or migration purposes</p>
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Export All Data (JSON)
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Export Reports (CSV)
                </motion.button>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h4 className="text-red-700 dark:text-red-400 font-medium mb-3">Danger Zone</h4>
              <p className="text-sm text-red-600 dark:text-red-400 mb-4">These actions cannot be undone</p>
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Clear All Data
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Delete Account
                </motion.button>
              </div>
            </div>
          </div>
        );

      case 'advanced':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <h4 className="text-gray-900 dark:text-white font-medium mb-3">Performance</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hardware Acceleration</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Use GPU for better performance</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-sky-600"
                  >
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </motion.button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cache Size: 100 MB</label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    defaultValue="100"
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>50 MB</span>
                    <span>500 MB</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <h4 className="text-gray-900 dark:text-white font-medium mb-3">Developer Options</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Debug Mode</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Show additional debugging information</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-400 dark:bg-gray-600"
                  >
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                  </motion.button>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  View Console Logs
                </motion.button>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h4 className="text-yellow-700 dark:text-yellow-400 font-medium mb-3">Reset Settings</h4>
              <p className="text-sm text-yellow-600 dark:text-yellow-300 mb-4">Reset all settings to their default values</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetToDefaults}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors text-sm flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Defaults</span>
              </motion.button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Settings for {activeTab} coming soon...</p>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed top-16 right-4 w-[480px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-sky-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h3>
                {hasUnsavedChanges && (
                  <span className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs px-2 py-1 rounded-full">
                    Unsaved
                  </span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="flex">
              {/* Sidebar */}
              <div className="w-36 bg-gray-50 dark:bg-gray-900/50 border-r border-gray-200 dark:border-gray-700">
                <div className="p-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <motion.button
                        key={tab.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full p-3 rounded-lg mb-1 text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-sky-100 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/30'
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-1" />
                        <div className="text-xs font-medium">{tab.label}</div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 max-h-96 overflow-y-auto">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderTabContent()}
                </motion.div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={saveSettings}
                  disabled={!hasUnsavedChanges}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                    hasUnsavedChanges
                      ? 'bg-sky-600 hover:bg-sky-700 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </motion.button>
                {hasUnsavedChanges && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetSettings}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};