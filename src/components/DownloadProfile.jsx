import React from "react";

const DownloadProfile = ({ formData }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <div className="text-center">
          {formData.image && (
            <img
              src={URL.createObjectURL(formData.image)}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full mx-auto shadow-md"
            />
          )}
          <h2 className="text-2xl font-semibold mt-4">{formData.name}</h2>
          <p className="text-gray-500">{formData.email}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Phone:</span>
            <span>{formData.phoneNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Aadhar:</span>
            <span>{formData.aadhar}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Password:</span>
            <span>{formData.password}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadProfile;
