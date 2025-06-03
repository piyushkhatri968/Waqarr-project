import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../config';
import { FaSearch, FaEye, FaUndo } from 'react-icons/fa';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showProof, setShowProof] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showConfirm, setShowConfirm] = useState(null);
  const [confirmNotes, setConfirmNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = {};
      if (filter !== 'all') params.status = filter;
      if (search) params.search = search;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await axios.get(`${config.API_URL}/payments`, {
        params,
        withCredentials: true,
        headers: { 
          Authorization: token ? `Bearer ${token}` : undefined
        }
      });
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  }, [filter, startDate, endDate, search]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPayments();
  };

  const handleViewProof = (payment) => {
    setShowProof(payment);
  };

  const closeProofModal = () => {
    setShowProof(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const handleRevertStatus = async () => {
    try {
      if (!showConfirm) return;
      
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const data = {
        notes: confirmNotes || `Status changed from ${showConfirm.status === 'paid' ? 'paid to pending' : 'pending to paid'}`
      };

      await axios.post(`${config.API_URL}/payments/${showConfirm.id}/revert`, data, {
        withCredentials: true,
        headers: { 
          Authorization: token ? `Bearer ${token}` : undefined
        }
      });
      
      toast.success(`Payment ${showConfirm.status === 'paid' ? 'marked as unpaid' : 'marked as paid'}`);
      setShowConfirm(null);
      setConfirmNotes('');
      
      // Refresh payments
      fetchPayments();
    } catch (error) {
      console.error('Error reverting payment status:', error);
      toast.error('Failed to update payment status');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && payments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 pr-10"
                placeholder="Search by customer name..."
              />
              <button
                type="submit"
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              >
                <FaSearch />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {payments.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proof
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.customer?.fullName || payment.customer?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₼{payment.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(payment.dueDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(payment.paymentDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : payment.status === 'overdue'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.proofOfPaymentPath ? (
                      <button
                        onClick={() => handleViewProof(payment)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <FaEye className="mr-1" /> View
                      </button>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setShowConfirm(payment)}
                      className="text-gray-600 hover:text-gray-900 flex items-center"
                      title={`Mark as ${payment.status === 'paid' ? 'Unpaid' : 'Paid'}`}
                    >
                      <FaUndo className="mr-1" /> Change Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No payments found matching your filters
          </div>
        )}
      </div>

      {/* Proof Modal */}
      {showProof && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Payment Proof</h3>
              <button
                onClick={closeProofModal}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="mb-4">
              <p><strong>Customer:</strong> {showProof.customer?.fullName || showProof.customer?.name}</p>
              <p><strong>Amount:</strong> ₼{showProof.amount}</p>
              <p><strong>Date:</strong> {formatDate(showProof.paymentDate)}</p>
            </div>
            <div className="border rounded-lg p-2 bg-gray-50">
              {showProof.proofOfPaymentPath && (
                <img
                  src={`${config.API_URL.replace('/api', '')}${showProof.proofOfPaymentPath}`}
                  alt="Payment Proof"
                  className="max-w-full h-auto mx-auto"
                />
              )}
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={closeProofModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Status Change Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Confirm Status Change</h3>
              <button
                onClick={() => setShowConfirm(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="mb-4">
              <p className="mb-2"><strong>Customer:</strong> {showConfirm.customer?.fullName || showConfirm.customer?.name}</p>
              <p className="mb-2"><strong>Amount:</strong> ₼{showConfirm.amount}</p>
              <p className="mb-4"><strong>Current Status:</strong> {showConfirm.status.charAt(0).toUpperCase() + showConfirm.status.slice(1)}</p>
              
              <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-3 rounded">
                <p className="font-medium">Are you sure you want to change this payment to {showConfirm.status === 'paid' ? 'Unpaid' : 'Paid'}?</p>
                <p className="text-sm mt-1">This will update the customer's payment records and financials.</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add a note (reason for change)
              </label>
              <textarea
                value={confirmNotes}
                onChange={(e) => setConfirmNotes(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholder="Enter reason for changing status..."
                rows="2"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleRevertStatus}
                disabled={actionLoading}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ${
                  actionLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {actionLoading ? "Processing..." : `Change to ${showConfirm.status === 'paid' ? 'Unpaid' : 'Paid'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments; 