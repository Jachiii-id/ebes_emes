'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '/dashboard1.png' },
    { name: 'List Devices', path: '/dashboard/devices', icon: '/dashboard2.png' },
    { name: 'Air Quality', path: '/dashboard/air-quality', icon: '/dashboard3.png' },
    { name: 'GPS Location', path: '/dashboard/gps-location', icon: '/dashboard4.png' },
    { name: 'Air Data History', path: '/dashboard/air-data-history', icon: '/dashboard5.png' },
    { name: 'GPS Data History', path: '/dashboard/gps-data-history', icon: '/dashboard6.png' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-gray-800">EMES-EBES</h1>
          )}
           <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded hover:bg-gray-100 transition"
            >
              <Image
                src={sidebarOpen ? "/close.png" : "/open.png"}
                alt="toggle"
                width={24}
                height={24}
                className="object-contain"
              />
            </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2 flex-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="relative w-6 h-6 flex-shrink-0">
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={24}
                    height={24}
                    className={`object-contain ${isActive ? 'brightness-0 invert' : ''}`}
                  />
                </div>
                {sidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Back to Home */}
        <div className="p-4 border-t">
          <Link
            href="/"
            className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            <div className="relative w-6 h-6 flex-shrink-0">
              <Image
                src="/home.png"
                alt="Home"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            {sidebarOpen && <span className="font-medium">Back to Home</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

