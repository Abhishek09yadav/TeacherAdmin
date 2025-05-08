// changes: subject → class
"use client";
import { useState, useEffect } from "react";

import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "@/components/Pagination";
import { FaSearch } from "react-icons/fa";
import { useDebounce } from "@/hooks/useDebounce";
import Loader from "@/components/Loader";
import {
  getAllClasses,
  addModulePdfClass,
  // updateClass,
  // deleteClass,
} from "../../../server/common";

export default function classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [toggleClasses, setToggleClasses] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [editClassId, setEditClassId] = useState(null);
  const [editClassName, setEditClassName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClasses, setFilteredClasses] = useState([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(filteredClasses)
    ? filteredClasses.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (debouncedSearchTerm !== undefined) {
      const filtered = classes.filter((cls) =>
        cls.className.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );

      setFilteredClasses(filtered);
      setCurrentPage(1);
    }
  }, [classes, debouncedSearchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    fetchClasses();
  }, [toggleClasses]);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const data = await getAllClasses();
      const validData = Array.isArray(data) ? data : [];
      setClasses(validData);
      setFilteredClasses(validData);
      setCurrentPage(1);
    } catch (error) {
      console.error(
        "Error fetching classes:",
        error.response?.data || error.message
      );
      toast.error("Failed to load classes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    confirmAlert({
      title: "Confirm Submission",
      message: "Are you sure you want to add this class?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await addModulePdfClass(newClassName);

              toast.success("Class added successfully!");
              setNewClassName("");
              setToggleClasses((prev) => !prev);
              setShowAddForm(false);
            } catch (err) {
              toast.error(
                err?.response?.data?.error ||
                  err?.message ||
                  "Failed to add class"
              );
              console.log(err);
            }
          },
        },
        {
          label: "No",
          onClick: () => toast.info("Class addition cancelled!"),
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
          style={{
            boxShadow:
              "inset rgb(0 105 125) 2px 2px 5px, inset rgb(82 255 255) -1px -2px 3px",
          }}
        >
          Add Class
        </button>
      </div>

      {showAddForm && (
        <ClassForm
          title="Add New Class"
          placeholder="Enter class name"
          classNameValue={newClassName}
          setClassName={setNewClassName}
          onSave={handleAddClass}
          submitLabel="Add"
          onCancel={() => {
            setShowAddForm(false);
            setNewClassName("");
          }}
        />
      )}

      <div className="mb-6 flex items-center justify-center">
        <div className="relative w-full sm:w-3/4 md:w-1/2">
          <input
            type="text"
            placeholder="Search classes..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute right-3 top-2.5 text-gray-400">
            <FaSearch />
          </span>
        </div>
      </div>

      <div className="overflow-x-scroll lg:overflow-x-auto lg:w-lg mx-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-center">S.No.</th>
              <th className="border px-4 py-2 text-center">Class Name</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="border px-4 py-2 text-center">
                  <span className="animate-pulse">
                    <Loader size={30} color="#3B82F6" />
                  </span>
                </td>
              </tr>
            ) : filteredClasses.length === 0 ? (
              <tr>
                <td colSpan="3" className="border px-4 py-2 text-center">
                  {searchTerm
                    ? "No matching classes found"
                    : "No classes found"}
                </td>
              </tr>
            ) : (
              currentItems.map((cls, index) => (
                <tr key={cls._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-center">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {cls.className}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination
          usersPerPage={itemsPerPage}
          totalUsers={filteredClasses.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}

const ClassForm = ({
  title,
  classNameValue,
  setClassName,
  onSave,
  onCancel,
  submitLabel,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <form onSubmit={onSave} className="space-y-4">
          <input
            type="text"
            value={classNameValue}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter class name"
            required
          />
          <div className="flex justify-center space-x-10">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded"
            >
              {submitLabel}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
