'use client';

import { useQuery } from '@tanstack/react-query'; // Import useQuery
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { apiService } from '../../../../lib/api'; // Ensure apiService is imported
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Helper function to format timestamp for charts and display
const formatTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleString();
};

export default function DeviceDetailPage() {
  const params = useParams();
  const deviceId = params.id;

  const { data: device, isLoading: deviceLoading } = useQuery({
    queryKey: ['device', deviceId],
    queryFn: () => apiService.getDevice(deviceId),
  });

  const { data: latestAirData, isLoading: airLoading } = useQuery({
    queryKey: ['latest-air', deviceId],
    queryFn: () => apiService.getLatestAirData(deviceId),
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const { data: latestGpsData, isLoading: gpsLoading } = useQuery({
    queryKey: ['latest-gps', deviceId],
    queryFn: () => apiService.getLatestGpsData(deviceId),
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const { data: airDataHistory } = useQuery({
    queryKey: ['air-history', deviceId],
    queryFn: () => apiService.getAirData(deviceId),
  });

  const { data: gpsDataHistory } = useQuery({
    queryKey: ['gps-history', deviceId],
    queryFn: () => apiService.getGpsData(deviceId),
  });

  // --- Transformation for Charts ---
  // Reverse is used to ensure the chart displays oldest data on the left
  const chartAirData = airDataHistory?.map(item => ({
    time: formatTime(item.createdAt),
    ppm: parseFloat(item.ppm)
  })).reverse() || [];

  const chartGpsData = gpsDataHistory?.map(item => ({
    time: formatTime(item.createdAt),
    speed: parseFloat(item.speed)
  })).reverse() || [];


  // --- Loading/Error States ---
  if (deviceLoading || airLoading || gpsLoading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen text-center py-20 text-xl text-blue-600">
        Loading device details...
      </div>
    );
  }

  // Handle case where device data couldn't be fetched
  if (!device) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen text-center py-20 text-xl text-red-600">
        Error: Device not found or failed to load.
      </div>
    );
  }
  
  const lastUpdatedTimestamp = latestAirData?.createdAt || latestGpsData?.createdAt || device.updatedAt;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      
      {/* Back Button */}
      <Link
        href="/dashboard/devices"
        className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
      >
        ← Back to Devices
      </Link>

      {/* Device Details Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Device Name</p>
            {/* STATIC REPLACED: Use device.name */}
            <p className="text-lg font-semibold text-gray-800">{device.name}</p> 
            <p className="text-sm text-gray-600 mt-4 mb-1">Registered</p>
            {/* STATIC REPLACED: Use device.createdAt */}
            <p className="text-sm text-gray-800">{formatDate(device.createdAt)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Device ID</p>
            {/* STATIC REPLACED: Use device.device_id */}
            <p className="text-sm text-gray-800 break-all">{device.device_id}</p>
            <p className="text-sm text-gray-600 mt-4 mb-1">Last Updated</p>
            {/* STATIC REPLACED: Use lastUpdatedTimestamp */}
            <p className="text-sm text-gray-800">{formatDate(lastUpdatedTimestamp)}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
            Calibrate Sensor
          </button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Air Quality Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h2 className="text-xl font-bold text-gray-800">Air Quality</h2>
          </div>
          <div className="mb-4">
            {/* STATIC REPLACED: Use latestAirData.ppm */}
            <p className="text-2xl font-bold text-gray-800">PPM: {latestAirData?.ppm || 'N/A'}</p> 
            {/* STATIC REPLACED: Use latestAirData.ro */}
            <p className="text-xl text-gray-600">RO: {latestAirData?.ro || 'N/A'}</p> 
          </div>
          <p className="text-sm text-gray-600">Last Update: {formatDate(latestAirData?.createdAt)}</p>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              {/* STATIC REPLACED: Use chartAirData */}
              <LineChart data={chartAirData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ppm" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GPS Location Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">GPS Location</h2>
          <div className="mb-4">
            {/* STATIC REPLACED: Use latestGpsData */}
            <p className="text-lg text-gray-800">Latitude: {latestGpsData?.lat || 'N/A'}</p>
            <p className="text-lg text-gray-800">Longitude: {latestGpsData?.lng || 'N/A'}</p>
            <p className="text-lg text-gray-800">Speed: {latestGpsData?.speed || 'N/A'} km/h</p>
            <p className="text-lg text-gray-800">Satellites: {latestGpsData?.sats || 'N/A'}</p>
          </div>
          <p className="text-sm text-gray-600 mb-4">Last Update: {formatDate(latestGpsData?.createdAt)}</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              {/* STATIC REPLACED: Use chartGpsData */}
              <AreaChart data={chartGpsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="speed" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* History Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Air Data History */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* STATIC REPLACED: Show actual count */}
          <h2 className="text-xl font-bold text-gray-800 mb-4">Air Data History ({airDataHistory?.length || 0})</h2> 
          <div className="max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {/* STATIC REPLACED: Use airDataHistory (with optional chaining and safety check) */}
              {airDataHistory?.map((item) => ( 
                <div
                  key={item._id} // Use _id for the key
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <span className="font-medium text-gray-800">{item.ppm} PPM</span>
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      {item.status}
                    </span>
                  </div>
                  {/* STATIC REPLACED: Use item.createdAt */}
                  <span className="text-sm text-gray-600">{formatTime(item.createdAt)}</span> 
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GPS Data History */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* STATIC REPLACED: Show actual count */}
          <h2 className="text-xl font-bold text-gray-800 mb-4">GPS Data History ({gpsDataHistory?.length || 0})</h2> 
          <div className="max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {/* STATIC REPLACED: Use gpsDataHistory (with optional chaining and safety check) */}
              {gpsDataHistory?.map((item) => ( 
                <div
                  key={item._id} // Use _id for the key
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <span className="font-medium text-gray-800">
                        {item.lat}, {item.lng}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      Speed: {item.speed} km/h • Sats: {item.sats}
                    </span>
                  </div>
                  {/* STATIC REPLACED: Use item.createdAt */}
                  <span className="text-sm text-gray-600">{formatTime(item.createdAt)}</span> 
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}