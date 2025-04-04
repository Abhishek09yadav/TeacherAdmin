"use client";
import { useState, useEffect, useCallback } from "react";
import { axiosInstance } from "../../../lib/axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export default function BatchesPage() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBatchName, setNewBatchName] = useState("");
  const [toggleBatches, setToggleBatches] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, [toggleBatches]);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/class/classes");
      if (response.status === 200) {
        setBatches(response.data);
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBatch = async (e) => {
    e.preventDefault();

    if (!newBatchName.trim()) return;
    
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure to do this.',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const response = await axiosInstance.post("/class/classes", {
                className: newBatchName,
              });
           
              if (response.status === 201) {
                toast.success("Batch added successfully!");
                setNewBatchName("");
                setToggleBatches((prev) => !prev);
                setShowAddForm(false);
              }
            } catch (error) {
              console.error("Error adding batch:", error);
              toast.error("Error adding batch. Please try again.");
            }
          }
        },
        {
          label: 'No',
          onClick: () => alert('Batch addition cancelled !')
        }
      ]
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-end m-5">
        <button
          className="block right-10 lg:mr-0 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowAddForm(true)}
        >
          Add Batch
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add New Batch</h2>
            <form onSubmit={handleAddBatch} className="space-y-4">
              <div>
                <label
                  htmlFor="batchName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
              <div className="flex justify-center space-x-10">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded"
                  onClick={handleAddBatch}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewBatchName("");
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form> 
          </div>
        </div>
      )}

      <div className="overflow-x-scroll lg:overflow-x-auto lg:w-lg mx-auto">
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
                <tr key={batch.id || index} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{batch.className}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}