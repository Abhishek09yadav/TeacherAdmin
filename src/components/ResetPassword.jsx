"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { axiosInstance } from "../../lib/axios";

const ResetPassword = () => {
  const [aadhar, setAadhar] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [verified, setVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleVerify = async () => {
    if (!aadhar || !phoneNumber) return toast.info("Please fill all details");

    try {
      const res = await axiosInstance.post("/auth/reset-password", { aadhar, phoneNumber });

      if (res.status === 200) {
        setVerified(true);
        console.log("Verify response:", res.data.message.name);
        setName(res.data.message.name);
        toast.success("User verified. You can reset your password now.");
      }
    } catch (err) {
      toast.error("Verification failed. Please check details.");
    }
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const res = await axiosInstance.post("/auth/reset-password", {
        aadhar,
        phoneNumber,
        password,
      });
      if (res.status === 200) {
        toast.success("Password reset successful!");
        setVerified(false);
        setAadhar("");
        setphoneNumber("");
        setPassword("");
        setConfirmPassword("");
        setName("");
      }
    } catch (err) {
      toast.error("Password reset failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Reset Password
        </h2>

        <input
          type="text"
          placeholder="Aadhar Number"
          value={aadhar}
          onChange={(e) => setAadhar(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setphoneNumber(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleVerify}
          className="w-full bg-blue-600 text-white py-2 rounded-lg mb-6 hover:bg-blue-700 transition"
        >
          Verify
        </button>
        {verified && name && (
          <p className="text-green-600 text-center mb-4">
            {name} verified. You can reset your password now.
          </p>
        )}

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={!verified}
          className={`w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 ${verified
              ? "focus:ring-green-500"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={!verified}
          className={`w-full px-4 py-2 mb-6 border rounded-lg focus:outline-none focus:ring-2 ${verified
              ? "focus:ring-green-500"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
        />

        <button
          onClick={handleResetPassword}
          disabled={!verified}
          className={`w-full py-2 rounded-lg text-white transition ${verified
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
