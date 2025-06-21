import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Shipment, Location } from '../types/supply-chain';
import { useTheme } from '../contexts/ThemeContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface SupplyChainMapProps {
  shipments: Shipment[];
}

export const SupplyChainMap: React.FC<SupplyChainMapProps> = ({ shipments }) => {
  const { theme } = useTheme();

  const createCustomIcon = (type: string, status?: string) => {
    const colors = {
      warehouse: '#0EA5E9',
      supplier: '#10B981',
      customer: '#F59E0B',
      distribution: '#8B5CF6',
      'in-transit': '#10B981',
      delayed: '#EF4444',
      delivered: '#6B7280',
      pending: '#F59E0B'
    };

    const color = colors[status as keyof typeof colors] || colors[type as keyof typeof colors] || '#6B7280';
    
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid ${theme === 'dark' ? '#1f2937' : '#ffffff'}; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-marker',
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'in-transit': '#10B981',
      'delayed': '#EF4444',
      'delivered': '#6B7280',
      'pending': '#F59E0B'
    };
    return colors[status as keyof typeof colors] || '#6B7280';
  };

  const getTileLayerUrl = () => {
    return theme === 'dark' 
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300"
    >
      <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Global Supply Chain Network</h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Real-time shipment tracking and logistics overview</p>
      </div>
      
      <div className="h-64 sm:h-80 lg:h-96">
        <MapContainer
          center={[39.8283, -98.5795]}
          zoom={4}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={false}
          doubleClickZoom={true}
          touchZoom={true}
          key={theme} // Force re-render when theme changes
        >
          <TileLayer
            url={getTileLayerUrl()}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {shipments.map(shipment => (
            <React.Fragment key={shipment.id}>
              {/* Origin marker */}
              <Marker
                position={[shipment.origin.lat, shipment.origin.lng]}
                icon={createCustomIcon(shipment.origin.type)}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>{shipment.origin.name}</strong>
                    <br />
                    Type: {shipment.origin.type}
                  </div>
                </Popup>
              </Marker>
              
              {/* Destination marker */}
              <Marker
                position={[shipment.destination.lat, shipment.destination.lng]}
                icon={createCustomIcon(shipment.destination.type)}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>{shipment.destination.name}</strong>
                    <br />
                    Type: {shipment.destination.type}
                  </div>
                </Popup>
              </Marker>
              
              {/* Current location marker (if in transit) */}
              {shipment.currentLocation && (
                <Marker
                  position={[shipment.currentLocation.lat, shipment.currentLocation.lng]}
                  icon={createCustomIcon('current', shipment.status)}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>Shipment {shipment.id}</strong>
                      <br />
                      Status: {shipment.status}
                      <br />
                      Cargo: {shipment.cargo}
                      <br />
                      Value: ${shipment.value.toLocaleString()}
                    </div>
                  </Popup>
                </Marker>
              )}
              
              {/* Route line */}
              <Polyline
                positions={[
                  [shipment.origin.lat, shipment.origin.lng],
                  ...(shipment.currentLocation ? [[shipment.currentLocation.lat, shipment.currentLocation.lng]] : []),
                  [shipment.destination.lat, shipment.destination.lng]
                ]}
                color={getStatusColor(shipment.status)}
                weight={3}
                opacity={0.7}
                dashArray={shipment.status === 'delayed' ? '10, 10' : undefined}
              />
            </React.Fragment>
          ))}
        </MapContainer>
      </div>
    </motion.div>
  );
};