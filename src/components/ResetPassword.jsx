"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../lib/axios";
import { useRouter } from "next/navigation";
import Loader from "./Loader";

const ResetPassword = ({ redirectToLogin}) => {
  const [aadhar, setAadhar] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [verified, setVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleVerify = async () => {
    if (!aadhar || !phoneNumber) return toast.info("Please fill all details");

    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/auth/reset-password", { aadhar, phoneNumber });
        setVerified(true);
        console.log("Verify response:", res);
        setUserDetails(res.data.message);
     
        toast.success("User verified. You can reset your password now.");
    
    } catch (err) {
      toast.error("Verification failed. Please check details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
  
    try {
      const res = await axiosInstance.post("/auth/new-password", {
        userId:userDetails._id,
       newpassword: password, // use the key expected by your backend
      });
  
      
        toast.success("Password reset successful!");
        setVerified(false);
        setAadhar("");
        setphoneNumber("");
        setPassword("");
        setConfirmPassword("");
        setUserDetails("");
        console.log("redirect to login response:", redirectToLogin);
        if (redirectToLogin ==='true') {
          // toast.success("Redirecting to login page...");
          router.push("/login");
        }
 
    } catch (err) {
      toast.error("Password reset failed");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Reset Password
        </h2>

        <input
          type="number"
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
          {isLoading ? ( <Loader size="25px" color="#fff" />):"Verify"  }
        </button>
      

        {verified && userDetails.name && (
          <p className="text-green-600 text-center mb-4 text-sm sm:text-base">
            {userDetails.name} verified. You can reset your password now.
          </p>
        )}

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={!verified}
          className={`w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 ${
            verified
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
          className={`w-full px-4 py-2 mb-6 border rounded-lg focus:outline-none focus:ring-2 ${
            verified
              ? "focus:ring-green-500"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        />

        <button
          onClick={handleResetPassword}
          disabled={!verified}
          className={`w-full py-2 rounded-lg text-white transition ${
            verified
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? ( <Loader size="25px" color="#fff" />):"Reset Password"  }
        </button>
        
      { redirectToLogin === 'true' && (<div className="text-end mt-4">
        <a
          onClick={() => router.push('/login')}
          className="rounded-lg text-blue-700 transition mt-4 hover:cursor-pointer"
        >
          Back to Login
        </a>
        </div>)}
      </div>
    </div>
  );
};

export default ResetPassword;
