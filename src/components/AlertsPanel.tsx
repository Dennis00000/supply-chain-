import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, Clock, X } from 'lucide-react';
import { Alert } from '../types/supply-chain';

interface AlertsPanelProps {
  alerts: Alert[];
  onResolveAlert: (alertId: string) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onResolveAlert }) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />;
      default: return <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />;
    }
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-500/50 bg-red-900/20';
      case 'warning': return 'border-yellow-500/50 bg-yellow-900/20';
      default: return 'border-blue-500/50 bg-blue-900/20';
    }
  };

  const unresolvedAlerts = alerts.filter(alert => !alert.resolved);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700"
    >
      <div className="p-3 sm:p-4 border-b border-gray-700">
        <h3 className="text-base sm:text-lg font-semibold text-white flex items-center">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-400" />
          System Alerts
          {unresolvedAlerts.length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unresolvedAlerts.length}
            </span>
          )}
        </h3>
        <p className="text-xs sm:text-sm text-gray-400">ML-powered anomaly detection and notifications</p>
      </div>

      <div className="p-3 sm:p-4 max-h-80 sm:max-h-96 overflow-y-auto">
        <AnimatePresence>
          {unresolvedAlerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6 sm:py-8"
            >
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-400 mx-auto mb-2" />
              <p className="text-gray-400">All systems operating normally</p>
            </motion.div>
          ) : (
            unresolvedAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className={`mb-3 p-3 sm:p-4 rounded-lg border ${getAlertStyles(alert.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium mb-1 text-sm sm:text-base leading-tight">{alert.message}</p>
                      <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-400">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                        {alert.location && (
                          <>
                            <span>•</span>
                            <span className="truncate">{alert.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onResolveAlert(alert.id)}
                    className="text-gray-400 hover:text-white transition-colors ml-2 p-1"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};