import { useState, useEffect } from 'react';
import { Shipment, InventoryItem, Alert } from '../types/supply-chain';

export const useRealTimeData = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Initialize with mock data
    initializeData();

    // Simulate real-time updates
    const interval = setInterval(() => {
      updateRealTimeData();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const initializeData = () => {
    const mockShipments: Shipment[] = [
      {
        id: 'SH001',
        origin: { lat: 40.7128, lng: -74.0060, name: 'New York Warehouse', type: 'warehouse' },
        destination: { lat: 34.0522, lng: -118.2437, name: 'Los Angeles DC', type: 'distribution' },
        status: 'in-transit',
        cargo: 'Electronics Components',
        estimatedArrival: '2025-01-16T14:30:00Z',
        currentLocation: { lat: 39.9526, lng: -75.1652, name: 'Philadelphia', type: 'distribution' },
        value: 125000
      },
      {
        id: 'SH002',
        origin: { lat: 41.8781, lng: -87.6298, name: 'Chicago Hub', type: 'warehouse' },
        destination: { lat: 32.7767, lng: -96.7970, name: 'Dallas Customer', type: 'customer' },
        status: 'delayed',
        cargo: 'Medical Supplies',
        estimatedArrival: '2025-01-17T09:15:00Z',
        value: 89000
      }
    ];

    const mockInventory: InventoryItem[] = [
      {
        id: 'INV001',
        name: 'Semiconductor Chips',
        location: 'New York Warehouse',
        currentStock: 2400,
        minThreshold: 1000,
        maxCapacity: 5000,
        category: 'Electronics',
        lastUpdated: new Date().toISOString(),
        trend: 'down'
      },
      {
        id: 'INV002',
        name: 'Medical Devices',
        location: 'Chicago Hub',
        currentStock: 450,
        minThreshold: 500,
        maxCapacity: 2000,
        category: 'Healthcare',
        lastUpdated: new Date().toISOString(),
        trend: 'up'
      }
    ];

    const mockAlerts: Alert[] = [
      {
        id: 'AL001',
        type: 'warning',
        message: 'Low inventory threshold reached for Medical Devices',
        timestamp: new Date().toISOString(),
        location: 'Chicago Hub',
        resolved: false
      },
      {
        id: 'AL002',
        type: 'critical',
        message: 'Shipment SH002 delayed due to weather conditions',
        timestamp: new Date().toISOString(),
        location: 'Dallas',
        resolved: false
      }
    ];

    setShipments(mockShipments);
    setInventory(mockInventory);
    setAlerts(mockAlerts);
  };

  const updateRealTimeData = () => {
    // Simulate real-time updates
    setInventory(prev => prev.map(item => ({
      ...item,
      currentStock: Math.max(0, item.currentStock + Math.floor(Math.random() * 20) - 10),
      lastUpdated: new Date().toISOString()
    })));

    // Occasionally add new alerts
    if (Math.random() < 0.3) {
      const newAlert: Alert = {
        id: `AL${Date.now()}`,
        type: Math.random() < 0.3 ? 'critical' : 'info',
        message: 'System detected potential supply chain optimization opportunity',
        timestamp: new Date().toISOString(),
        resolved: false
      };
      setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
    }
  };

  return { shipments, inventory, alerts, isConnected };
};