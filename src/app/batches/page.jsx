"use client";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../../lib/axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "@/components/Pagination";
import { FaSearch } from "react-icons/fa";
import { useDebounce } from "@/hooks/useDebounce";

export default function BatchesPage() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBatchName, setNewBatchName] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [editBatchId, setEditBatchId] = useState(null);
  const [editBatchName, setEditBatchName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBatches.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // for fetching batches
  useEffect(() => {
    fetchBatches();
  }, []);

  // for debouncing the search term
  useEffect(() => {
    if (debouncedSearchTerm !== undefined) {
      const filtered = batches.filter((batch) =>
        batch.className.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredBatches(filtered);
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, batches]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/class/classes");
      setBatches(response.data);
      setFilteredBatches(response.data);
      setCurrentPage(1); 
    } catch (error) {
      console.error("Error fetching batches:", error);
      toast.error("Error fetching batches");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBatch = async (e) => {
    e.preventDefault();
    if (!newBatchName.trim()) return;

    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure you want to add this batch?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const response = await axiosInstance.post("/class/classes", {
                className: newBatchName,
              });

              if (response.status === 201) {
                toast.success("Batch added successfully!");
                setNewBatchName("");
                setShowAddForm(false);
                fetchBatches();
              }
            } catch (error) {
              console.error("Error adding batch:", error);
              toast.error("Error adding batch. Please try again.");
            }
          },
        },
        { label: "No" },
      ],
    });
  };

  const handleDelete = (id) => {
    console.log(id);

    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this batch?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const response = await axiosInstance.delete(
                `/class/classes/${id}`
              );

              toast.success("Batch deleted successfully!");
              fetchBatches();
            } catch (error) {
              console.error("Error deleting batch:", error);
              toast.error("Error deleting batch. Please try again.");
            }
          },
        },
        { label: "No" },
      ],
    });
  };

  // Open Edit Popup
  const openEditPopup = (id, currentName) => {
    // console.log("Editing Batch ID:", id);
    setEditBatchId(id);
    setEditBatchName(currentName);
    setShowEditForm(true);
  };

  // Handle Edit Batch Submit
  const handleEditBatch = async (e) => {
    e.preventDefault();
    if (!editBatchName.trim()) return;

    try {
      const response = await axiosInstance.put(
        `/class/classes/${editBatchId}`,
        {
          className: editBatchName,
        }
      );

      toast.success("Batch updated successfully!");
      setShowEditForm(false);
      fetchBatches();
    } catch (error) {
      console.error("Error updating batch:", error);
      toast.error("Error updating batch. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-end m-5">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowAddForm(true)}
          style={{
            boxShadow:
              "inset rgb(0 105 125) 2px 2px 5px, inset rgb(82 255 255) -1px -2px 3px",
          }}
        >
          Add Batch
        </button>
      </div>

      {/* Add Batch Modal */}
      {showAddForm && (
        <BatchForm
          title="Add New Batch"
          batchName={newBatchName}
          submitLabel="Add"
          setBatchName={setNewBatchName}
          onSave={handleAddBatch}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Edit Batch Modal */}
      {showEditForm && (
        <BatchForm
          title="Edit Batch"
          batchName={editBatchName}
          submitLabel="Update"
          setBatchName={setEditBatchName}
          onSave={handleEditBatch}
          onCancel={() => setShowEditForm(false)}
        />
      )}

      {/* Search Bar */}
      <div className="mb-6 flex items-center justify-center">
        <div className="relative w-full sm:w-3/4 md:w-1/2">
          <input
            type="text"
            placeholder="Search batches..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute right-3 top-2.5 text-gray-400">
            <FaSearch />
          </span>
        </div>
      </div>

      {/* Batch Table */}
      <div className="overflow-x-scroll lg:overflow-x-auto lg:w-lg mx-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-center">S.No.</th>
              <th className="border px-4 py-2 text-center">Batch Name</th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="border px-4 py-2 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredBatches.length === 0 ? (
              <tr>
                <td colSpan="3" className="border px-4 py-2 text-center">
                  {searchTerm ? "No matching batches found" : "No batches found"}
                </td>
              </tr>
            ) : (
              currentItems.map((batch, index) => (
                <tr
                  key={batch.id || index}
                  className="hover:bg-gray-50 text-center"
                >
                  <td className="border px-4 py-2">{indexOfFirstItem + index + 1}</td>
                  <td className="border px-4 py-2">{batch.className}</td>
                  <td className="border px-4 py-2">
                    <ActionButtons
                      batch={batch}
                      handleDelete={handleDelete}
                      handleEdit={openEditPopup}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination 
          usersPerPage={itemsPerPage}
          totalUsers={filteredBatches.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}

const ActionButtons = ({ batch, handleDelete, handleEdit }) => {
  return (
    <div className="flex space-x-8 justify-center">
      <button
        onClick={() => handleEdit(batch._id, batch.className)}
        className="flex items-center gap-3 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded"
        style={{
          boxShadow:
            "inset rgb(0 105 125) 2px 2px 5px, inset rgb(82 255 255) -1px -2px 3px",
        }}
      >
        <FaEdit />
        Edit
      </button>
      <button
        onClick={() => handleDelete(batch._id)}
        className="flex items-center gap-3 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded"
        style={{
          boxShadow: "inset 2px 2px 2px #ad2929, inset -2px -2px 3px #ff8e8e",
        }}
      >
        <MdDelete />
        Delete
      </button>
    </div>
  );
};

// Reusable Modal for Add/Edit Batch
const BatchForm = ({
  title,
  batchName,
  setBatchName,
  onSave,
  onCancel,
  submitLabel,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <form onSubmit={onSave} className="space-y-4">
          <input
            type="text"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter batch name"
            required
          />
          <div className="flex justify-center space-x-10">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded"
            >
              {submitLabel}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
