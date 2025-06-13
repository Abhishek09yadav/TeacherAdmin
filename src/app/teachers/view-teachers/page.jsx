"use client";
import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { axiosInstance } from "../../../../lib/axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { getAllCenters, getAllUsers, updateUserCenter } from "../../../../server/common";
import { CiEdit } from "react-icons/ci";
import { IoMdSave } from "react-icons/io";
import Pagination from "@/components/Pagination";
import Loader from "@/components/Loader";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [update, setUpdate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const res = await getAllUsers(); // Await the promise

      if (res && res.data && Array.isArray(res.data)) {
        setUsers(res.data);
        setFilteredUsers(res.data);
      } else {
        setUsers([]);
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    console.log("Fetching users...");
    fetchUsers();
  }, []);

  useEffect(() => {
    async function fetchCenters() {
      try {
        const res = await getAllCenters();
        setCenters(res && res.data ? res.data : []);
        console.log("Fetched centers:", res.data);

      } catch (error) {
        console.error("Error fetching centers:", error);
        setCenters([]);
      }
    }
    fetchCenters();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setCurrentPage(1);
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(value) ||
        user.phoneNumber.includes(value)
    );

    setFilteredUsers(filtered);
  };
  // console.log(selectedUser);

  // const handleSelectedUser = (user) => {
  //   console.log(user);

  //   setSelectedUser(user._id);
  //   console.log(selectedUser);

  //   setUpdateUser({
  //     name: user.name,
  //     email: user.email,
  //     aadhar: user.aadhar,
  //     phoneNumber: user.phoneNumber,
  //     centerName: user.centerName || "",
  //   });
  //   // setUpdate(false); // Ensure edit mode is off by default
  // };

  const handleDelete = async (id) => {
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure you want to add this batch?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            setLoading(true);
            try {
              if (selectedUser.role !== "admin") {
                await axiosInstance.delete(`/auth/user/delete/${id}`);
                setSelectedUser(null);
                toast.success("User deleted successfully!");
                fetchUsers();
              } else {
                toast.error("Cannot Delete Admin.");
              }
            } catch (e) {
              console.log(e);
              toast.error("Error deleting user. Please try again.");
            } finally{
              setLoading(false);
            }
          },
        },
        {
          label: "No",
          onClick: () => toast.info("Deletion Cancelled !"),
        },
      ],
    });
  };

  const handleUpdateCenter = async () => {
    // console.log("Updating center for user:", selectedUser._id, selectedUser.centerName);
    // setUpdate(false)
    try {
      // setUpdateUser({ ...updateUser, centerName: e.target.value })
      // console.log(selectedUser._id, selectedCenter);
      const object = { userId: selectedUser._id, centerName: selectedCenter };
      const data = await updateUserCenter(object);
      fetchUsers();
      //  console.log(data);

      const updatedUser = users.map((user) => {
        if (user._id === selectedUser._id) {
          return { ...user, centerName: selectedCenter };
        }
        return user;
      });

      setUsers(updatedUser);

      toast.success("Center updated!");
    } catch (error) {
      toast.error("Error updating center.");
    }
  }

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-6 relative top-10 ">
      {/* Left side: Table */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          All Teachers
        </h2>

        {/* Search */}
        <div className="mb-6 flex border border-gray-300 rounded-md shadow-sm w-full sm:w-3/4 md:w-2/3 bg-white">
          <IoIosSearch className="text-gray-400 m-3 text-2xl" />
          <input
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by name or phone number"
            className="w-full outline-none p-2 text-sm"
          />
        </div>

        {/* Table */}
        <div className="w-full sm:w-11/12 md:w-3/4 overflow-x-auto mb-10">
          <table className="min-w-full divide-y divide-gray-200 shadow-sm border rounded-lg text-sm">
            <thead className=" bg-blue-100 text-blue-700">
              <tr className="">
                <th className="px-4 py-3 text-center font-semibold">S. No</th>
                <th className="px-4 py-3 text-center font-semibold">Name</th>
                <th className="px-4 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="3" className="text-center py-6">
                    <Loader size="40px" color="#3B82F6" />
                  </td>
                </tr>
              ) : currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-700 text-center">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800 text-center">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 flex justify-center">
                      <button
                        onClick={() => { setSelectedUser(user); }}
                        className=" bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md mx-auto"
                        style={{
                          boxShadow:
                            "inset rgb(0 105 125) 2px 2px 5px, inset rgb(82 255 255) -1px -2px 3px",
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-gray-500 py-6">
                        {loading && <Loader size="25px" color="#fff" />}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination
            usersPerPage={usersPerPage}
            totalUsers={filteredUsers.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </div>

      {/* Right side: Profile Card */}
      {selectedUser && (
        <div
          className={`transition-all duration-500 z-20 bg-white shadow-lg border rounded-lg p-6 fixed top-0 right-0 h-full overflow-auto 
        ${selectedUser
              ? "w-full sm:w-[80%] md:w-[60%] lg:w-[55%]"
              : "w-0 overflow-hidden"
            }`}
        >
          {/* Close Button */}
          <button
            onClick={() => {
              setSelectedUser(null);
              setUpdate(false);
            }}
            className="absolute top-5 right-5 text-gray-500 hover:text-red-500 text-xl font-bold"
          >
            <IoCloseOutline className="text-2xl" />
          </button>

          <div className="text-2xl text-center font-semibold mb-4 relative top-5">
            Teacher Information
          </div>

          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <img
              src={selectedUser.secure_url}
              alt={selectedUser?.name || "image"}
              className="w-40 h-40 mt-4 rounded-full object-cover border-2 border-blue-400"
            />
          </div>

          {/* Info */}
          <div className="text-center space-y-3">
            <p className="text-2xl font-semibold text-gray-800">
              {selectedUser?.name || "Unable to fetch"}
            </p>
            <p className="text-base text-gray-600">
              <strong>Phone:</strong>
              <input
                className="ms-2 border-b outline-none"
                type="text"
                value={selectedUser?.phoneNumber || "Unable to fetch"}
                readOnly
              />
            </p>
            <p className="text-base text-gray-600">
              <strong>Aadhar:</strong>
              <input
                className="ms-2 border-b outline-none"
                type="text"
                value={selectedUser?.aadhar ? selectedUser?.aadhar?.replace(/\d(?=\d{4})/g, "X") : ""}
                readOnly
              />
            </p>
            <p className="text-base text-gray-600">
              <strong>Email:</strong>
              <input
                className="ms-2 border-b outline-none"
                type="text"
                value={selectedUser?.email || "Unable to fetch"}
                readOnly
              />
            </p>
            <div className="flex items-center justify-center ml-12">
              <p className="text-base text-gray-600 flex items-center">
                <strong>Center:</strong>
                <select
                  className="ms-2 border-b outline-none bg-white"
                  defaultValue={selectedUser?.centerName || ""}
                  disabled={!update}
                  onChange={(e) => {
                    setSelectedCenter(e.target.value)
                  }}
                >
                  <option value="" >No center alloted</option>
                  {Array.isArray(centers) &&
                    centers.map((center) => (
                      <option key={center._id} value={center.name}>
                        {center.name}
                      </option>
                    ))}
                </select>
              </p>
              {update ? (
                <button
                  className="hover:cursor-pointer bg-blue-600 p-1 rounded-lg ml-4"
                  onClick={handleUpdateCenter}
                  type="button"
                >
                  <IoMdSave className="text-white" size={25} />
                </button>
              ) : (
                <button
                  className="hover:cursor-pointer bg-green-600 p-1 rounded-lg ml-4"
                  onClick={() => setUpdate(true)}
                  type="button"
                >
                  <CiEdit className="text-white" size={25} />
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-center flex-wrap gap-4 my-6">
            <button
              style={{
                boxShadow:
                  "inset 2px 2px 2px #ad2929, inset -2px -2px 3px #ff8e8e",
              }}
              className="flex items-center gap-3 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded"
              onClick={() => handleDelete(selectedUser._id)}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
