export interface Location {
  lat: number;
  lng: number;
  name: string;
  type: 'warehouse' | 'supplier' | 'customer' | 'distribution';
}

export interface Shipment {
  id: string;
  origin: Location;
  destination: Location;
  status: 'in-transit' | 'delivered' | 'delayed' | 'pending';
  cargo: string;
  estimatedArrival: string;
  currentLocation?: Location;
  value: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  location: string;
  currentStock: number;
  minThreshold: number;
  maxCapacity: number;
  category: string;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  location?: string;
  resolved: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  color: string;
  active: boolean;
  cursor?: { x: number; y: number };
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  results: {
    costImpact: number;
    timeImpact: number;
    riskLevel: string;
  };
  collaborators: User[];
  lastModified: string;
}