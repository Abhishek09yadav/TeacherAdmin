'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function BatchesPage() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBatchName, setNewBatchName] = useState('');

  useEffect(() => {
    fetchBatches();
  }, []);

  const API_BASE_URL = 'https://teacher-backend-fxy3.onrender.com/api/class/classes';

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL);
      setBatches(response.data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBatch = async (e) => {
    e.preventDefault();
    if (!newBatchName.trim()) return;

    try {
      const response = await axios.post(API_BASE_URL, {
        className: newBatchName
      });
      
      setBatches([...batches, { id: response.data.id, name: response.data.className }]);
      setNewBatchName('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding batch:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Batches</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowAddForm(true)}
        >
          Add Batch
        </button>
      </div>

      {showAddForm && (
        <div className="w-lg mx-auto mb-6 p-4 border rounded-lg bg-gray-50">
          <form onSubmit={handleAddBatch} className="space-y-4">
            <div>
              <label htmlFor="batchName" className="block text-sm font-medium text-gray-700 mb-1">
                Batch Name
              </label>
              <input
                type="text"
                id="batchName"
                value={newBatchName}
                onChange={(e) => setNewBatchName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter batch name"
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewBatchName('');
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto w-lg mx-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">S.No.</th>
              <th className="border px-4 py-2 text-left">Batch Name</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="2" className="border px-4 py-2 text-center">
                  Loading...
                </td>
              </tr>
            ) : batches.length === 0 ? (
              <tr>
                <td colSpan="2" className="border px-4 py-2 text-center">
                  No batches found
                </td>
              </tr>
            ) : (
              batches.map((batch, index) => (
                <tr key={batch.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{batch.name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}