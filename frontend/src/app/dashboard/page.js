'use client';

import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../lib/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Helper function for date formatting
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleString();
};

export default function DashboardPage() {
  const { data: devices, isLoading: devicesLoading } = useQuery({
    queryKey: ['all-devices'],
    queryFn: () => apiService.getDevices(),
    refetchInterval: 30000,
  });

  const { data: airData, isLoading: airLoading } = useQuery({
    queryKey: ['all-air-data'],
    queryFn: () => apiService.getAllAirData(),
    refetchInterval: 30000,
  });

  const { data: gpsData, isLoading: gpsLoading } = useQuery({
    queryKey: ['all-gps-data'],
    queryFn: () => apiService.getAllGpsData(),
    refetchInterval: 30000,
  });

  // --- Data Transformation and Calculations ---

  const activeDevices = devices?.length || 0;

  // Calculate Total Readings and Average PPM
  const totalReadings = (airData?.length || 0) + (gpsData?.length || 0);
  
  const totalPPM = airData?.reduce((sum, item) => sum + parseFloat(item.ppm), 0) || 0;
  const avgPPM = airData?.length > 0 ? (totalPPM / airData.length).toFixed(1) : '0.0';

  // Estimate unique locations based on lat/lng pair count (simplified)
  const uniqueLocations = new Set(
    gpsData?.map(item => `${item.lat},${item.lng}`).filter(Boolean)
  ).size;

  const deviceStats = [
    { name: 'Active Devices', value: activeDevices, color: '#22c55e' },
    { name: 'Total Readings', value: totalReadings, color: '#3b82f6' },
    { name: 'Avg PPM', value: avgPPM, color: '#f59e0b' },
    { name: 'Locations', value: uniqueLocations, color: '#8b5cf6' },
  ];

  // Prepare data for charts (last 7 readings, reverse to show oldest first on X-axis)
  const chartAirData = airData
    ? airData
        .slice(0, 7)
        .map(item => ({
          time: formatTime(item.createdAt),
          ppm: parseFloat(item.ppm),
          ro: parseFloat(item.ro),
        }))
        .reverse()
    : [];

  const chartGpsData = gpsData
    ? gpsData
        .slice(0, 7)
        .map(item => ({
          time: formatTime(item.createdAt),
          speed: parseFloat(item.speed),
        }))
        .reverse()
    : [];

  const allLoading = devicesLoading || airLoading || gpsLoading;

  if (allLoading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen text-center py-20 text-xl text-blue-600">
        Loading dashboard data...
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of all monitoring data</p>
      </div>

      <div className="relative w-full h-188">
        <img src="/map.svg" alt="Map" className="absolute w-full h-180 object-cover mb-8 rounded-lg shadow" />
        <div className='absolute w-fit rounded-lg ms-6 mt-6 bg-white shadow-md'>
          <h1 className="text-3xl font-bold text-gray-600 p-4">PT. Mencari Cinta Sejati</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {deviceStats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow p-6"
          >
            <p className="text-gray-600 text-sm mb-2">{stat.name}</p>
            <p className="text-3xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Air Quality Trend (Latest)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartAirData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="ppm"
                stroke="#22c55e"
                strokeWidth={2}
                name="PPM"
              />
              <Line
                type="monotone"
                dataKey="ro"
                stroke="#3b82f6"
                strokeWidth={2}
                name="RO"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">GPS Speed Trend (Latest)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartGpsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="speed"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
                name="Speed (km/h)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">PPM Distribution (Latest)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartAirData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ppm" fill="#22c55e" name="PPM" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Device Activity ({activeDevices})</h2>
        <div className="space-y-4">
          {devices && devices.length > 0 ? (
            devices.slice(0, 5).map((device) => {
              // Find latest air or GPS update for this device
              const latestAir = airData?.find(a => a.device_id === device.device_id);
              const latestGps = gpsData?.find(g => g.device_id === device.device_id);
              
              const latestUpdate = latestAir?.createdAt || latestGps?.createdAt || device.updatedAt;
              const isOnline = !!latestUpdate && (new Date() - new Date(latestUpdate)) < (60 * 1000 * 5); // Example: Updated within the last 5 minutes

              return (
                <div
                  key={device._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{device.name}</p>
                    <p className="text-sm text-gray-600">Device ID: {device.device_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-medium">{formatDate(latestUpdate)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm text-gray-600">{isOnline ? 'Online' : 'Offline'}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4 text-gray-500">No devices registered.</div>
          )}
        </div>
      </div>
    </div>
  );
}