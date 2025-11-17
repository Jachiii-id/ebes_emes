'use client';

import { useState } from 'react';
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

export default function DashboardPage() {
  // Sample data for charts
  const airQualityData = [
    { time: '8:00', ppm: 3.5, ro: 5.2 },
    { time: '8:05', ppm: 3.6, ro: 5.3 },
    { time: '8:10', ppm: 3.7, ro: 5.4 },
    { time: '8:15', ppm: 3.6, ro: 5.3 },
    { time: '8:20', ppm: 3.5, ro: 5.2 },
    { time: '8:25', ppm: 3.4, ro: 5.1 },
    { time: '8:30', ppm: 3.6, ro: 5.3 },
  ];

  const gpsData = [
    { time: '8:00', lat: 0, lng: 0, speed: 0 },
    { time: '8:05', lat: 0, lng: 0, speed: 0 },
    { time: '8:10', lat: 0, lng: 0, speed: 0 },
    { time: '8:15', lat: 0, lng: 0, speed: 0 },
    { time: '8:20', lat: 0, lng: 0, speed: 0 },
    { time: '8:25', lat: 0, lng: 0, speed: 0 },
    { time: '8:30', lat: 0, lng: 0, speed: 0 },
  ];

  const deviceStats = [
    { name: 'Active Devices', value: 12, color: '#22c55e' },
    { name: 'Total Readings', value: 1247, color: '#3b82f6' },
    { name: 'Avg PPM', value: '3.6', color: '#f59e0b' },
    { name: 'Locations', value: 8, color: '#8b5cf6' },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
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

      {/* Stats Cards */}
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Air Quality Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Air Quality Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={airQualityData}>
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

        {/* GPS Location Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">GPS Speed Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={gpsData}>
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

      {/* Air Quality Distribution */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Air Quality Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={airQualityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ppm" fill="#22c55e" name="PPM" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Current Device Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Device Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-semibold text-gray-800">esp_edb45</p>
              <p className="text-sm text-gray-600">Device ID: edb45f58-d23f-44e4-83ec-d0b66b1052ff</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="font-medium">11/4/2025, 8:13:55 AM</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
