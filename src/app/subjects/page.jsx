"use client";
import { useState, useEffect } from "react";
import { axiosInstace } from "../../../lib/axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css'; 

export default function SubjectsPage() {
  const [Subjects, setSubjects] = useState([]);
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
      
      const response = await axiosInstace.get("/subject/get-subjects");
      if (response.status === 200 && Array.isArray(response.data)) {
        setSubjects(response.data);
      } else {
        console.warn("Unexpected response:", response);
        setSubjects([]);
      }
    } catch (error) {
      console.error("Error fetching Subjects:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure to do this.",
      buttons: [{
        label: "Yes",
        onClick: async () => {
          try {
            const response = await axiosInstace.post("/subject/add-subject", {
              subjectName: newSubjectName,
            });
            if (response.status === 200) {
              toast.success("Subject added successfully!");
             
              setNewSubjectName("");
              setToggleSubjects((prev) => !prev); 
              setShowAddForm(false);
            }
          } catch (error) {
            console.error("Error adding Subject:", error);
            toast.error("Error adding Subject. Please try again.");
          }
        }
      },
      {
        label: 'No',
        onClick: () => alert('Subject addition cancelled !')
      }
    ]})};

  return (
    <div className="p-6">
      <div className="flex justify-end m-5">
        <button
          className="block right-10 lg:mr-0 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
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
              <label
                htmlFor="subjectName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
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
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded"
              >
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
                  Loading...
                </td>
              </tr>
            ) : Subjects.length === 0 ? (
              <tr>
                <td colSpan="2" className="border px-4 py-2 text-center">
                  No Subjects found
                </td>
              </tr>
            ) : (
              Subjects.map((Subject, index) => (
                <tr key={Subject._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{Subject.subjectName}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
