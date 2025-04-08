'use client';
import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { axiosInstance } from '../../../../lib/axios';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [update, setUpdate] = useState(false);
  const [updateUser, setUpdateUser] = useState(null);

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get('/auth/users');
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(value) ||
        user.phoneNumber.includes(value)
    );

    setFilteredUsers(filtered);
  };

  const handleSelectedUser = (user) => {
    setSelectedUser(user);
    setUpdateUser({
      name: user.name,
      email: user.email,
      aadhar: user.aadhar,
      phoneNumber: user.phoneNumber
    })
  };
const handleDeleteUser = async (userId) => {
  try {
    axiosInstance.delete()
  }
  catch (error) {}
}
  return (
    <div className="w-full max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-6 relative top-10">
    {/* Left side: Table */}
    <div className="flex-1 flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        All Teachers
      </h2>
  
      {/* Search */}
      <div className="mb-6 flex border border-gray-300 rounded-md shadow-sm w-full sm:w-3/4 md:w-2/3">
        <IoIosSearch className="text-gray-400 m-3 text-2xl" />
        <input
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name or phone number"
          className="w-full outline-none p-2 text-sm"
        />
      </div>
  
      {/* Table */}
      <div className="w-full sm:w-11/12 md:w-3/4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 shadow-sm border rounded-lg text-sm">
          <thead className="bg-blue-100 text-blue-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">S. No</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-700">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleSelectedUser(user)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-gray-500 py-6">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  
    {/* Right side: Profile Card */}
    {selectedUser && (
      <div
        className={`transition-all duration-500 z-20 bg-white shadow-lg border rounded-lg p-6 fixed top-0 right-0 h-full overflow-auto 
        ${selectedUser ? 'w-full sm:w-[80%] md:w-[60%] lg:w-[55%]' : 'w-0 overflow-hidden'}`}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setSelectedUser(null);
            setUpdateUser(null);
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
            alt={updateUser.name}
            className="w-40 h-40 mt-4 rounded-full object-cover border-2 border-blue-400"
          />
        </div>
  
        {/* Info */}
        <div className="text-center space-y-3">
          <p className="text-2xl font-semibold text-gray-800">{updateUser.name}</p>
          <p className="text-base text-gray-600">
            <strong>Phone:</strong>
            <input
              className="ms-2 border-b outline-none"
              type="text"
              value={updateUser.phoneNumber}
              onChange={(e) => update && setUpdateUser({ ...updateUser, phoneNumber: e.target.value })}
            />
          </p>
          <p className="text-base text-gray-600">
            <strong>Aadhar:</strong>
            <input
              className="ms-2 border-b outline-none"
              type="text"
              value={updateUser.aadhar}
              onChange={(e) => update && setUpdateUser({ ...updateUser, aadhar: e.target.value })}
            />
          </p>
          <p className="text-base text-gray-600">
            <strong>Email:</strong>
            <input
              className="ms-2 border-b outline-none"
              type="text"
              value={updateUser.email}
              onChange={(e) => update && setUpdateUser({ ...updateUser, email: e.target.value })}
            />
          </p>
        </div>
  
        <div className="flex justify-center flex-wrap gap-4 my-6">
          {/* {!update ? (
            <button
              onClick={() => setUpdate(true)}
              className="flex items-center gap-3 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded"
            >
              Update
            </button>
          ) : (
            <button
              onClick={() => setUpdate(true)}
              className="flex items-center gap-3 px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded"
            >
              Save
            </button>
          )} */}
          <button className="flex items-center gap-3 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded">
            Delete
          </button>
        </div>
      </div>
    )}
  </div>
  
  );
};

export default UserTable;
