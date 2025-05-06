"use client";
import React, { useState } from "react";
import PdfUploader from "./PdfUploader";

const Modules = () => {
  const [activeTab, setActiveTab] = useState("Classes");

  const tabs = ["Classes", "Courses", "Sub Topic", "Upload PDF"];

  return (
    <div>
      {/* Navbar */}
      <div className="flex space-x-4  text-sm   justify-center bg-blue-100 shadow">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={` px-4 py-2 
          rounded-md
          transition-all duration-200
          hover:bg-blue-200 ${
            activeTab === tab ? "underline font-bold " : "text-gray-700"
          }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-center mt-5">{activeTab}</h1>

      {/* Conditional Content */}
      {activeTab === "Upload PDF" && <PdfUploader />}
    </div>
  );
};

export default Modules;
