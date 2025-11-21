'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { apiService } from '../../../lib/api';

export default function DevicesPage() {
  const { data: devices, isLoading, error } = useQuery({
    queryKey: ['devices'],
    queryFn: apiService.getDevices,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen text-center py-10 text-lg text-blue-600">
        Loading devices...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen text-center py-10 text-lg text-red-600">
        Error loading devices: {error.message}
      </div>
    );
  }
  
  if (devices && devices.length === 0) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">List Devices</h1>
          <p className="text-gray-600">All registered devices</p>
        </div>
        <div className="text-center py-10 text-lg text-gray-500">No devices found.</div>
      </div>
    );
  }

  // --- Table Rendering (only if devices has data) ---
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">List Devices</h1>
        <p className="text-gray-600">All registered devices</p>
      </div>

      {/* Devices List (Table) */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            
            {/* Table Header */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            
            {/* Table Body - Map devices here */}
            <tbody className="bg-white divide-y divide-gray-200">
              {/* The devices variable is guaranteed to be an array with data here */}
              {devices && devices.map((device) => (
                <tr key={device.device_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{device.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{device.device_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{device.createdAt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{device.updatedAt}</div>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        device.status === 'online'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {device.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/dashboard/devices/${device.device_id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}