'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function DeviceDetailPage() {
  const params = useParams();
  const deviceId = params.id;

  // Sample device data
  const deviceData = {
    id: deviceId,
    name: 'esp_edb45',
    registered: '11/4/2025, 8:09:55 AM',
    lastUpdated: '11/4/2025, 8:13:55 AM',
  };

  // Sample air quality data
  const airQualityData = [
    { time: '8:00', ppm: 3.60944 },
    { time: '8:05', ppm: 3.60944 },
    { time: '8:10', ppm: 3.752697 },
    { time: '8:15', ppm: 3.60944 },
    { time: '8:20', ppm: 3.643211 },
  ];

  // Sample GPS data
  const gpsData = [
    { time: '8:00', lat: 0, lng: 0, speed: 0, satellites: 0 },
    { time: '8:05', lat: 0, lng: 0, speed: 0, satellites: 0 },
    { time: '8:10', lat: 0, lng: 0, speed: 0, satellites: 0 },
    { time: '8:15', lat: 0, lng: 0, speed: 0, satellites: 0 },
    { time: '8:20', lat: 0, lng: 0, speed: 0, satellites: 0 },
  ];

  // Sample air quality history
  const airQualityHistory = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    ppm: (3.5 + Math.random() * 0.5).toFixed(5),
    ro: (5.4 + Math.random() * 0.2).toFixed(6),
    status: 'BAIK',
    timestamp: `11/4/2025, 8:${String(13 - i).padStart(2, '0')}:55 AM`,
  }));

  // Sample GPS history
  const gpsHistory = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    location: '0,0',
    speed: 0,
    satellites: 0,
    timestamp: `11/4/2025, 8:${String(13 - i).padStart(2, '0')}:55 AM`,
  }));

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
            <p className="text-lg font-semibold text-gray-800">esp_edb45</p>
            <p className="text-sm text-gray-600 mt-4 mb-1">Registered</p>
            <p className="text-sm text-gray-800">{deviceData.registered}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Device ID</p>
            <p className="text-sm text-gray-800 break-all">{deviceData.id}</p>
            <p className="text-sm text-gray-600 mt-4 mb-1">Last Updated</p>
            <p className="text-sm text-gray-800">{deviceData.lastUpdated}</p>
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
            <p className="text-2xl font-bold text-gray-800">PPM: 3.60944</p>
            <p className="text-xl text-gray-600">RO: 5.494842</p>
          </div>
          <p className="text-sm text-gray-600">Last Update: {deviceData.lastUpdated}</p>
          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={airQualityData}>
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
            <p className="text-lg text-gray-800">Latitude: 0</p>
            <p className="text-lg text-gray-800">Longitude: 0</p>
            <p className="text-lg text-gray-800">Speed: 0 km/h</p>
            <p className="text-lg text-gray-800">Satellites: 0</p>
          </div>
          <p className="text-sm text-gray-600 mb-4">Last Update: {deviceData.lastUpdated}</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gpsData}>
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
          <h2 className="text-xl font-bold text-gray-800 mb-4">Air Data History (47)</h2>
          <div className="max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {airQualityHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <span className="font-medium text-gray-800">{item.ppm} PPM</span>
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      {item.status}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{item.timestamp.split(', ')[1]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GPS Data History */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">GPS Data History (47)</h2>
          <div className="max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {gpsHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <span className="font-medium text-gray-800">{item.location}</span>
                    <span className="ml-2 text-sm text-gray-600">
                      Speed: {item.speed} km/h • Sats: {item.satellites}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{item.timestamp.split(', ')[1]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


