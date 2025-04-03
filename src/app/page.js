"use client";
import { useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import './view-teacher.css'

export default function Home() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [monthsToShow, setMonthsToShow] = useState(2);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    const updateMonths = () => {
      setMonthsToShow(window.innerWidth < 768 ? 1 : 2);
    };

    updateMonths(); // Call initially to set correct value

    window.addEventListener('resize', updateMonths);
    return () => window.removeEventListener('resize', updateMonths);
  }, []);

  useEffect(() => {
    if (teachers.length > 0) {
      filterTeachers();
    }
  }, [selectedTeacher, dateRange, teachers]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const mockData = [
        { id: 1, name: "Teacher 2024-A", date: "2023-10-01", batch: "Batch 1", sub: "Math", chapter: "Algebra", topic: "Equations" },
        { id: 2, name: "Teacher 2024-B", date: "2023-10-02", batch: "Batch 2", sub: "Science", chapter: "Physics", topic: "Mechanics" },
        { id: 3, name: "Teacher 2024-C", date: "2023-10-03", batch: "Batch 3", sub: "History", chapter: "Medieval", topic: "Crusades" },
        { id: 4, name: "Teacher 2024-D", date: "2023-10-04", batch: "Batch 4", sub: "English", chapter: "Literature", topic: "Shakespeare" },
        { id: 5, name: "Teacher 2024-E", date: "2023-10-05", batch: "Batch 5", sub: "Art", chapter: "Painting", topic: "Impressionism" },
      ];
      setTeachers(mockData);
      setFilteredTeachers(mockData);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherChange = (e) => {
    setSelectedTeacher(e.target.value);
  };

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const filterTeachers = () => {
    const { startDate, endDate } = dateRange[0];
    const filtered = teachers.filter((teacher) => {
      const teacherDate = new Date(teacher.date);
      const isWithinDateRange = teacherDate >= startDate && teacherDate <= endDate;
      const isMatchingTeacher = selectedTeacher === "" || teacher.name === selectedTeacher;
      return isWithinDateRange && isMatchingTeacher;
    });
    setFilteredTeachers(filtered);
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center">
      <div className="mt-10 max-w-lg w-full mb-4">
        <label htmlFor="teacher-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Teacher
        </label>
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

        <div className="w-full flex justify-center">
          <DateRangePicker
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            months={monthsToShow}
            direction="horizontal"
            onChange={handleSelect}
            rangeColors={["#3b82f6"]}
            editableDateInputs={true}
            staticRanges={[]}
            inputRanges={[]}
          />
        </div>

        <div className="w-full justify-center overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 whitespace-nowrap">S.No.</th>
                <th className="border px-4 py-2 whitespace-nowrap">Teacher Name</th>
                <th className="border px-4 py-2 whitespace-nowrap">Date</th>
                <th className="border px-4 py-2 whitespace-nowrap">Batch</th>
                <th className="border px-4 py-2 whitespace-nowrap">Subject</th>
                <th className="border px-4 py-2 whitespace-nowrap">Chapter</th>
                <th className="border px-4 py-2 whitespace-nowrap">Topic</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="border px-4 py-2 text-center">Loading...</td>
                </tr>
              ) : filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="border px-4 py-2 text-center">No teachers found</td>
                </tr>
              ) : (
                filteredTeachers.map((teacher, index) => (
                  <tr key={teacher.id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2 whitespace-nowrap">{index + 1}</td>
                    <td className="border px-4 py-2 whitespace-nowrap">{teacher.name}</td>
                    <td className="border px-4 py-2 whitespace-nowrap">{teacher.date}</td>
                    <td className="border px-4 py-2 whitespace-nowrap">{teacher.batch}</td>
                    <td className="border px-4 py-2 whitespace-nowrap">{teacher.sub}</td>
                    <td className="border px-4 py-2 whitespace-nowrap">{teacher.chapter}</td>
                    <td className="border px-4 py-2 whitespace-nowrap">{teacher.topic}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
    </div>
  );
}
