import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { SupplyChainMap } from './components/SupplyChainMap';
import { InventoryDashboard } from './components/InventoryDashboard';
import { AlertsPanel } from './components/AlertsPanel';
import { ScenarioWorkspace } from './components/ScenarioWorkspace';
import { MetricsDashboard } from './components/MetricsDashboard';
import { NotificationToast } from './components/NotificationToast';
import { useRealTimeData } from './hooks/useRealTimeData';
import { useCollaboration } from './hooks/useCollaboration';
import { useNotifications } from './hooks/useNotifications';

function AppContent() {
  const { shipments, inventory, alerts, isConnected } = useRealTimeData();
  const { activeUsers, scenarios, currentUser, createScenario } = useCollaboration();
  const { notifications, removeNotification } = useNotifications();
  const [resolvedAlerts, setResolvedAlerts] = useState<string[]>([]);

  const handleResolveAlert = (alertId: string) => {
    setResolvedAlerts(prev => [...prev, alertId]);
  };

  const filteredAlerts = alerts.map(alert => ({
    ...alert,
    resolved: resolvedAlerts.includes(alert.id)
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Header 
        activeUsers={activeUsers} 
        alertCount={filteredAlerts.filter(a => !a.resolved).length}
        isConnected={isConnected}
        alerts={filteredAlerts}
        onResolveAlert={handleResolveAlert}
      />
      
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6"
        >
          {/* Mobile: Stack all components vertically */}
          {/* Desktop: Left Column - Map and Metrics */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            <SupplyChainMap shipments={shipments} />
            <MetricsDashboard />
          </div>

          {/* Mobile: Continue stacking */}
          {/* Desktop: Right Column - Panels */}
          <div className="space-y-4 sm:space-y-6">
            <InventoryDashboard inventory={inventory} />
            <AlertsPanel alerts={filteredAlerts} onResolveAlert={handleResolveAlert} />
            <ScenarioWorkspace 
              scenarios={scenarios}
              activeUsers={activeUsers}
              onCreateScenario={createScenario}
            />
          </div>
        </motion.div>
      </main>

      {/* Collaborative cursors - Hidden on mobile */}
      <div className="hidden lg:block">
        {activeUsers.filter(user => user.active && user.cursor).map(user => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: 'fixed',
              left: `${user.cursor!.x}%`,
              top: `${user.cursor!.y}%`,
              pointerEvents: 'none',
              zIndex: 1000
            }}
            className="flex items-center space-x-2"
          >
            <div 
              className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"
              style={{ backgroundColor: user.color }}
            />
            <div 
              className="bg-black/80 dark:bg-white/90 text-white dark:text-black text-xs px-2 py-1 rounded-md"
              style={{ borderColor: user.color }}
            >
              {user.name}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Notification Toasts */}
      <NotificationToast
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;