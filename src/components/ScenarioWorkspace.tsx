import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Users, TrendingUp, DollarSign, Clock, Plus, Brain } from 'lucide-react';
import { Scenario, User } from '../types/supply-chain';

interface ScenarioWorkspaceProps {
  scenarios: Scenario[];
  activeUsers: User[];
  onCreateScenario: (name: string, description: string) => Scenario;
}

export const ScenarioWorkspace: React.FC<ScenarioWorkspaceProps> = ({ 
  scenarios, 
  activeUsers, 
  onCreateScenario 
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newScenarioName, setNewScenarioName] = useState('');
  const [newScenarioDescription, setNewScenarioDescription] = useState('');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  const handleCreateScenario = () => {
    if (newScenarioName.trim() && newScenarioDescription.trim()) {
      onCreateScenario(newScenarioName, newScenarioDescription);
      setNewScenarioName('');
      setNewScenarioDescription('');
      setShowCreateForm(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      default: return 'text-green-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700"
    >
      <div className="p-3 sm:p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white flex items-center">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" />
              What-If Scenario Workspace
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">Collaborative planning and simulation</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">New Scenario</span>
            <span className="sm:hidden">New</span>
          </motion.button>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 sm:p-4 bg-gray-700/30 rounded-lg border border-gray-600"
            >
              <h4 className="text-white font-medium mb-3 text-sm sm:text-base">Create New Scenario</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Scenario name"
                  value={newScenarioName}
                  onChange={(e) => setNewScenarioName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-sky-400 focus:outline-none text-sm"
                />
                <textarea
                  placeholder="Description"
                  value={newScenarioDescription}
                  onChange={(e) => setNewScenarioDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-sky-400 focus:outline-none h-16 sm:h-20 resize-none text-sm"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleCreateScenario}
                    className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {scenarios.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedScenario(selectedScenario?.id === scenario.id ? null : scenario)}
              className="bg-gray-700/30 rounded-lg p-3 sm:p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white text-sm sm:text-base">{scenario.name}</h4>
                <div className="flex items-center space-x-2">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  <span className="text-xs sm:text-sm text-gray-400">{scenario.collaborators.length}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-sky-400 hover:text-sky-300 p-1"
                  >
                    <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.button>
                </div>
              </div>
              
              <p className="text-xs sm:text-sm text-gray-300 mb-3 leading-tight">{scenario.description}</p>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                  <span className="text-gray-300 truncate">
                    {scenario.results.costImpact > 0 ? '+' : ''}
                    ${Math.abs(scenario.results.costImpact).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                  <span className="text-gray-300">{scenario.results.timeImpact}h</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                  <span className={getRiskColor(scenario.results.riskLevel)}>
                    {scenario.results.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>

              <AnimatePresence>
                {selectedScenario?.id === scenario.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-600"
                  >
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-white font-medium mb-2 text-sm">Active Collaborators</h5>
                        <div className="flex flex-wrap gap-2">
                          {scenario.collaborators.map(user => (
                            <div
                              key={user.id}
                              className="flex items-center space-x-2 bg-gray-600/50 rounded-full px-2 sm:px-3 py-1"
                            >
                              <span className="text-xs sm:text-sm">{user.avatar}</span>
                              <span className="text-xs sm:text-sm text-gray-300">{user.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button className="bg-sky-600 hover:bg-sky-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors">
                          Join Simulation
                        </button>
                        <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};