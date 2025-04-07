"use client";
import { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { axiosInstance } from "../../lib/axios";
import { IoSearch } from "react-icons/io5";
import { toast } from "react-toastify";


export default function Home() {
  const [teacherList, setTeacherList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [tempRange, setTempRange] = useState({
    startDate: null,
    endDate: null,
    key: "selection",
  });
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [teachersData, setTeachersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [monthsToShow, setMonthsToShow] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTeacherList();
    const updateMonths = () => {
      setMonthsToShow(window.innerWidth < 768 ? 1 : 2);
    };
    updateMonths();
    window.addEventListener("resize", updateMonths);
    return () => window.removeEventListener("resize", updateMonths);
  }, []);

  const fetchTeacherList = async () => {
    try {
      const res = await axiosInstance.get("/auth/users");
      const users = res.data.filter((user) => user.role === "user");
      const formatted = users.map((user) => ({ id: user._id, name: user.name }));
      setTeacherList(formatted);
    } catch (err) {
      console.error("Failed to fetch teachers", err);
    }
  };

  const handleConfirm = () => {
    setDateRange({
      startDate: tempRange.startDate,
      endDate: tempRange.endDate,
    });
    setIsModalOpen(false);
  };

  const handleSearch = async () => {
    const teacher = teacherList.find(
      (t) => t.name.toLowerCase() === searchInput.toLowerCase()
    );
    const { startDate, endDate } = dateRange;

    console.log(teacher, startDate, endDate);
    
    if (!teacher) {
      setMessage("Please select a teacher");
      setTeachersData([]);
      return;
    }

    if (!startDate || !endDate) {
      setMessage("Select Date Range also");
      setTeachersData([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/schedule/schedules/user/date?userId=${teacher.id}&start=${startDate.toISOString().split("T")[0]}&end=${endDate.toISOString().split("T")[0]}`
      );

      const data = response.data.map((item) => ({
        id: item._id,
        name: item.userId.name,
        date: new Date(item.date).toLocaleDateString(),
        subject: item.subjectName,
        chapter: item.chapterName,
        topic: item.topic,
      }));

      setMessage(data.length === 0 ? "No data found" : "");
      setTeachersData(data);
    } catch (err) {
      console.error("Error fetching data", err);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl flex flex-wrap gap-4 items-end justify-center mb-6">
        <div className="flex flex-col w-full sm:w-1/4">
          <label className="mb-1 text-sm font-medium">Teacher</label>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Type to search..."
            className="p-2 border rounded-md"
            list="teacher-list"
          />
          <datalist id="teacher-list">
            {teacherList.map((teacher) => (
              <option key={teacher.id} value={teacher.name} />
            ))}
          </datalist>
        </div>

        <div className="flex flex-col w-full sm:w-1/6">
          <label className="mb-1 text-sm font-medium">Start Date</label>
          <input
            type="text"
            value={dateRange.startDate ? dateRange.startDate.toLocaleDateString() : ""}
            className="p-2 border rounded-md bg-gray-100"
            readOnly
          />
        </div>

        <div className="flex flex-col w-full sm:w-1/6">
          <label className="mb-1 text-sm font-medium">End Date</label>
          <input
            type="text"
            value={dateRange.endDate ? dateRange.endDate.toLocaleDateString() : ""}
            className="p-2 border rounded-md bg-gray-100"
            readOnly
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Select Date
        </button>

        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <IoSearch className="text-lg"/>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-md shadow-md">
            <DateRangePicker
              showSelectionPreview
              moveRangeOnFirstSelection={false}
              retainEndDateOnFirstSelection={true}
              onChange={(ranges) => setTempRange(ranges.selection)}
              months={monthsToShow}
              direction="horizontal"
              rangeColors={["#3b82f6"]}
              editableDateInputs={true}
              ranges={[tempRange]}
            />
            <div className="mt-2 flex justify-end gap-8">
              <button
                onClick={() => {setIsModalOpen(false); setTempRange({startDate: null, endDate: null, key: "selection"})}}
                className="px-5 py-2 text-white bg-red-600 rounded hover:bg-red-500"
              >
                Close
              </button>
              <button
                onClick={handleConfirm}
                className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-500"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full">
        <table className="min-w-full table-fixed border border-gray-300 shadow-md rounded-lg text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2 w-1/12">S.No.</th>
              <th className="border px-4 py-2 w-2/12">Teacher Name</th>
              <th className="border px-4 py-2 w-2/12">Date</th>
              <th className="border px-4 py-2 w-2/12">Subject</th>
              <th className="border px-4 py-2 w-2/12">Chapter</th>
              <th className="border px-4 py-2 w-3/12">Topic</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-4">Loading...</td>
              </tr>
            ) : message ? (
              <tr>
                <td colSpan="6" className="p-4 text-gray-600 font-medium">{message}</td>
              </tr>
            ) : (
              teachersData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border px-4 py-2">{item.date}</td>
                  <td className="border px-4 py-2">{item.subject}</td>
                  <td className="border px-4 py-2">{item.chapter}</td>
                  <td className="border px-4 py-2">{item.topic}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}