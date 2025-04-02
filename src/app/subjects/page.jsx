"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { axiosInstace } from "../../../lib/axios";

export default function SubjectesPage() {
  const [Subjectes, setSubjectes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");

  // This useEffect will be used to fetch data when the component mounts
  useEffect(() => {
    fetchSubjectes();
  }, []);

  // Function to fetch Subjectes from API
  const fetchSubjectes = async () => {
    try {
      setLoading(true);
      // Replace mock data with actual API call using axios
      const response = await axiosInstace.get("/subject/get-subjects");
      setSubjectes(response.data); // Use the response data
    } catch (error) {
      console.error("Error fetching Subjectes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    try {
      // Make an API request to add a new subject
      const response = await axiosInstace.post("/subject/add-subject", {
        subjectName: newSubjectName,
      });

      // If successful, add the new subject to the list
      if (response.status === 200) {
        setSubjectes([...Subjectes, response.data]); 
        setNewSubjectName("");
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Error adding Subject:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subjectes</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowAddForm(true)}
        >
          Add Subject
        </button>
      </div>

      {showAddForm && (
        <div className="w-lg mx-auto mb-6 p-4 border rounded-lg bg-gray-50">
          <form onSubmit={handleAddSubject} className="space-y-4">
            <div>
              <label
                htmlFor="SubjectName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subject Name
              </label>
              <input
                type="text"
                id="SubjectName"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Subject name"
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
                  setNewSubjectName("");
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
            ) : Subjectes.length === 0 ? (
              <tr>
                <td colSpan="2" className="border px-4 py-2 text-center">
                  No Subjectes found
                </td>
              </tr>
            ) : (
              Subjectes.map((Subject, index) => (
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
