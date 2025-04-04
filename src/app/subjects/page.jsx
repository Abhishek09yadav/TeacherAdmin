"use client";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../../lib/axios"; 
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css'; 

export default function SubjectsPage() { 
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [toggleSubjects, setToggleSubjects] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");

// This useEffect will be used to fetch data when the component mounts
  useEffect(() => {
    fetchSubjects();
  }, [toggleSubjects]);

  // Function to fetch Subjects from API
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/subject/get-subjects");
      if (response.status === 200 && Array.isArray(response.data)) {
        setSubjects(response.data);
      } else {
        console.warn("Unexpected response:", response);
        setSubjects([]);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error.response?.data || error.message);
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
      message: "Are you sure you want to add this subject?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const response = await axiosInstance.post("/subject/add-subject", {
                subjectName: newSubjectName,
              });

              if (response.status === 200 || response.status === 201) {
                toast.success("Subject added successfully!");
                setNewSubjectName("");
                setToggleSubjects((prev) => !prev);
                setShowAddForm(false);
              }
            } catch (error) {
              console.error("Error adding subject:", error);
              toast.error("Error adding subject. Please try again.");
            }
          },
        },
        {
          label: "No",
          onClick: () => alert("Subject addition cancelled!"),
        },
      ],
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-end m-5">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowAddForm(true)}
        >
          Add Subject
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add New Subject</h2>
            <form onSubmit={handleAddSubject} className="space-y-4">
              <div>
                <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  id="subjectName"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter subject name"
                  required
                />
              </div>
              <div className="flex justify-center space-x-10">
                <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewSubjectName("");
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
              <th className="border px-4 py-2 text-left">Subject Name</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="2" className="border px-4 py-2 text-center">
                  <span className="animate-pulse">Loading...</span>
                </td>
              </tr>
            ) : subjects.length === 0 ? (
              <tr>
                <td colSpan="2" className="border px-4 py-2 text-center">No subjects found</td>
              </tr>
            ) : (
              subjects.map((subject, index) => (
                <tr key={subject._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{subject.subjectName}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
