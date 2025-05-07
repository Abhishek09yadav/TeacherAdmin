"use client";
import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  addModulePdf,
  getAllClasses,
  getAllCourses,
  getAllModuleSubjects,

  getAllTopics,
} from "../../../server/common";

const PdfUploader = () => {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    getAllModuleSubjects()
      .then((data) => setSubjects(data))
      .catch((err) => {
        toast.error("Failed to fetch subjects.");
        console.error(err);
      });
    // Fetch classes from the server
    getAllClasses()
      .then((data) => {
        setClasses(data);
        console.log("Classes data: ", data);
      })
      .catch((err) => {
        toast.error("Failed to fetch classes.");
        console.log(err);
      });

    getAllCourses()
      .then((data) => {
        setCourses(data);
        console.log("Courses data: ", data);
      })
      .catch((err) => {
        toast.error("Failed to fetch courses");
        console.log(err);
      });
    getAllTopics()
      .then((data) => {
        setTopics(data);
        console.log("Topics data: ", data);
      })
      .catch((err) => {
        toast.error("Failed to fetch Topics");
        console.log(err);
      });
  }, []);

  const allSelected =
    selectedClass && selectedCourse && selectedSubject && selectedTopic;

  const handleChooseFile = () => {
    if (!allSelected) {
      toast.warn("Please select all dropdown values first.");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !allSelected) return;

    const formData = new FormData();
    formData.append("className", selectedClass.className);
    formData.append("subjectName", selectedSubject.subjectName);
    formData.append("courseName", selectedCourse.courseName);
    formData.append("topic", selectedTopic.subjectTopic);
    formData.append("pdf", selectedFile);

    addModulePdf(formData)
      .then((data) => {
        console.log("upload res data: ", data);
        toast.success("PDF uploaded successfully.");
        setSelectedFile(null);
      })
      .catch((err) => {
        // console.error("Error uploading PDF:", err);
        toast.error("Failed to upload PDF.");
      });
  };

  const removeFile = () => setSelectedFile(null);

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md p-6 shadow-lg rounded-lg bg-white space-y-5">
        <Dropdown
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.value)}
          options={classes}
          optionLabel="className"
          placeholder="Select Class"
          className="w-full"
        />
        <Dropdown
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.value)}
          options={courses}
          optionLabel="courseName"
          placeholder="Select Course"
          className="w-full"
        />
        <Dropdown
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.value)}
          options={subjects}
          optionLabel="subjectName"
          placeholder="Select Subject"
          className="w-full"
        />
        <Dropdown
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.value)}
          options={topics}
          optionLabel="subjectTopic"
          placeholder="Select Topic"
          className="w-full"
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {!selectedFile ? (
          <Button
            label="Choose PDF"
            icon="pi pi-file"
            className="w-full"
            onClick={handleChooseFile}
            disabled={!allSelected}
          />
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between items-center border p-2 rounded bg-gray-50">
              <span className="text-sm truncate">{selectedFile.name}</span>
              <Button
                icon="pi pi-times"
                className="p-button-text p-button-danger"
                onClick={removeFile}
                tooltip="Remove File"
              />
            </div>
            <Button
              label="Upload PDF"
              icon={<FaUpload />}
              className="w-full"
              onClick={handleUpload}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfUploader;
