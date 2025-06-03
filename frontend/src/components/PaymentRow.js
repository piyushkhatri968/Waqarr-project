import { useState } from "react";
import FilePreview from "./FilePreview";
import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../config';
import { FaEye, FaCheck, FaFileUpload, FaExchangeAlt, FaUndo } from 'react-icons/fa';

export default function PaymentRow({ payment, index, onPaymentUpdate }) {
  const [proofFile, setProofFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [markedPaid, setMarkedPaid] = useState(payment.status === "paid");
  const [loading, setLoading] = useState(false);
  const [showProof, setShowProof] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmNotes, setConfirmNotes] = useState('');

  const handleUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      setProofFile(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleMarkPaid = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('paymentDate', new Date().toISOString());
      
      if (uploadedFile) {
        formData.append('proof', uploadedFile);
      }
      
      const token = localStorage.getItem('token');
      await axios.post(`${config.API_URL}/payments/${payment.id}/pay`, formData, {
        withCredentials: true,
        headers: { 
          Authorization: token ? `Bearer ${token}` : undefined,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMarkedPaid(true);
      toast.success('Payment marked as paid');
      
      // Call the callback to refresh payments data
      if (onPaymentUpdate) {
        onPaymentUpdate();
      }
    } catch (error) {
      console.error('Error marking payment as paid:', error);
      toast.error('Failed to update payment status');
    } finally {
      setLoading(false);
    }
  };

  const handleRevertStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const data = {
        notes: confirmNotes || `Status changed from ${markedPaid ? 'paid to pending' : 'pending to paid'}`
      };

      await axios.post(`${config.API_URL}/payments/${payment.id}/revert`, data, {
        withCredentials: true,
        headers: { 
          Authorization: token ? `Bearer ${token}` : undefined
        }
      });
      
      // Toggle the status
      setMarkedPaid(!markedPaid);
      toast.success(`Payment ${markedPaid ? 'marked as unpaid' : 'marked as paid'}`);
      setShowConfirm(false);
      setConfirmNotes('');
      
      // Call the callback to refresh payments data
      if (onPaymentUpdate) {
        onPaymentUpdate();
      }
    } catch (error) {
      console.error('Error reverting payment status:', error);
      toast.error('Failed to update payment status');
    } finally {
      setLoading(false);
    }
  };

  const toggleProofView = () => {
    setShowProof(!showProof);
  };

  return (
    <>
      <tr className="border-b hover:bg-gray-50">
        <td className="py-2 px-6">{index + 1}</td>
        <td className="py-2 px-6">{payment.dueDate}</td>
        <td className="py-2 px-6">₼{payment.amount}</td>
        <td className="py-2 px-6">
          <span
            className={`px-2 py-1 rounded text-white text-xs ${
              markedPaid ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {markedPaid ? "Paid" : "Unpaid"}
          </span>
          <button 
            onClick={() => setShowConfirm(true)}
            className="ml-2 text-gray-500 hover:text-gray-700"
            title={`Mark as ${markedPaid ? 'Unpaid' : 'Paid'}`}
          >
            <FaUndo size={14} />
          </button>
        </td>
        <td className="py-2 px-6">{markedPaid ? payment.paidDate || "Today" : "-"}</td>
        <td className="py-2 px-6">
          {(proofFile || payment.proofOfPaymentPath) ? (
            <button 
              onClick={toggleProofView} 
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <FaEye className="mr-1" /> View
            </button>
          ) : (
            "-"
          )}
        </td>
        <td className="py-2 px-6">
          {!markedPaid ? (
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <label className="flex items-center cursor-pointer bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200">
                  <FaFileUpload className="mr-1" />
                  <span>Upload Proof</span>
                  <input type="file" onChange={handleUpload} className="hidden" />
                </label>
              </div>
              {proofFile && (
                <div className="text-xs text-green-600 mb-2">File selected</div>
              )}
              <button
                onClick={handleMarkPaid}
                disabled={loading}
                className={`flex items-center justify-center bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <FaCheck className="mr-1" /> Mark as Paid
                  </>
                )}
              </button>
            </div>
          ) : (
            <span className="text-green-600 flex items-center">
              <FaCheck className="mr-1" /> Completed
            </span>
          )}
        </td>
      </tr>
      
      {showProof && (
        <tr className="bg-gray-50">
          <td colSpan="7" className="p-4">
            <div className="flex flex-col items-center">
              <h4 className="text-lg font-medium mb-2">Proof of Payment</h4>
              <div className="border rounded-lg p-2 bg-white">
                <FilePreview 
                  fileUrl={proofFile || (payment.proofOfPaymentPath ? `${config.API_URL.replace('/api', '')}${payment.proofOfPaymentPath}` : null)} 
                />
              </div>
              <button 
                onClick={toggleProofView}
                className="mt-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </td>
        </tr>
      )}

      {showConfirm && (
        <tr className="bg-gray-50">
          <td colSpan="7" className="p-4">
            <div className="bg-white shadow-md rounded p-4 max-w-md mx-auto">
              <h4 className="text-lg font-medium mb-2 text-center">
                Confirm Status Change
              </h4>
              <p className="mb-4 text-center">
                Are you sure you want to mark this payment as {markedPaid ? "Unpaid" : "Paid"}?
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add a note (optional)
                </label>
                <textarea
                  value={confirmNotes}
                  onChange={(e) => setConfirmNotes(e.target.value)}
                  className="w-full border rounded p-2 text-sm"
                  placeholder="Reason for changing status..."
                  rows="2"
                ></textarea>
              </div>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRevertStatus}
                  disabled={loading}
                  className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FaExchangeAlt className="mr-2" />
                  {loading ? "Processing..." : "Confirm Change"}
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
