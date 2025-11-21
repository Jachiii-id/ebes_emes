'use client';

import { useQuery } from "@tanstack/react-query";
import { apiService } from "../../../lib/api";

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleString();
};

export default function AirQualityPage() {
  const { data: airData, isLoading, error } = useQuery({
    queryKey: ['all-air-data'],
    queryFn: () => apiService.getAllAirData(),
  });
  
  if (isLoading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen text-center py-20 text-xl text-blue-600">
        Loading all air quality data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen text-center py-20 text-xl text-red-600">
        Error loading air data: {error.message}
      </div>
    );
  }

  const dataToRender = airData || [];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Air Quality Data</h1>
        <p className="text-gray-600">All air quality readings from devices</p>
      </div>

      {/* Air Quality List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PPM
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RO
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
                      {/* DATA BINDING: Use data.device_id */}
                      <div className="text-sm font-medium text-gray-900">{data.device_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* DATA BINDING: Use data.ppm */}
                      <div className="text-sm text-gray-900">{data.ppm}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* DATA BINDING: Use data.ro */}
                      <div className="text-sm text-gray-900">{data.ro}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* DATA BINDING: Use data.status. Use a ternary for status color if desired */}
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          data.status === 'BAIK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {data.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* DATA BINDING: Use data.createdAt and format it */}
                      <div className="text-sm text-gray-500">{formatDate(data.createdAt)}</div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No air quality data records found.
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