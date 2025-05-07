"use client";
import React, { useState } from "react";
import PdfUploader from "./PdfUploader";
import ModuleSubject from "./ModuleSubject";
import ModuleClasses from "./ModuleClasses";
import ModuleCourses from "./ModuleCourses";
const Modules = () => {
  const [activeTab, setActiveTab] = useState("Classes");

  const tabs = ["Classes", "Courses", "Subject", "Topic", "Upload PDF"];

  return (
    <div>
      {/* Navbar */}
      <div className="flex md:space-x-4  text-xs md:text-sm  items-center  justify-center bg-blue-100 shadow">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={` px-2 md:px-4 py-2 
          rounded-md
          transition-all duration-200
          hover:bg-blue-200 ${
            activeTab === tab ? " font-bold " : "text-gray-700"
          }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Title */}
      {/* <h1 className="text-2xl font-bold text-center mt-5">{activeTab}</h1> */}

      {/* Conditional Content */}
      {activeTab === "Upload PDF" && <PdfUploader />}
      {activeTab === "Classes" && <ModuleClasses />}
      {activeTab === "Subject" && <ModuleSubject />}
      {activeTab === "Courses" && <ModuleCourses />}
    </div>
  );
};

export default Modules;
