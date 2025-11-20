'use client';

export default function AirQualityPage() {
  const airQualityData = [
    {
      id: 1,
      deviceName: 'esp_edb45',
      ppm: 3.60944,
      ro: 5.494842,
      status: 'BAIK',
      timestamp: '11/4/2025, 8:13:55 AM',
    },
    {
      id: 2,
      deviceName: 'esp_edb45',
      ppm: 3.60944,
      ro: 5.494842,
      status: 'BAIK',
      timestamp: '11/4/2025, 8:13:50 AM',
    },
    {
      id: 3,
      deviceName: 'esp_edb45',
      ppm: 3.752697,
      ro: 5.511234,
      status: 'BAIK',
      timestamp: '11/4/2025, 8:13:45 AM',
    },
    {
      id: 4,
      deviceName: 'esp_edb45',
      ppm: 3.643211,
      ro: 5.498765,
      status: 'BAIK',
      timestamp: '11/4/2025, 8:13:40 AM',
    },
    {
      id: 5,
      deviceName: 'esp_device2',
      ppm: 4.123456,
      ro: 5.623456,
      status: 'BAIK',
      timestamp: '11/4/2025, 8:10:00 AM',
    },
  ];

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
                  Device Name
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
              {airQualityData.map((data) => (
                <tr key={data.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{data.deviceName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{data.ppm}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{data.ro}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {data.status}
                    </span>
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


