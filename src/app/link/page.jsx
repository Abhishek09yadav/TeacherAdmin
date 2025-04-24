"use client";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../../lib/axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { MdDelete } from "react-icons/md";
import { FaLink } from "react-icons/fa";
import Pagination from "@/components/Pagination";
import { FaSearch } from "react-icons/fa";
import { useDebounce } from "@/hooks/useDebounce";

export default function LinksPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLinks, setFilteredLinks] = useState([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLinks.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/links/links");
      setLinks(response.data);
      setFilteredLinks(response.data); // Set filtered links to all links initially
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if(debouncedSearchTerm !== undefined){
      const filtered = links.filter((link) =>
        link.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredLinks(filtered);
      setCurrentPage(1); 
    }
  }, [debouncedSearchTerm, links]);

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!newLinkName.trim() || !newLinkUrl.trim()) return;

    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure you want to add this link?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const response = await axiosInstance.post("/links/link", {
                name: newLinkName,
                link: newLinkUrl,
              });


              toast.success("Link added successfully!");
              setNewLinkName("");
              setNewLinkUrl("");
              setShowAddForm(false);
              fetchLinks();

            } catch (error) {
              console.error("Error adding link:", error);
              toast.error("Error adding link. Please try again.");
            }
          }
        },
        { label: 'No' }
      ]
    });
  };

  const handleDelete = (id) => {
    console.log("delete", id);
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this link?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const response = await axiosInstance.delete(`/links/link/${id}`);

              toast.success("Link deleted successfully!");
              fetchLinks();

            } catch (error) {
              console.error("Error deleting link:", error);
              toast.error("Error deleting link. Please try again.");
            }
          }
        },
        { label: 'No' }
      ]
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-end m-5">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowAddForm(true)}
          style={{ boxShadow: 'inset rgb(0 105 125) 2px 2px 5px, inset rgb(82 255 255) -1px -2px 3px' }}
        >
          Add Link
        </button>
      </div>

      {showAddForm && (
        <LinkForm
          title="Add New Link"
          linkName={newLinkName}
          setLinkName={setNewLinkName}
          linkUrl={newLinkUrl}
          setLinkUrl={setNewLinkUrl}
          onSave={handleAddLink}
          onCancel={() => setShowAddForm(false)}
        />
      )}
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
            ) : filteredLinks.length === 0 ? (
              <tr>
                <td colSpan="3" className="border px-4 py-2 text-center">
                  {searchTerm ? "No matching results found." : "No links found."}
                </td>
              </tr>
            ) : (
              currentItems.map((link, index) => (
                <tr key={link._id || index} className="hover:bg-gray-50 text-center">
                  <td className="border px-4 py-2">{indexOfFirstItem + index + 1}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => window.open(link.secure_url, "_blank")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded mx-auto"
                      style={{ boxShadow: 'inset rgb(0 105 125) 2px 2px 5px, inset rgb(82 255 255) -1px -2px 3px' }}
                    >
                      <FaLink /> {link.title}
                    </button>
                  </td>
                  <td className="border px-4 py-2 ">
                    <button
                      onClick={() => handleDelete(link._id)}
                      className="flex items-center gap-3 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded mx-auto"
                      style={{
                        boxShadow: "inset 2px 2px 2px #ad2929, inset -2px -2px 3px #ff8e8e"
                      }}
                    >
                      <MdDelete />Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination
          usersPerPage={itemsPerPage}
          totalUsers={filteredLinks.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}

const LinkForm = ({ title, linkName, setLinkName, linkUrl, setLinkUrl, onSave, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <form onSubmit={onSave} className="space-y-4">
          <input
            type="text"
            value={linkName}
            onChange={(e) => setLinkName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter link name"
            required
          />
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Link URL"
            required
          />
          <div className="flex justify-center space-x-10">
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded">
              Save
            </button>
            <button type="button" onClick={onCancel} className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-2 rounded">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
