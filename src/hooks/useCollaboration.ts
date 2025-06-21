import { useState, useEffect } from 'react';
import { User, Scenario } from '../types/supply-chain';

export const useCollaboration = () => {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentUser] = useState<User>({
    id: 'user-1',
    name: 'Supply Chain Manager',
    avatar: '👨‍💼',
    color: '#0EA5E9',
    active: true
  });

  useEffect(() => {
    // Initialize collaborative data
    const mockUsers: User[] = [
      {
        id: 'user-2',
        name: 'Logistics Coordinator',
        avatar: '👩‍💻',
        color: '#10B981',
        active: true
      },
      {
        id: 'user-3',
        name: 'Operations Director',
        avatar: '👨‍🏭',
        color: '#F59E0B',
        active: false
      }
    ];

    const mockScenarios: Scenario[] = [
      {
        id: 'SC001',
        name: 'Winter Storm Impact Analysis',
        description: 'Analyzing supply chain disruption during severe weather',
        parameters: {
          weatherSeverity: 'high',
          affectedRegions: ['northeast', 'midwest'],
          duration: '72 hours'
        },
        results: {
          costImpact: -125000,
          timeImpact: 48,
          riskLevel: 'high'
        },
        collaborators: mockUsers.slice(0, 2),
        lastModified: new Date().toISOString()
      }
    ];

    setActiveUsers(mockUsers);
    setScenarios(mockScenarios);

    // Simulate user activity
    const interval = setInterval(() => {
      setActiveUsers(prev => prev.map(user => ({
        ...user,
        active: Math.random() > 0.3,
        cursor: user.active ? {
          x: Math.random() * 100,
          y: Math.random() * 100
        } : undefined
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const createScenario = (name: string, description: string) => {
    const newScenario: Scenario = {
      id: `SC${Date.now()}`,
      name,
      description,
      parameters: {},
      results: {
        costImpact: 0,
        timeImpact: 0,
        riskLevel: 'low'
      },
      collaborators: [currentUser],
      lastModified: new Date().toISOString()
    };
    setScenarios(prev => [newScenario, ...prev]);
    return newScenario;
  };

  return { activeUsers, scenarios, currentUser, createScenario };
};