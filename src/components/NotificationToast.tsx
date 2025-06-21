import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, X, XCircle } from 'lucide-react';
import { Notification } from '../hooks/useNotifications';

interface NotificationToastProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notifications, onRemove }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />;
      case 'error': return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />;
      default: return <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-900/90 border-green-500/50';
      case 'error': return 'bg-red-900/90 border-red-500/50';
      case 'warning': return 'bg-yellow-900/90 border-yellow-500/50';
      default: return 'bg-blue-900/90 border-blue-500/50';
    }
  };

  return (
    <div className="fixed top-20 right-2 sm:right-4 z-50 space-y-2 max-w-[calc(100vw-16px)] sm:max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className={`p-3 sm:p-4 rounded-lg border backdrop-blur-sm ${getStyles(notification.type)}`}
          >
            <div className="flex items-start space-x-2 sm:space-x-3">
              {getIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white leading-tight">{notification.title}</h4>
                <p className="text-xs sm:text-sm text-gray-300 mt-1 leading-tight">{notification.message}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onRemove(notification.id)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};