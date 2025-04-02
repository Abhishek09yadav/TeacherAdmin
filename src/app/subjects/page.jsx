'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SubjectesPage() {
  const [Subjectes, setSubjectes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  useEffect(() => {
    fetchSubjectes();
  }, []);

  const API_BASE_URL = 'https://teacher-backend-fxy3.onrender.com/api/class/classes';

  const fetchSubjectes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_BASE_URL);
      setSubjectes(response.data);
    } catch (error) {
      console.error('Error fetching Subjectes:', error);
      setError('Failed to load Subjectes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    try {
      const response = await axios.post(API_BASE_URL, {
        className: newSubjectName
      });
      
      setSubjectes([...Subjectes, { id: response.data.id, name: response.data.className }]);
      setNewSubjectName('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding Subject:', error);
      setError('Failed to add Subject. Please try again.');
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

      {error && (
        <div className="mb-4 text-red-500 font-medium bg-red-100 p-2 rounded">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="w-lg mx-auto mb-6 p-4 border rounded-lg bg-gray-50">
          <form onSubmit={handleAddSubject} className="space-y-4">
            <div>
              <label htmlFor="SubjectName" className="block text-sm font-medium text-gray-700 mb-1">
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
                  setNewSubjectName('');
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
      <tr key={Subject.id || `Subject-${index}`} className="hover:bg-gray-50">
        <td className="border px-4 py-2">{index + 1}</td>
        <td className="border px-4 py-2">{Subject.name}</td>
      </tr>
    ))
  )}
</tbody>

        </table>
      </div>
    </div>
  );
}
