"use client";
import { useState, useEffect } from "react";

import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  addCenter,
  deleteCenter,
  getAllCenters,
  updateCenter,
} from "../../server/common";

export default function Center() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [toggleCenters, setToggleCenters] = useState(false);
  const [newCenterName, setNewCenterName] = useState("");
  const [newCenterDescription, setNewCenterDescription] = useState("");

  const [showEditForm, setShowEditForm] = useState(false);
  const [editCenterId, setEditCenterId] = useState(null);
  const [editCenterName, setEditCenterName] = useState("");
  const [editCenterDescription, setEditCenterDescription] = useState("");

  useEffect(() => {
    fetchCenters();
  }, [toggleCenters]);

const fetchCenters = async () => {
  try {
    const response = await getAllCenters();
    setCenters(response || []);
  } catch (error) {
    toast.error("Error fetching centers. Please try again.");
  } finally {
    setLoading(false);
  }
};


  const handleAddCenter = async (e) => {
    e.preventDefault();
    if (!newCenterName.trim()) return;

    confirmAlert({
      title: "Confirm Submission",
      message: "Are you sure you want to add this center?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await addCenter(newCenterName, newCenterDescription);
              toast.success("Center added successfully!");
              setToggleCenters((prev) => !prev);
              setShowAddForm(false);
              setNewCenterName("");
              setNewCenterDescription("");
            } catch (error) {
              // toast.error("Error adding center. Please try again.");
              toast.error(
                error?.response?.data?.message || "Error adding center."
              );

            }
          },
        },
        {
          label: "No",
          onClick: () => toast.info("Center addition cancelled!"),
        },
      ],
    });
  };

  const openEditPopup = (id, currentName, currentDescription) => {
    setEditCenterId(id);
    setEditCenterName(currentName);
    setEditCenterDescription(currentDescription);
    setShowEditForm(true);
  };

  const handleEdit = async (id, newName, newDescription) => {
    if (!newName.trim()) {
      toast.warning("Center name cannot be empty.");
      return;
    }

    try {
      const response = await updateCenter(id, {
        name: newName,
        description: newDescription,
      });
        toast.success("Center updated successfully!");
        setToggleCenters((prev) => !prev);
        setShowEditForm(false);
    } catch (error) {
      toast.error("Error updating center. Please try again.");
    }
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this center?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const response = await deleteCenter(id);
              toast.success("Center deleted successfully!");
              setToggleCenters((prev) => !prev);
            } catch (error) {
              toast.error("Error deleting center. Please try again.");
            }
          },
        },
        { label: "No" },
      ],
    });
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
          Add Center
        </button>
      </div>

      {showAddForm && (
        <CenterForm
          title="Add New Center"
          centerName={newCenterName}
          setCenterName={setNewCenterName}
          centerDescription={newCenterDescription}
          setCenterDescription={setNewCenterDescription}
          onSave={handleAddCenter}
          submitLabel="Add"
          onCancel={() => {
            setShowAddForm(false);
            setNewCenterName("");
            setNewCenterDescription("");
          }}
        />
      )}

      {showEditForm && (
        <CenterForm
          title="Edit Center"
          centerName={editCenterName}
          setCenterName={setEditCenterName}
          centerDescription={editCenterDescription}
          setCenterDescription={setEditCenterDescription}
          submitLabel="Update"
          onSave={(e) => {
            e.preventDefault();
            handleEdit(editCenterId, editCenterName, editCenterDescription);
          }}
          onCancel={() => setShowEditForm(false)}
        />
      )}

      <div className="overflow-x-scroll lg:overflow-x-auto lg:w-3xl mx-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-center">S.No.</th>
              <th className="border px-4 py-2 text-center">Center Name</th>
              <th className="border px-4 py-2 text-center">
                Center Description
              </th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="border px-4 py-2 text-center">
                  <span className="animate-pulse">Loading...</span>
                </td>
              </tr>
            ) : centers.length === 0 ? (
              <tr>
                <td colSpan="4" className="border px-4 py-2 text-center">
                  No centers found
                </td>
              </tr>
            ) : (
              centers.map((center, index) => (
                <tr key={center._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  <td className="border px-4 py-2 text-center">
                    {center.name}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {center.description}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        style={{
                          boxShadow:
                            "inset rgb(0 105 125) 2px 2px 5px, inset rgb(82 255 255) -1px -2px 3px",
                        }}
                        onClick={() =>
                          openEditPopup(
                            center._id,
                            center.name,
                            center.description
                          )
                        }
                        className="flex items-center gap-1 px-2 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded text-xs"
                        title="Edit"
                      >
                        Edit <FaEdit size={16} />
                      </button>
                      <button
                        style={{
                          boxShadow:
                            "inset 2px 2px 2px #ad2929, inset -2px -2px 3px #ff8e8e",
                        }}
                        onClick={() => handleDelete(center._id)}
                        className="flex items-center gap-1 px-2 py-2 text-white bg-red-500 hover:bg-red-600 rounded text-xs"
                        title="Delete"
                      >
                        Delete <MdDelete size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const CenterForm = ({
  title,
  centerName,
  setCenterName,
  centerDescription,
  setCenterDescription,
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
            value={centerName}
            onChange={(e) => setCenterName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter center name"
            required
          />
          <textarea
            value={centerDescription}
            onChange={(e) => setCenterDescription(e.target.value)}
            placeholder="Enter center description"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
