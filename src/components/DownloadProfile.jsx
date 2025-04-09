import React from "react";


const DownloadProfile = ({ formData, onClose }) => {
  return (
    <div className="w-full flex items-center justify-center bg-gray-100 p-4">
      <div className=" w-full bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <div className="text-center">
          {formData.image && (
            <img
              src={URL.createObjectURL(formData.image)}
              alt="Profile"
              className="w-28 h-28 object-cover rounded-full mx-auto shadow-md"
            />
          )}
          <h2 className="text-2xl font-semibold mt-4">{formData.name}</h2>
          <p className="text-gray-500">{formData.email}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700 mr-3">Phone:</span>
            <span>{formData.phoneNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700 mr-3">Aadhar:</span>
            <span>{formData.aadhar}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700 mr-3">Password:</span>
            <span>{formData.password}</span>
          </div>
        </div>
        <div>
          <button
            onClick={() => {window.print(); onClose();}}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Download Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadProfile;
