import React, { useState } from 'react';
import { Bell, Users, Settings, Activity, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types/supply-chain';
import { NotificationPanel } from './NotificationPanel';
import { SettingsPanel } from './SettingsPanel';
import { UserMenu } from './UserMenu';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  activeUsers: User[];
  alertCount: number;
  isConnected: boolean;
  alerts: any[];
  onResolveAlert: (alertId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeUsers, 
  alertCount, 
  isConnected, 
  alerts,
  onResolveAlert 
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const currentUser: User = {
    id: 'current-user',
    name: 'Supply Chain Manager',
    avatar: '👨‍💼',
    color: '#0EA5E9',
    active: true
  };

  const handleMarkAsRead = (alertId: string) => {
    onResolveAlert(alertId);
  };

  const handleMarkAllAsRead = () => {
    alerts.filter(alert => !alert.resolved).forEach(alert => {
      onResolveAlert(alert.id);
    });
  };

  const closeAllPanels = () => {
    setShowNotifications(false);
    setShowSettings(false);
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  return (
    <>
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 relative z-30 transition-colors duration-300"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-sky-500 dark:text-sky-400" />
              <h1 className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                Supply Chain Operations Center
              </h1>
              <h1 className="text-sm font-bold text-gray-900 dark:text-white sm:hidden">
                SCOC
              </h1>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <motion.div 
                animate={{ 
                  scale: isConnected ? [1, 1.2, 1] : 1,
                  opacity: isConnected ? 1 : 0.6
                }}
                transition={{ 
                  duration: 2, 
                  repeat: isConnected ? Infinity : 0,
                  repeatType: "reverse"
                }}
                className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} 
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {isConnected ? 'Live Data Stream' : 'Connection Lost'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle size="sm" />

            {/* Active Users */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => {
                closeAllPanels();
                setShowUserMenu(true);
              }}
            >
              <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div className="flex -space-x-2">
                {activeUsers.filter(user => user.active).slice(0, 3).map(user => (
                  <motion.div
                    key={user.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 flex items-center justify-center text-sm font-medium text-white border-2 border-white dark:border-gray-900 cursor-pointer"
                    title={user.name}
                  >
                    {user.avatar}
                  </motion.div>
                ))}
                {activeUsers.filter(user => user.active).length > 3 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-medium text-white border-2 border-white dark:border-gray-900"
                  >
                    +{activeUsers.filter(user => user.active).length - 3}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Alerts */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                closeAllPanels();
                setShowNotifications(true);
              }}
              className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
            >
              <Bell className="w-6 h-6" />
              {alertCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {alertCount > 9 ? '9+' : alertCount}
                </motion.span>
              )}
            </motion.button>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                closeAllPanels();
                setShowSettings(true);
              }}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
            >
              <Settings className="w-6 h-6" />
            </motion.button>

            {/* User Avatar */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                closeAllPanels();
                setShowUserMenu(true);
              }}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 flex items-center justify-center text-lg font-bold text-white border-2 border-gray-200 dark:border-gray-700 hover:border-sky-400 transition-colors"
            >
              {currentUser.avatar}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center space-x-2">
            {/* Mobile Theme Toggle */}
            <ThemeToggle size="sm" />
            
            {/* Mobile Alert Badge */}
            {alertCount > 0 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  closeAllPanels();
                  setShowNotifications(true);
                }}
                className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
              >
                <Bell className="w-5 h-5" />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                >
                  {alertCount > 9 ? '9+' : alertCount}
                </motion.span>
              </motion.button>
            )}
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="space-y-3">
                {/* Connection Status */}
                <div className="flex items-center space-x-2 px-2">
                  <motion.div 
                    animate={{ 
                      scale: isConnected ? [1, 1.2, 1] : 1,
                      opacity: isConnected ? 1 : 0.6
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: isConnected ? Infinity : 0,
                      repeatType: "reverse"
                    }}
                    className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} 
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {isConnected ? 'Live Data Stream' : 'Connection Lost'}
                  </span>
                </div>

                {/* Active Users */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    closeAllPanels();
                    setShowUserMenu(true);
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700/30 hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-white">Team Members</span>
                  <div className="flex -space-x-1 ml-auto">
                    {activeUsers.filter(user => user.active).slice(0, 3).map(user => (
                      <div
                        key={user.id}
                        className="w-6 h-6 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 flex items-center justify-center text-xs font-medium text-white border border-white dark:border-gray-900"
                      >
                        {user.avatar}
                      </div>
                    ))}
                  </div>
                </motion.button>

                {/* Settings */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    closeAllPanels();
                    setShowSettings(true);
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700/30 hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-white">Settings</span>
                </motion.button>

                {/* Profile */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    closeAllPanels();
                    setShowUserMenu(true);
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700/30 hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 flex items-center justify-center text-sm font-bold text-white">
                    {currentUser.avatar}
                  </div>
                  <div className="text-left">
                    <div className="text-gray-900 dark:text-white font-medium">{currentUser.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Administrator</div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Panels */}
      <NotificationPanel
        alerts={alerts}
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <UserMenu
        user={currentUser}
        activeUsers={activeUsers}
        isOpen={showUserMenu}
        onClose={() => setShowUserMenu(false)}
        onOpenSettings={() => {
          setShowUserMenu(false);
          setShowSettings(true);
        }}
      />
    </>
  );
};