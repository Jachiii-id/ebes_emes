'use client';

export default function AirDataHistoryPage() {
  // Generate sample history data
  const airDataHistory = Array.from({ length: 47 }, (_, i) => ({
    id: i + 1,
    ppm: (3.5 + Math.random() * 0.5).toFixed(5),
    status: 'BAIK',
    timestamp: `11/4/2025, 8:${String(13 - Math.floor(i * 5 / 60)).padStart(2, '0')}:${String(55 - (i * 5) % 60).padStart(2, '0')} AM`,
  }));

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Air Data History</h1>
        <p className="text-gray-600">Historical air quality readings (47 entries)</p>
      </div>

      {/* Air Data History List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto max-h-[calc(100vh-250px)]">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PPM
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
              {airDataHistory.map((data) => (
                <tr key={data.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{data.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{data.ppm} PPM</div>
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


