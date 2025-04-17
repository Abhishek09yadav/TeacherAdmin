"use client";
import React, { useState } from "react";
import { axiosInstance } from "../../../../lib/axios";
import { toast } from "react-toastify";
import DownloadProfile from "@/components/DownloadProfile";

const FormComponent = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    aadhar: "",
    password: "",
    image: null,
  });

  const [isProfileDownloadModalOpen, setIsProfileDownloadModalOpen] =
    useState(false);
  const [downloadData, setDownloadData] = useState(null);

  const [loading, setLoading] = useState(false);

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    const length = 8; // Ensuring password is always 8 characters
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (name === "generatePassword") {
      // Check if the email is filled and valid before generating the password

      const newPassword = generatePassword();
      setFormData({ ...formData, password: newPassword });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    if (
      !formData.name ||
      !formData.phoneNumber ||
      !formData.email ||
      !formData.aadhar ||
      !formData.password ||
      !formData.image
    ) {
      toast.warning("Enter all details carefully!");
      return;
    }

    // Validate Aadhar
    if (!validateAadhar(formData.aadhar)) {
      toast.error("Please enter a valid 12-digit Aadhar number");
      return;
    }

    // Validate Password
    if (!validatePassword(formData.password)) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    axiosInstance
      .post("/auth/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 201) {
          toast.success("User added successfully!");
          setDownloadData(formData);
          setIsProfileDownloadModalOpen(true);
          handleReset();
        } else {
          toast.error("Enter all details");
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

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validateAadhar = (aadhar) => {
    const regex = /^\d{12}$/; // Exactly 12 digits
    return regex.test(aadhar);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg shadow-gray-500">
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
              onChange={(e) => {
                // Only allow digits
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 12) {
                  setFormData({ ...formData, aadhar: value });
                }
              }}
              required
              maxLength="12"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500"
            />
            {formData.aadhar && !validateAadhar(formData.aadhar) && (
              <p className="text-red-500 text-sm mt-1">
                Please enter 12 digits for Aadhar number
              </p>
            )}
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
              className="mt-1 block w-full border bg-gray-200 border-gray-300 rounded-md shadow-sm p-2  "
            />
            <button
              type="button"
              name="generatePassword"
              onClick={handleChange}
              className="mt-3 w-full sm:w-auto px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
              style={{
                boxShadow:
                  "inset rgb(0 105 125) 2px 2px 5px, inset rgb(82 255 255) -1px -2px 3px",
              }}
            >
              Generate Password
            </button>
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
              disabled={loading}
              className="w-1/3 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
              style={{
                boxShadow:
                  "inset rgb(0 105 125) 2px 2px 5px, inset rgb(82 255 255) -1px -2px 3px",
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center flex-nowrap mx-auto">
                  <span>Loading... </span>
                  <div className=" animate-spin border-t-2 border-white w-4 h-4 rounded-full"></div>
                </div>
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
      {isProfileDownloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-fit">
            <DownloadProfile
              formData={downloadData}
              onClose={() => setIsProfileDownloadModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FormComponent;
