"use client";
import { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { axiosInstance } from "../../lib/axios";
import { IoSearch } from "react-icons/io5";
import { toast } from "react-toastify";
import { useRef } from "react";

export default function Home() {
  const [teacherList, setTeacherList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [tempRange, setTempRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
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
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef();

  const filteredTeachers = teacherList.filter((t) =>
    t.name.toLowerCase().includes(searchInput.toLowerCase())
  );
  useEffect(() => {
    fetchTeacherList();
    dailySchedule();
    const updateMonths = () => {
      setMonthsToShow(window.innerWidth < 768 ? 1 : 2);
    };
    updateMonths();
    window.addEventListener("resize", updateMonths);
    return () => window.removeEventListener("resize", updateMonths);
  }, []);

  const dailySchedule = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/schedule/all-schedules-today");
      const data = response.data.map((item) => ({
        id: item._id,
        name: item.userId.name,
        date: new Date(item.date).toLocaleDateString(),
        subject: item.subjectName,
        center: item.centerName ?? "no center found",
        batch: item.className,
        chapter: item.chapterName,
        topic: item.topic,
      }));
      setMessage(data.length === 0 ? "No data found" : "");
      setTeachersData(data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setMessage("No schedule found");
        toast.warning(err?.response?.data?.message, {
          position: "bottom-left",
          theme: "light",
        });
      } else {
        setMessage("Something went wrong");
        toast.error("Something went wrong", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherList = async () => {
    try {
      const res = await axiosInstance.get("/auth/users");
      const formatted = res.data.map((user) => ({
        id: user._id,
        name: user.name,
      }));
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
        `/schedule/schedules/user/date?userId=${teacher.id}&start=${
          startDate.toLocaleDateString().split("T")[0]
        }&end=${endDate.toLocaleDateString().split("T")[0]}`
      );
      const data = response.data.map((item) => ({
        id: item._id,
        name: teacher.name,
        date: new Date(item.date).toLocaleDateString(),
        subject: item.subjectName,
        batch: item.className,
        center: item.centerName ?? "no center found",
        chapter: item.chapterName,
        topic: item.topic,
      }));
      setMessage(data.length === 0 ? "No data found" : "");
      setTeachersData(data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setMessage("No schedule found");
        toast.warning(err?.response?.data?.message, {
          position: "top-center",
          theme: "light",
        });
      } else {
        setMessage("Something went wrong");
        toast.error("Something went wrong", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 py-6 flex flex-col items-center justify-center">
      {/* Filter Section */}
      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Teacher</label>
          {/* <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Type to search..."
            className="p-2 border rounded-md bg-white"
            list="teacher-list"
          />
          <datalist id="teacher-list">
            {teacherList.map((teacher) => (
              <option key={teacher.id} value={teacher.name} />
            ))}
          </datalist> */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowDropdown(true);
              }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              onFocus={() => setTimeout(() => setShowDropdown(true), 200)}
              placeholder="Type to search..."
              className="p-2 border rounded-md bg-white w-full"
            />
            {showDropdown && filteredTeachers.length > 0 && (
              <ul className="absolute z-10 bg-white border mt-1 rounded-md shadow max-h-40 overflow-auto text-sm w-full">
                {filteredTeachers.map((teacher) => (
                  <li
                    key={teacher.id}
                    className="px-3 py-1 hover:bg-blue-100 cursor-pointer"
                    onMouseDown={() => {
                      setSearchInput(teacher.name);
                      setShowDropdown(false);
                    }}
                  >
                    {teacher.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Start Date</label>
          <input
            type="text"
            value={dateRange.startDate ? dateRange.startDate.toLocaleDateString() : ""}
            className="p-2 border rounded-md bg-gray-100"
            readOnly
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">End Date</label>
          <input
            type="text"
            value={dateRange.endDate ? dateRange.endDate.toLocaleDateString() : ""}
            className="p-2 border rounded-md bg-gray-100"
            readOnly
          />
        </div>

        <div className="flex flex-col justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Select Date
          </button>
        </div>

        <div className="flex flex-col justify-end">
          <button
            onClick={handleSearch}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 flex justify-center items-center"
          >
            <IoSearch className="text-lg" />
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-white p-4 rounded-md shadow-md w-[95vw] max-w-full overflow-auto">
            <DateRangePicker
              showSelectionPreview
              moveRangeOnFirstSelection={false}
              retainEndDateOnFirstSelection={true}
              onChange={(ranges) => setTempRange(ranges.selection)}
              months={monthsToShow}
              direction={monthsToShow === 1 ? "vertical" : "horizontal"}
              rangeColors={["#3b82f6"]}
              editableDateInputs={true}
              ranges={[tempRange]}
            />
            <div className="mt-2 flex flex-col sm:flex-row justify-end gap-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setTempRange({
                    startDate: new Date(),
                    endDate: new Date(),
                    key: "selection",
                  });
                }}
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

      {/* Table Section */}
      <div className="w-full max-w-7xl overflow-x-auto">
        <table className="min-w-[700px] sm:min-w-full table-fixed border border-gray-300 shadow-md rounded-lg text-sm text-center">
          <thead className="sticky top-0 bg-gray-200">
            <tr>
              <th className="border px-2 py-2">S.No.</th>
              <th className="border px-2 py-2">Date</th>
              <th className="border px-2 py-2">Teacher</th>
              <th className="border px-2 py-2">Center</th>
              <th className="border px-2 py-2">Batch</th>
              <th className="border px-2 py-2">Subject</th>
              <th className="border px-2 py-2">Chapter</th>
              <th className="border px-2 py-2">Topic</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-4">
                  Loading...
                </td>
              </tr>
            ) : message ? (
              <tr>
                <td colSpan={8} className="p-4 text-gray-600 font-medium">
                  {message}
                </td>
              </tr>
            ) : (
              teachersData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-100">
                  <td className="border px-2 py-2 truncate">{index + 1}</td>
                  <td className="border px-2 py-2 truncate">{item.date}</td>
                  <td className="border px-2 py-2 truncate">{item.name}</td>
                  <td className="border px-2 py-2 truncate">{item.center}</td>
                  <td className="border px-2 py-2 truncate">{item.batch}</td>
                  <td className="border px-2 py-2 truncate">{item.subject}</td>
                  <td className="border px-2 py-2 truncate">{item.chapter}</td>
                  <td className="border px-2 py-2 truncate">{item.topic}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
