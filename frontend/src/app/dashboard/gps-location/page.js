'use client';

import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../../lib/api";

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleString();
};

export default function GPSLocationPage() {
  const { data: gpsData, isLoading, error } = useQuery({
    queryKey: ['all-gps-data'],
    queryFn: () => apiService.getAllGpsData(),
  });

  if (isLoading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen text-center py-20 text-xl text-blue-600">
        Loading all GPS data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen text-center py-20 text-xl text-red-600">
        Error loading GPS data: {error.message}
      </div>
    );
  }

  const dataToRender = gpsData || [];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">GPS Location Data</h1>
        <p className="text-gray-600">All GPS location readings from devices</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location (Lat, Lng)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Speed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Satellites
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dataToRender.length > 0 ? (
                dataToRender.map((data) => (
                  <tr key={data._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{data.device_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {data.lat}, {data.lng}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{data.speed} km/h</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{data.sats}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(data.createdAt)}</div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No GPS data records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}