import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUsers, FaMoneyBill, FaChartBar, FaFileAlt, FaCog } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <div className="bg-blue-800 text-white w-64 min-h-screen p-4">
      <div className="text-2xl font-bold mb-8">Car Finance</div>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              to="/customers"
              className={`flex items-center space-x-2 p-2 rounded hover:bg-blue-700 ${isActive('/customers')}`}
            >
              <FaUsers />
              <span>Customers</span>
            </Link>
          </li>
          <li>
            <Link
              to="/payments"
              className={`flex items-center space-x-2 p-2 rounded hover:bg-blue-700 ${isActive('/payments')}`}
            >
              <FaMoneyBill />
              <span>Payments</span>
            </Link>
          </li>
          <li>
            <Link
              to="/reports"
              className={`flex items-center space-x-2 p-2 rounded hover:bg-blue-700 ${isActive('/reports')}`}
            >
              <FaChartBar />
              <span>Reports</span>
            </Link>
          </li>
          <li>
            <Link
              to="/documents"
              className={`flex items-center space-x-2 p-2 rounded hover:bg-blue-700 ${isActive('/documents')}`}
            >
              <FaFileAlt />
              <span>Documents</span>
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={`flex items-center space-x-2 p-2 rounded hover:bg-blue-700 ${isActive('/settings')}`}
            >
              <FaCog />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
