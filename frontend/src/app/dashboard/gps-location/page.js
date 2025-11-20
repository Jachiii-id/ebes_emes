'use client';

export default function GPSLocationPage() {
  const gpsData = [
    {
      id: 1,
      deviceName: 'esp_edb45',
      latitude: 0,
      longitude: 0,
      speed: 0,
      satellites: 0,
      timestamp: '11/4/2025, 8:13:55 AM',
    },
    {
      id: 2,
      deviceName: 'esp_edb45',
      latitude: 0,
      longitude: 0,
      speed: 0,
      satellites: 0,
      timestamp: '11/4/2025, 8:13:50 AM',
    },
    {
      id: 3,
      deviceName: 'esp_edb45',
      latitude: 0,
      longitude: 0,
      speed: 0,
      satellites: 0,
      timestamp: '11/4/2025, 8:13:45 AM',
    },
    {
      id: 4,
      deviceName: 'esp_device2',
      latitude: -6.2088,
      longitude: 106.8456,
      speed: 5,
      satellites: 8,
      timestamp: '11/4/2025, 8:10:00 AM',
    },
    {
      id: 5,
      deviceName: 'esp_device3',
      latitude: -6.1944,
      longitude: 106.8229,
      speed: 12,
      satellites: 10,
      timestamp: '11/4/2025, 7:45:20 AM',
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">GPS Location Data</h1>
        <p className="text-gray-600">All GPS location readings from devices</p>
      </div>

      {/* GPS Location List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
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
              {gpsData.map((data) => (
                <tr key={data.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{data.deviceName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {data.latitude}, {data.longitude}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{data.speed} km/h</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{data.satellites}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{data.timestamp}</div>
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


