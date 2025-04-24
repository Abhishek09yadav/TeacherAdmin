"use client";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../../lib/axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { FaFilePdf } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "@/components/Pagination";
import { FaSearch } from "react-icons/fa";
import { useDebounce } from "@/hooks/useDebounce";

export default function PdfListPage() {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); // NEW
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    file: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPdfs, setFilteredPdfs] = useState([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPdfs.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // for fetching pdfs
  useEffect(() => {
    fetchPdfs();
  }, []);

  // for searching pdfs
  useEffect(() => {
    if(debouncedSearchTerm !== undefined){
      const filtered = pdfs.filter((pdf) =>
        pdf.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredPdfs(filtered);
      setCurrentPage(1); 
    }
  }, [debouncedSearchTerm, pdfs]);

  const fetchPdfs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/pdf/pdfs");
      setPdfs(
        response.data.map((pdf) => ({
          ...pdf,
          url: `/${pdf.secure_url}`,
        }))
      );
      setFilteredPdfs(response.data); // Set filtered PDFs to all PDFs initially
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching PDFs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this PDF?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const response = await axiosInstance.delete(`/pdf/pdf/${id}`);

              toast.success("PDF deleted successfully!");
              fetchPdfs();

            } catch (error) {
              console.error("Error deleting PDF:", error);
              toast.error("Error deleting PDF. Please try again.");
            }
          },
        },
        { label: "No" },
      ],
    });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.file) {
      toast.error("Please provide both name and file.");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("name", formData.name);
    uploadData.append("pdf", formData.file);
    setUploading(true); // Start loading

    try {
      const response = await axiosInstance.post("/pdf/pdf", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });


      toast.success("PDF uploaded successfully!");
      setShowModal(false);
      setFormData({ name: "", file: null });
      fetchPdfs();

    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload PDF.");
    } finally {
      setUploading(false); // End loading
    }
  };

  return (
    <div className="p-6">
      {/* Add PDF Button */}
      <div className="mb-4 text-right">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setShowModal(true)}
          style={{
            boxShadow:
              "inset rgb(0 105 125) 2px 2px 5px, inset rgb(82 255 255) -1px -2px 3px",
          }}
        >
          Add PDF
        </button>
      </div>

      {/* Search Bar */}
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

      {/* Table */}
      <div className="overflow-x-scroll lg:overflow-x-auto lg:w-lg mx-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-center">S.No.</th>
              <th className="border px-4 py-2 text-center">Name</th>
              <th className="border px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="border px-4 py-2 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredPdfs.length === 0 ? (
              <tr>
                <td colSpan="3" className="border px-4 py-2 text-center">
                  {searchTerm ? "No matching results found." : "No PDFs found."}
                </td>
              </tr>
            ) : (
              currentItems.map((pdf, index) => (
                <tr
                  key={pdf.id || index}
                  className="hover:bg-gray-50 text-center"
                >
                  <td className="border px-4 py-2">{indexOfFirstItem + index + 1}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() =>
                        window.open(
                          `${process.env.NEXT_PUBLIC_PDF_URL}${pdf.url}`,
                          "_blank"
                        )
                      }
                      className="flex gap-2 items-center px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded mx-auto"
                      style={{
                        boxShadow:
                          "inset rgb(0 105 125) 2px 2px 5px, inset rgb(82 255 255) -1px -2px 3px",
                      }}
                    >
                      <FaFilePdf />
                      {pdf.name}
                    </button>
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDelete(pdf._id)}
                      className="flex gap-2 items-center px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded mx-auto"
                      style={{
                        boxShadow:
                          "inset 2px 2px 2px #ad2929, inset -2px -2px 3px #ff8e8e",
                      }}
                    >
                      <MdDelete /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination
          usersPerPage={itemsPerPage}
          totalUsers={filteredPdfs.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md">
            <h2 className=" text-2xl font-semibold mb-4 text-center">
              Add PDF
            </h2>

            <label className="block mb-2 text-sm font-medium">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />

            <label className="block mb-2 text-sm font-medium">Upload PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />

            <div className="flex justify-center space-x-10">
              <button
                onClick={handleSave}
                className={`px-4 py-2 text-white rounded ${uploading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                  }`}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Save"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                disabled={uploading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
