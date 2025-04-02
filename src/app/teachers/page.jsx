'use client';
import { useState, useEffect } from 'react';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [filteredTeachers, setFilteredTeachers] = useState([]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (selectedTeacher) {
      const filtered = teachers.filter(teacher => teacher.name === selectedTeacher);
      setFilteredTeachers(filtered);
    } else {
      setFilteredTeachers(teachers);
    }
  }, [selectedTeacher, teachers]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);

      const mockData = [
        { id: 1, name: 'Teacher 2024-A', date: '2023-10-01', batch: 'Batch 1', sub: 'Math', chapter: 'Algebra', topic: 'Equations' },
        { id: 2, name: 'Teacher 2024-B', date: '2023-10-02', batch: 'Batch 2', sub: 'Science', chapter: 'Physics', topic: 'Mechanics' },
        { id: 3, name: 'Teacher 2024-C', date: '2023-10-03', batch: 'Batch 3', sub: 'History', chapter: 'Medieval', topic: 'Crusades' },
        { id: 4, name: 'Teacher 2024-D', date: '2023-10-04', batch: 'Batch 4', sub: 'English', chapter: 'Literature', topic: 'Shakespeare' },
        { id: 5, name: 'Teacher 2024-E', date: '2023-10-05', batch: 'Batch 5', sub: 'Art', chapter: 'Painting', topic: 'Impressionism' },
      ];
      setTeachers(mockData);
      setFilteredTeachers(mockData);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherChange = (e) => {
    setSelectedTeacher(e.target.value);
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <button htmlFor="teacher-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Teacher
        </button>
        <select
          id="teacher-select"
          value={selectedTeacher}
          onChange={handleTeacherChange}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">All Teachers</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.name}>
              {teacher.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto w-3xl mx-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">S.No.</th>
              <th className="border px-4 py-2 text-left">Teacher Name</th>
              <th className="border px-4 py-2 text-left">Date</th>
              <th className="border px-4 py-2 text-left">Batch</th>
              <th className="border px-4 py-2 text-left">Subject</th>
              <th className="border px-4 py-2 text-left">Chapter</th>
              <th className="border px-4 py-2 text-left">Topic</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="border px-4 py-2 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredTeachers.length === 0 ? (
              <tr>
                <td colSpan="7" className="border px-4 py-2 text-center">
                  No teachers found
                </td>
              </tr>
            ) : (
              filteredTeachers.map((teacher, index) => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{teacher.name}</td>
                  <td className="border px-4 py-2">{teacher.date}</td>
                  <td className="border px-4 py-2">{teacher.batch}</td>
                  <td className="border px-4 py-2">{teacher.sub}</td>
                  <td className="border px-4 py-2">{teacher.chapter}</td>
                  <td className="border px-4 py-2">{teacher.topic}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}