import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaCar, FaMoneyBillWave, FaExclamationTriangle, FaChartLine } from 'react-icons/fa';
import toast from 'react-hot-toast';
import config from '../config';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeLeases: 0,
    monthlyPayments: 0,
    overduePayments: 0,
    totalInvested: 0,
    totalCollected: 0,
    totalProfit: 0,
    totalUnpaid: 0,
    fullyPaidCustomers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(false);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.API_URL}/reports/dashboard`, {
        withCredentials: true,
        headers: { 
          Authorization: token ? `Bearer ${token}` : undefined
        }
      });
      
      // Ensure all stats have valid values
      const validatedStats = {
        totalCustomers: response.data.totalCustomers || 0,
        activeLeases: response.data.activeLeases || 0,
        monthlyPayments: response.data.monthlyPayments || 0,
        overduePayments: response.data.overduePayments || 0,
        totalInvested: response.data.totalInvested || 0,
        totalCollected: response.data.totalCollected || 0,
        totalProfit: response.data.totalProfit || 0,
        totalUnpaid: response.data.totalUnpaid || 0,
        fullyPaidCustomers: response.data.fullyPaidCustomers || 0
      };
      
      setStats(validatedStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Format number safely
  const formatNumber = (value) => {
    if (value === undefined || value === null || isNaN(value)) return '0';
    return parseFloat(value).toLocaleString();
  };

  // Retry loading
  const handleRetry = () => {
    fetchDashboardStats();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-64">
        <p className="text-red-600 mb-4">Failed to load dashboard statistics</p>
        <button 
          onClick={handleRetry}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Total Customers</p>
              <p className="text-2xl font-bold">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <FaCar className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Active Leases</p>
              <p className="text-2xl font-bold">{stats.activeLeases}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaMoneyBillWave className="text-yellow-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Monthly Payments</p>
              <p className="text-2xl font-bold">₼{formatNumber(stats.monthlyPayments)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <FaExclamationTriangle className="text-red-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Overdue Payments</p>
              <p className="text-2xl font-bold">{stats.overduePayments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Invested</span>
              <span className="font-semibold">₼{formatNumber(stats.totalInvested)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Collected</span>
              <span className="font-semibold">₼{formatNumber(stats.totalCollected)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Profit</span>
              <span className="font-semibold text-green-600">₼{formatNumber(stats.totalProfit)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Unpaid</span>
              <span className="font-semibold text-red-600">₼{formatNumber(stats.totalUnpaid)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Customer Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Customers</span>
              <span className="font-semibold">{stats.totalCustomers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Leases</span>
              <span className="font-semibold text-blue-600">{stats.activeLeases}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Fully Paid</span>
              <span className="font-semibold text-green-600">{stats.fullyPaidCustomers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Overdue</span>
              <span className="font-semibold text-red-600">{stats.overduePayments}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.location.href = '/customers/add'}
            className="flex items-center justify-center p-3 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <FaUsers className="mr-2" />
            Add New Customer
          </button>
          <button
            onClick={() => window.location.href = '/payments'}
            className="flex items-center justify-center p-3 bg-green-50 rounded-lg text-green-600 hover:bg-green-100 transition-colors"
          >
            <FaMoneyBillWave className="mr-2" />
            Record Payment
          </button>
          <button
            onClick={() => window.location.href = '/reports'}
            className="flex items-center justify-center p-3 bg-purple-50 rounded-lg text-purple-600 hover:bg-purple-100 transition-colors"
          >
            <FaChartLine className="mr-2" />
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
}
