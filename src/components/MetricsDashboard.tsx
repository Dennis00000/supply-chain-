import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Clock, Truck, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export const MetricsDashboard: React.FC = () => {
  const metrics = [
    {
      title: 'Total Supply Chain Value',
      value: '$2.4M',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-400'
    },
    {
      title: 'Average Delivery Time',
      value: '3.2 days',
      change: '-8.3%',
      trend: 'down',
      icon: Clock,
      color: 'text-blue-400'
    },
    {
      title: 'Active Shipments',
      value: '147',
      change: '+5.2%',
      trend: 'up',
      icon: Truck,
      color: 'text-sky-400'
    },
    {
      title: 'Critical Alerts',
      value: '8',
      change: '-15.7%',
      trend: 'down',
      icon: AlertCircle,
      color: 'text-red-400'
    }
  ];

  const performanceData = [
    { name: 'Jan', efficiency: 85, cost: 120000, onTime: 92 },
    { name: 'Feb', efficiency: 88, cost: 115000, onTime: 94 },
    { name: 'Mar', efficiency: 92, cost: 108000, onTime: 96 },
    { name: 'Apr', efficiency: 89, cost: 112000, onTime: 93 },
    { name: 'May', efficiency: 94, cost: 105000, onTime: 97 },
    { name: 'Jun', efficiency: 96, cost: 102000, onTime: 98 }
  ];

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? TrendingUp : TrendingDown;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const TrendIcon = getTrendIcon(metric.trend);
          
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-3 sm:p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${metric.color}`} />
                <div className={`flex items-center space-x-1 text-xs sm:text-sm ${
                  metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  <TrendIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{metric.change}</span>
                </div>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-xs sm:text-sm text-gray-400 leading-tight">{metric.title}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Efficiency Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-3 sm:p-4"
        >
          <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Supply Chain Efficiency</h3>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} />
              <YAxis stroke="#9CA3AF" fontSize={10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB',
                  fontSize: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="efficiency"
                stroke="#0EA5E9"
                fillOpacity={1}
                fill="url(#efficiencyGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Cost Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-3 sm:p-4"
        >
          <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Cost Optimization</h3>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} />
              <YAxis stroke="#9CA3AF" fontSize={10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB',
                  fontSize: '12px'
                }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Cost']}
              />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 4, stroke: '#10B981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* On-Time Delivery Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-3 sm:p-4"
      >
        <h3 className="text-base sm:text-lg font-semibold text-white mb-4">On-Time Delivery Performance</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={performanceData}>
            <defs>
              <linearGradient id="deliveryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} />
            <YAxis domain={[85, 100]} stroke="#9CA3AF" fontSize={10} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB',
                fontSize: '12px'
              }}
              formatter={(value) => [`${value}%`, 'On-Time Delivery']}
            />
            <Area
              type="monotone"
              dataKey="onTime"
              stroke="#10B981"
              fillOpacity={1}
              fill="url(#deliveryGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};