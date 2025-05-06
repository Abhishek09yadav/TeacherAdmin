"use client";
import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import { getAllSubjects } from "../../../server/common";

const PdfUploader = () => {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    // Simulate data fetch
    setClasses([
      { name: "Class 1", code: "C1" },
      { name: "Class 2", code: "C2" },
    ]);
    setCourses([
      { name: "Course A", code: "A" },
      { name: "Course B", code: "B" },
    ]);
    getAllSubjects()
      .then((data) => {
        setSubjects(data);
        console.log("Subjects fetched:", data);
      })
      .catch((err) => {
        toast.error("Failed to fetch subjects.");
        console.error(err);
      });
    setTopics([
      { name: "Algebra", code: "ALG" },
      { name: "Biology", code: "BIO" },
    ]);
  }, []);

  const allSelected =
    selectedClass && selectedCourse && selectedSubject && selectedTopic;

  const handleButtonClick = () => {
    if (!allSelected) {
      toast.warn("Please select all dropdown values first.");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("class", selectedClass.code);
    formData.append("course", selectedCourse.code);
    formData.append("subject", selectedSubject._id);

    formData.append("topic", selectedTopic.code);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      toast.success("PDF uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload PDF.");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md p-6 shadow-lg rounded-lg bg-white space-y-5">
        <Dropdown
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.value)}
          options={classes}
          optionLabel="name"
          placeholder="Select Class"
          className="w-full"
        />
        <Dropdown
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.value)}
          options={courses}
          optionLabel="name"
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
          optionLabel="name"
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

        <Button
          label="Upload PDF"
          icon={<FaUpload />}
          disabled={!allSelected}
          onClick={handleButtonClick}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default PdfUploader;
