"use client";
import { useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./view-teacher.css";
import { axiosInstance } from "../../lib/axios";

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
  const [teacherList, setTeacherList] = useState([]);

  useEffect(() => {
    fetchTeachers();
    fetchTeacherList();
  }, []);

  useEffect(() => {
    const updateMonths = () => {
      setMonthsToShow(window.innerWidth < 768 ? 1 : 2);
    };

    updateMonths(); // Call initially to set correct value

    window.addEventListener("resize", updateMonths);
    return () => window.removeEventListener("resize", updateMonths);
  }, []);

  useEffect(() => {
    if (teachers.length > 0) {
      filterTeachers();
    }
  }, [selectedTeacher, dateRange, teachers]);

  // Fetch teachers from the API
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/schedule/schedules");
      const scheduleData = response.data; // The response contains the schedule data

      // Map over the schedule data and format it to match the previous structure
      const formattedData = scheduleData.map((item) => ({
        id: item._id,
        name: item.userId.name,
        date: new Date(item.date).toLocaleDateString(),
        batch: item.className || "N/A",
        sub: item.subjectName,
        chapter: item.chapterName,
        topic: item.topic,
      }));

      setTeachers(formattedData);
      setFilteredTeachers(formattedData);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch teacher list from the API
  const fetchTeacherList = async () => {
    try {
      const response = await axiosInstance.get("/auth/users");
      const usersData = response.data;

      // Filter users to include only those with the role "user"
      const filteredUsers = usersData.filter((user) => user.role === "user");

      // Map over the users data to format it for the dropdown
      const formattedUsers = filteredUsers.map((user) => ({
        id: user._id,
        name: user.name,
      }));

      setTeacherList(formattedUsers);
    } catch (error) {
      console.error("Error fetching teacher list:", error);
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
      const isWithinDateRange =
        teacherDate >= startDate && teacherDate <= endDate;
      const isMatchingTeacher =
        selectedTeacher === "" || teacher.name === selectedTeacher;
      return isWithinDateRange && isMatchingTeacher;
    });
    setFilteredTeachers(filtered);
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center">
      <div className="mt-10 max-w-lg w-full mb-4">
        <label
          htmlFor="teacher-select"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Teacher
        </label>
        <select
          id="teacher-select"
          value={selectedTeacher}
          onChange={handleTeacherChange}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">All Teachers</option>
          {teacherList.map((teacher) => (
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
              <th className="border px-4 py-2 whitespace-nowrap">
                Teacher Name
              </th>
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
                <tr key={teacher.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2 whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    {teacher.name}
                  </td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    {teacher.date}
                  </td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    {teacher.batch}
                  </td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    {teacher.sub}
                  </td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    {teacher.chapter}
                  </td>
                  <td className="border px-4 py-2 whitespace-nowrap">
                    {teacher.topic}
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
