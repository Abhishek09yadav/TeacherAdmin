"use client";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../../lib/axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';
import { MdDelete } from "react-icons/md";

export default function LinksPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/links/links");
      if (response.status === 200) {
        setLinks(response.data);
      }
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  };

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
              const response = await axiosInstance.post("/link", {
                name: newLinkName,
                link: newLinkUrl,
              });

              if (response.status === 200) {
                toast.success("Link added successfully!");
                setNewLinkName("");
                setNewLinkUrl("");
                setShowAddForm(false);
                fetchLinks();
              }
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
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this link?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const response = await axiosInstance.delete(`/link/${id}`);
              if (response.status === 200) {
                toast.success("Link deleted successfully!");
                fetchLinks();
              }
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

      <div className="overflow-x-scroll lg:overflow-x-auto lg:w-lg mx-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">S.No.</th>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="border px-4 py-2 text-center">
                  Loading...
                </td>
              </tr>
            ) : links.length === 0 ? (
              <tr>
                <td colSpan="3" className="border px-4 py-2 text-center">
                  No links found
                </td>
              </tr>
            ) : (
              links.map((link, index) => (
                <tr key={link._id || index} className="hover:bg-gray-50 text-center">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">
                    <button
                      href={link.secure_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded"
                    >
                      {link.title}
                    </button>
                  </td>
                  <td className="border px-4 py-2 flex justify-center">
                    <button
                      onClick={() => handleDelete(link._id)}
                      className="flex items-center gap-3 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded"
                    >
                      <MdDelete />Delete
                    </button>
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
