import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings, HelpCircle, UserCircle, Shield } from 'lucide-react';
import { User as UserType } from '../types/supply-chain';
import { ProfilePage } from './ProfilePage';
import { SecurityPage } from './SecurityPage';
import { HelpSupportPage } from './HelpSupportPage';
import { SignOutModal } from './SignOutModal';

interface UserMenuProps {
  user: UserType;
  activeUsers: UserType[];
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  user,
  activeUsers,
  isOpen,
  onClose,
  onOpenSettings
}) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);

  const handleSignOut = () => {
    console.log('User signed out');
    // Implement actual sign out logic here
    setShowSignOut(false);
    onClose();
  };

  const menuItems = [
    { 
      icon: UserCircle, 
      label: 'Profile', 
      action: () => {
        onClose();
        setShowProfile(true);
      }
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      action: () => {
        onClose();
        onOpenSettings();
      }
    },
    { 
      icon: Shield, 
      label: 'Security', 
      action: () => {
        onClose();
        setShowSecurity(true);
      }
    },
    { 
      icon: HelpCircle, 
      label: 'Help & Support', 
      action: () => {
        onClose();
        setShowHelp(true);
      }
    },
    { 
      icon: LogOut, 
      label: 'Sign Out', 
      action: () => {
        onClose();
        setShowSignOut(true);
      }, 
      danger: true 
    }
  ];

  return (
    <>
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
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="absolute top-16 right-4 w-72 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              {/* User Info */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-lg font-bold text-white">
                    {user.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{user.name}</h3>
                    <p className="text-sm text-gray-400">Administrator</p>
                  </div>
                </div>
              </div>

              {/* Active Users */}
              <div className="p-4 border-b border-gray-700">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Active Team Members</h4>
                <div className="space-y-2">
                  {activeUsers.filter(u => u.active && u.id !== user.id).map(activeUser => (
                    <div key={activeUser.id} className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-sm font-medium text-white">
                          {activeUser.avatar}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800"></div>
                      </div>
                      <div>
                        <p className="text-sm text-white">{activeUser.name}</p>
                        <p className="text-xs text-gray-400">Online</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.label}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={item.action}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        item.danger
                          ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-700 bg-gray-900/30">
                <div className="text-xs text-gray-400 text-center">
                  Supply Chain Operations v2.1.0
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Pages */}
      <AnimatePresence>
        {showProfile && <ProfilePage onClose={() => setShowProfile(false)} />}
        {showSecurity && <SecurityPage onClose={() => setShowSecurity(false)} />}
        {showHelp && <HelpSupportPage onClose={() => setShowHelp(false)} />}
      </AnimatePresence>

      {/* Sign Out Modal */}
      <SignOutModal
        isOpen={showSignOut}
        onClose={() => setShowSignOut(false)}
        onConfirm={handleSignOut}
      />
    </>
  );
};