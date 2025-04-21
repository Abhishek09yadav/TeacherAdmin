"use client";
import { useState, useEffect } from "react";

import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { axiosInstance } from "../../lib/axios";

export default function Center() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [toggleSubjects, setToggleSubjects] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");

  const [showEditForm, setShowEditForm] = useState(false);
  const [editSubjectId, setEditSubjectId] = useState(null);
  const [editSubjectName, setEditSubjectName] = useState("");

  useEffect(() => {
    fetchSubjects();
  }, [toggleSubjects]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/subject/get-subjects");
      if (response.status === 200 && Array.isArray(response.data)) {
        setSubjects(response.data);
      } else {
        setSubjects([]);
      }
    } catch (error) {
      toast.error("Failed to load subjects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    confirmAlert({
      title: "Confirm Submission",
      message: "Are you sure you want to add this center?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const response = await axiosInstance.post("/subject/add-subject", {
                subjectName: newSubjectName,
              });
              if (response.status === 200 || response.status === 201) {
                toast.success("Center added successfully!");
                setNewSubjectName("");
                setToggleSubjects(prev => !prev);
                setShowAddForm(false);
              }
            } catch (error) {
              toast.error("Error adding center. Please try again.");
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

  const openEditPopup = (id, currentName) => {
    setEditSubjectId(id);
    setEditSubjectName(currentName);
    setShowEditForm(true);
  };

  const handleEdit = async (id, newName) => {
    if (!newName || newName.trim() === "") {
      toast.warning("Center name cannot be empty.");
      return;
    }

    try {
      const response = await axiosInstance.put(`/subject/update-subject/${id}`, {
        subjectName: newName,
      });

      if (response.status === 200) {
        toast.success("Center updated successfully!");
        setToggleSubjects(prev => !prev);
        setShowEditForm(false);
      }
    } catch (error) {
      toast.error("Error updating center. Please try again.");
    }
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this center?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const response = await axiosInstance.delete(`/subject/delete-subject?subjectId=${id}`);
              if (response.status === 200) {
                toast.success("Center deleted successfully!");
                fetchSubjects();
              }
            } catch (error) {
              toast.error("Error deleting center. Please try again.");
            }
          }
        },
        { label: 'No' }
      ]
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-end m-5">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowAddForm(true)}
          style={{boxShadow:'inset rgb(0 105 125) 2px 2px 5px, inset rgb(82 255 255) -1px -2px 3px'}}
        >
          Add Center
        </button>
      </div>

      {showAddForm && (
        <SubjectForm
          title="Add New Center"
          subjectName={newSubjectName}
          setSubjectName={setNewSubjectName}
          onSave={handleAddSubject}
          submitLabel="Add"
          onCancel={() => {
            setShowAddForm(false);
            setNewSubjectName("");
          }}
        />
      )}

      {showEditForm && (
        <SubjectForm
          title="Edit Center"
          subjectName={editSubjectName}
          setSubjectName={setEditSubjectName}
          submitLabel="Update"
          onSave={(e) => {
            e.preventDefault();
            handleEdit(editSubjectId, editSubjectName);
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
              <th className="border px-4 py-2 text-center">Center Description</th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="border px-4 py-2 text-center">
                  <span className="animate-pulse">Loading...</span>
                </td>
              </tr>
            ) : subjects.length === 0 ? (
              <tr>
                <td colSpan="3" className="border px-4 py-2 text-center">No centers found</td>
              </tr>
            ) : (
              subjects.map((subject, index) => (
                <tr key={subject._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  <td className="border px-4 py-2 text-center">
                    <span className="flex items-center justify-center gap-2">
                      {subject.subjectName}
                      <button
                        style={{
                          boxShadow: "inset rgb(0 105 125) 2px 2px 5px, inset rgb(82 255 255) -1px -2px 3px"
                        }}
                        onClick={() => openEditPopup(subject._id, subject.subjectName)}
                        className="flex items-center gap-1 px-2 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded text-xs"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>
                    </span>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <span className="flex items-center justify-center gap-2">
                      {subject.subjectName}
                      <button
                        style={{
                          boxShadow: "inset rgb(0 105 125) 2px 2px 5px, inset rgb(82 255 255) -1px -2px 3px"
                        }}
                        onClick={() => openEditPopup(subject._id, subject.subjectName)}
                        className="flex items-center gap-1 px-2 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded text-xs"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>
                    </span>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      style={{
                        boxShadow:"inset 2px 2px 2px #ad2929, inset -2px -2px 3px #ff8e8e"
                      }}
                      onClick={() => handleDelete(subject._id)}
                      className="flex mx-auto items-center gap-3 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded"
                    >
                      <MdDelete />Delete
                    </button>
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

const SubjectForm = ({ title, subjectName, setSubjectName, onSave, onCancel, submitLabel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <form onSubmit={onSave} className="space-y-4">
          <input
            type="text"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter center name"
            required
          />
          <div className="flex justify-center space-x-10">
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded">
              {submitLabel}
            </button>
            <button type="button" onClick={onCancel} className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-2 rounded">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}