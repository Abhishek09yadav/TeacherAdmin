'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoIosSearch } from "react-icons/io";

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
        const res = await axios.get('http://localhost:8080/api/auth/users');
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

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8  gap-6 ">
      {/* Left side: Table */}
      {/* <div className='relative'> */}
      <div className="flex-1 px-auto flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          All Teachers
        </h2>

        {/* Search */}
        <div className="mb-6 flex border border-gray-300 rounded-md shadow-sm w-full md:w-2/3">
          <IoIosSearch className="text-gray-400 m-3 text-2xl" />
          <input
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by name or phone number"
            className="w-full outline-none p-2 text-sm"
          />
        </div>

        {/* Table */}
        <div className="w-3/4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 shadow-sm border rounded-lg">
            <thead className="bg-blue-100 text-blue-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">S. No</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {user.name}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleSelectedUser(user)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1 rounded-md"
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
        <div className={` transition-all duration-700  h-screen bg-white shadow-lg border rounded-lg p-6 absolute top-0 right-0  ${selectedUser ? 'max-w-[55%]' : 'w-0 overflow-hidden'}`}>
          {/* Close Button */}
          <button
            onClick={() => { setSelectedUser(null); setUpdateUser(null); setUpdate(false) }}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
          >
            ×
          </button>

          <div className='text-2xl text-center font-semibold mb-4'>
            Teacher Information
          </div>

          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <img
              src={selectedUser.secure_url}
              alt={updateUser.name}
              className="w-[24%] h-[24%] mt-10 rounded-full object-cover border-2 border-blue-400"
            />
          </div>

          {/* Info */}
          <div className="text-center space-y-2">
            <p className="text-3xl font-semibold text-gray-800">{updateUser.name}</p>
            <p className="text-lg text-gray-600"><strong>Phone:</strong>
              <input className='ms-4' type="text" value={updateUser.phoneNumber}
                onChange={(e) => {
                  if (update) {
                    setUpdateUser({ ...updateUser, phoneNumber: e.target.value })
                  }
                  else {
                    return;
                  }
                }
                }
              />
            </p>
            <p className="text-lg text-gray-600"><strong>Aadhar:</strong> <input onChange={(e) => {
              if (update) {
                setUpdateUser({ ...updateUser, aadhar: e.target.value })
              } else {
                return;
              }
            }
            } className='ms-4' type="text" value={updateUser.aadhar} /></p>
            <p className="text-lg text-gray-600"><strong>Email:</strong><input onChange={(e) => {
              if (update) {
                setUpdateUser({ ...updateUser, email: e.target.value })
              } else {
                return;
              }
            }
            } className='ms-4' type="text" value={updateUser.email} /></p>
          </div>

          <div className='flex justify-center gap-4 my-4'>
            {
              !update ? (<button onClick={() => setUpdate(true)} className={`flex items-center gap-3 px-4 py-2 text-white  bg-blue-500 hover:bg-blue-600 rounded`} >Update</button>) : (<button onClick={() => setUpdate(true)} className={`flex items-center gap-3 px-4 py-2 text-white  bg-green-500 hover:bg-green-600 rounded`} >Save</button>)
            }


            <button className='flex items-center gap-3 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded' >  Delete</button>
          </div>
        </div>

      )}
    </div>
    // </div>
  );
};

export default UserTable;
