import React from 'react';
import { motion } from 'framer-motion';
import { Package, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { InventoryItem } from '../types/supply-chain';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface InventoryDashboardProps {
  inventory: InventoryItem[];
}

export const InventoryDashboard: React.FC<InventoryDashboardProps> = ({ inventory }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />;
      default: return <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />;
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    const percentage = (item.currentStock / item.maxCapacity) * 100;
    if (item.currentStock <= item.minThreshold) return 'critical';
    if (percentage < 25) return 'low';
    if (percentage > 75) return 'high';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return '#EF4444';
      case 'low': return '#F59E0B';
      case 'high': return '#10B981';
      default: return '#0EA5E9';
    }
  };

  const chartData = inventory.map(item => ({
    name: item.name.split(' ')[0],
    current: item.currentStock,
    minimum: item.minThreshold,
    capacity: item.maxCapacity,
    status: getStockStatus(item)
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300"
    >
      <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-sky-500" />
              Inventory Management
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Real-time stock levels and alerts</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                {inventory.filter(item => getStockStatus(item) === 'critical').length}
              </div>
              <div className="text-xs text-red-500">Critical Items</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        {/* Chart */}
        <div className="mb-4 sm:mb-6">
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-300 dark:text-gray-600" />
              <XAxis dataKey="name" stroke="currentColor" className="text-gray-600 dark:text-gray-400" fontSize={10} />
              <YAxis stroke="currentColor" className="text-gray-600 dark:text-gray-400" fontSize={10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--tooltip-bg)',
                  border: '1px solid var(--tooltip-border)',
                  borderRadius: '8px',
                  color: 'var(--tooltip-text)',
                  fontSize: '12px'
                }}
                labelStyle={{ color: 'var(--tooltip-text)' }}
              />
              <Bar dataKey="current" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Items */}
        <div className="space-y-3">
          {inventory.map((item, index) => {
            const status = getStockStatus(item);
            const percentage = (item.currentStock / item.maxCapacity) * 100;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 sm:p-4 transition-colors duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{item.name}</h4>
                    {status === 'critical' && (
                      <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                    )}
                    {getTrendIcon(item.trend)}
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base">{item.currentStock.toLocaleString()}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{item.location}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Min: {item.minThreshold.toLocaleString()}</span>
                  <span>Max: {item.maxCapacity.toLocaleString()}</span>
                </div>
                
                <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: getStatusColor(status) }}
                  />
                </div>
                
                <div className="flex justify-between items-center mt-2 text-xs">
                  <span className="text-gray-600 dark:text-gray-400">
                    Updated: {new Date(item.lastUpdated).toLocaleTimeString()}
                  </span>
                  <span className={`px-2 py-1 rounded-full font-medium ${
                    status === 'critical' ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400' :
                    status === 'low' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400' :
                    status === 'high' ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' :
                    'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                  }`}>
                    {status.toUpperCase()}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};