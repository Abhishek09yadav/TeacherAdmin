'use client';
import React, { useState, useEffect } from 'react';
import { axiosInstace } from '../../../../lib/axios';

const FormComponent = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    aadhaar: '',
    password: '',
    image: null, // New state for the uploaded image
  });

  const generatePassword = (length = 4) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));

    }
    return password;
  };

  // Generate password on component mount
  useEffect(() => {
    const initialPassword = generatePassword();
    setFormData((prevData) => ({ ...prevData, password: initialPassword }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] }); // Handle file input
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // handleReset(); 
    generatePassword();
    axiosInstace.post('/auth/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        console.log('User added successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error adding user:', error);
      });
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      aadhaar: '',
      password: '',
      image: null, // Reset the image state
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl text-center mb-6">User  Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700">Aadhaar Card Number</label>
            <input
              type="text"
              id="aadhaar"
              name="aadhaar"
              value={formData.aadhaar}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="text" // Change to text to allow visibility and editing
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange} // Allow user to edit
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Upload Image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-around">
            <button type="submit" className="w-1/3 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Submit</button>
            <button type="button" onClick={handleReset} className="w-1/3 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400">Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormComponent;
