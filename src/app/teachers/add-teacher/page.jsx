"use client";
import React, { useState, useEffect } from "react";
import { axiosInstace } from "../../../../lib/axios";
import { toast } from "react-toastify";

const FormComponent = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    aadhar: "",
    password: "",
    image: null,
  });

  const [loading, setLoading] = useState(false); 

  const generatePassword = (length = 4) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  useEffect(() => {
    const initialPassword = generatePassword();
    setFormData((prevData) => ({ ...prevData, password: initialPassword }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); 

    axiosInstace
      .post("/auth/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 201) {
          toast.success("User added successfully!");
          handleReset();
        }
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        toast.error(`${error.response.data.error}`);
      })
      .finally(() => {
        setLoading(false); 
      });
  };

  const handleReset = () => {
    setFormData({
      name: "",
      phoneNumber: "",
      email: "",
      aadhar: "",
      password: "",
      image: null,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl text-center mb-6">User Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
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
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
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
            <label
              htmlFor="aadhar"
              className="block text-sm font-medium text-gray-700"
            >
              Aadhar Card Number
            </label>
            <input
              type="text"
              id="aadhar"
              name="aadhar"
              value={formData.aadhar}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="text"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Upload Image
            </label>
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
            <button
              type="submit"
              disabled={loading} // Disable button when loading
              className="w-1/3 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              {loading ? (
                <div className="animate-spin border-t-2 border-white w-4 h-4 rounded-full"></div> // Spinner during loading
              ) : (
                "Submit"
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-1/3 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormComponent;
