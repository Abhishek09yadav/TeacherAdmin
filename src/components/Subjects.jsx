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
  getAllSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
} from "../../server/common";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [toggleSubjects, setToggleSubjects] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [editSubjectId, setEditSubjectId] = useState(null);
  const [editSubjectName, setEditSubjectName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(filteredSubjects)
    ? filteredSubjects.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (debouncedSearchTerm !== undefined) {
      const filtered = subjects.filter((subject) =>
        subject.subjectName
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredSubjects(filtered);
      setCurrentPage(1);
    }
  }, [subjects, debouncedSearchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // for fetching subjects
  useEffect(() => {
    fetchSubjects();
  }, [toggleSubjects]);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
          const data = await getAllSubjects();
          const validData = Array.isArray(data) ? data : [];
          setSubjects(validData);
          setFilteredSubjects(validData);
          setCurrentPage(1);

    } catch (error) {
      console.error(
        "Error fetching subjects:",
        error.response?.data || error.message
      );
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
              await addSubject(newSubjectName);

              toast.success("Subject added successfully!");
              setNewSubjectName("");
              setToggleSubjects((prev) => !prev);
              setShowAddForm(false);
            } catch (error) {
              console.error("Error adding subject:", error);
              toast.error("Error adding subject. Please try again.");
            }
          },
        },
        {
          label: "No",
          onClick: () => toast.info("Subject addition cancelled!"),
        },
      ],
    });
  };

  const openEditPopup = (id, currentName) => {
    setEditSubjectId(id);
    setEditSubjectName(currentName);
    setShowEditForm(true);
  };

  const handleEdit = async (id, newName) => {
    if (!newName || newName.trim() === "") {
      toast.warning("Subject name cannot be empty.");
      return;
    }

    try {
      await updateSubject(id, newName);
      toast.success("Subject updated successfully!");
      setToggleSubjects((prev) => !prev);
      setShowEditForm(false);
    } catch (error) {
      console.error("Error updating subject:", error);
      toast.error("Error updating subject. Please try again.");
    }
  };

  const handleDelete = (id) => {
    console.log("wefewswr " + id);

    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this subject?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await deleteSubject(id);
              toast.success("Subject deleted successfully!");
              fetchSubjects();
            } catch (error) {
              console.error("Error deleting subject:", error);
              toast.error("Error deleting subject. Please try again.");
            }
          },
        },
        { label: "No" },
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
          Add Subject
        </button>
      </div>

      {showAddForm && (
        <SubjectForm
          title="Add New Subject"
          subjectName={newSubjectName}
          setSubjectName={setNewSubjectName}
          onSave={handleAddSubject}
          submitLabel="Add"
          onCancel={() => {
            setShowAddForm(false);
            setNewSubjectName("");
          }}
        />
      )}

      {showEditForm && (
        <SubjectForm
          title="Edit Subject"
          subjectName={editSubjectName}
          setSubjectName={setEditSubjectName}
          submitLabel="Update"
          onSave={(e) => {
            e.preventDefault();
            handleEdit(editSubjectId, editSubjectName);
          }}
          onCancel={() => setShowEditForm(false)}
        />
      )}
      {/* Search bar */}
      <div className="mb-6 flex items-center justify-center">
        <div className="relative w-full sm:w-3/4 md:w-1/2">
          <input
            type="text"
            placeholder="Search subjects..."
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
              <th className="border px-4 py-2 text-center">Subject Name</th>
              <th className="border px-4 py-2 text-center">Actions</th>
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
            ) : filteredSubjects.length === 0 ? (
              <tr>
                <td colSpan="3" className="border px-4 py-2 text-center">
                  {searchTerm
                    ? "No matching subjects found"
                    : "No subjects found"}
                </td>
              </tr>
            ) : (
              currentItems.map((subject, index) => (
                <tr key={subject._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-center">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {subject.subjectName}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <ActionButtons
                      subject={subject}
                      handleDelete={handleDelete}
                      handleEdit={openEditPopup}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination
          usersPerPage={itemsPerPage}
          totalUsers={filteredSubjects.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}

const ActionButtons = ({ subject, handleDelete, handleEdit }) => {
  return (
    <div className="flex space-x-4 justify-center">
      <button
        style={{
          boxShadow:
            "inset rgb(0 105 125) 2px 2px 5px, inset rgb(82 255 255) -1px -2px 3px",
        }}
        onClick={() => handleEdit(subject._id, subject.subjectName)}
        className="flex items-center gap-3 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded"
      >
        <FaEdit />
        Edit
      </button>
      <button
        style={{
          boxShadow: "inset 2px 2px 2px #ad2929, inset -2px -2px 3px #ff8e8e",
        }}
        onClick={() => handleDelete(subject._id)}
        className="flex items-center gap-3 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded"
      >
        <MdDelete />
        Delete
      </button>
    </div>
  );
};

const SubjectForm = ({
  title,
  subjectName,
  setSubjectName,
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
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter subject name"
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
