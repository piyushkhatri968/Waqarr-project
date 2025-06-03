import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUsers, FaMoneyBillWave, FaChartBar, FaUserCircle } from 'react-icons/fa';

const DashboardLayout = () => {
  const { logout } = useAuth();

  const menuItems = [
    { path: '/customers', icon: <FaUsers />, label: 'Customers' },
    { path: '/payments', icon: <FaMoneyBillWave />, label: 'Payments' },
    { path: '/reports', icon: <FaChartBar />, label: 'Reports' },
    { path: '/profile', icon: <FaUserCircle />, label: 'Profile' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-primary-600">Car Finance</h1>
        </div>
        <nav className="mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center px-6 py-3 text-gray-600 hover:bg-primary-50 hover:text-primary-600"
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <button
            onClick={logout}
            className="w-full flex items-center px-6 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600"
          >
            <span className="mr-3">🚪</span>
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 