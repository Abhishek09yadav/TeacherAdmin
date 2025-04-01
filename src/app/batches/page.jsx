'use client';
import { useState, useEffect } from 'react';

export default function BatchesPage() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // This useEffect will be used to fetch data when component mounts
  useEffect(() => {
    fetchBatches();
  }, []);

  // Function to fetch batches from API
  const fetchBatches = async () => {
    try {
      setLoading(true);
      // When you have your API ready, replace this with actual API call
      // Example: const response = await fetch('your-api-endpoint/batches');
      // const data = await response.json();
      
      // Temporary mock data - replace this with your API call later
      const mockData = [
        { id: 1, name: 'Batch 2024-A' },
        { id: 2, name: 'Batch 2024-B' },
        { id: 3, name: 'Batch 2024-C' },
        { id: 4, name: 'Batch 2024-D' },
        { id: 5, name: 'Batch 2024-E' },
      ];
      setBatches(mockData);
    } catch (error) {
      console.error('Error fetching batches:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Batches</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            // Add batch functionality will be implemented here
            console.log('Add batch clicked');
          }}
        >
          Add Batch
        </button>
      </div>

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
