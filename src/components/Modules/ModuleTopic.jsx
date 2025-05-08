"use client";
import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  addModuleTopic,
  getAllClasses,
  getModuleClassByName,
} from "../../../server/common";

const ModuleTopic = () => {
  const [showModal, setShowModal] = useState(false);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [moduleData, setModuleData] = useState([]);

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    getAllClasses()
      .then((data) => setClasses(data))
      .catch((err) => {
        toast.error("Failed to fetch classes.");
        console.error(err);
      });
  }, []);

  const handleClassChange = async (selected) => {
    setSelectedClass(selected);
    setSelectedCourse(null);
    setSelectedSubject(null);
    setSelectedTopic(null);
    setCourses([]);
    setSubjects([]);
    setTopics([]);
    setModuleData([]);

    if (selected) {
      try {
        const data = await getModuleClassByName(selected.className);
        const courseList = data[0]?.courses || [];
        setModuleData(courseList);
        setCourses(courseList);
      } catch (err) {
        toast.error("Failed to fetch module data.");
        console.error(err);
      }
    }
  };

  const handleCourseChange = (selected) => {
    setSelectedCourse(selected);
    setSelectedSubject(null);
    setSelectedTopic(null);
    const subjectList = selected?.subjects || [];
    setSubjects(subjectList);
    setTopics([]);
  };

  const handleSubjectChange = (selected) => {
    setSelectedSubject(selected);
    setSelectedTopic(null);
    const topicList = selected?.topics || [];
    setTopics(topicList);
  };

  const allSelected =
    selectedClass && selectedCourse && selectedSubject && selectedTopic;



 
  const handleAddTopic = async () => {
    if (!selectedCourse || !selectedSubject ) {
      toast.warn("Please select a course, subject, and enter topic.");
      return;
    }

    // const formData = new FormData();
    // formData.append("subjectId", selectedSubject._id);
    // formData.append("subjectTopic", selectedTopic.trim());

    try {
      await addModuleTopic(selectedTopic.trim(), selectedSubject._id);
      toast.success("Topic added successfully.");
      setSelectedTopic(null);
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to add topic.");
      console.error(err);
    }
  };

  // Flatten and filter data for table
  const getFlatData = () => {
    const result = [];

    for (const course of moduleData) {
      if (selectedCourse && course.courseName !== selectedCourse.courseName)
        continue;

      for (const subject of course.subjects || []) {
        if (
          selectedSubject &&
          subject.subjectName !== selectedSubject.subjectName
        )
          continue;

        for (const topic of subject.topics || []) {
          result.push({
            className: selectedClass?.className || "",
            courseName: course.courseName,
            subjectName: subject.subjectName,
            topicName: topic.subjectTopic,
         
          });
        }
      }
    }
    return result;
  };

 

  return (
    <div className="relative">
      {/* Add  Button */}
      <div className="m-4 text-right">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setShowModal(true)}
          style={{
            boxShadow:
              "inset rgb(0 105 125) 2px 2px 5px, inset rgb(82 255 255) -1px -2px 3px",
          }}
        >
          Add Topic
        </button>
      </div>

      {/* Modal */}
      <Dialog
        header="Add Module "
        visible={showModal}
        onHide={() => setShowModal(false)}
        modal
        className="p-fluid w-full md:w-1/2 p-4 md:p-0"
      >
        <div className="space-y-4">
          <Dropdown
            value={selectedClass}
            onChange={(e) => handleClassChange(e.value)}
            options={classes}
            optionLabel="className"
            placeholder="Select Class"
          />
          <Dropdown
            value={selectedCourse}
            onChange={(e) => handleCourseChange(e.value)}
            options={courses}
            optionLabel="courseName"
            placeholder="Select Course"
            disabled={!selectedClass}
          />
          <Dropdown
            value={selectedSubject}
            onChange={(e) => handleSubjectChange(e.value)}
            options={subjects}
            optionLabel="subjectName"
            placeholder="Select Subject"
            disabled={!selectedCourse}
          />
       
        <input
            type="text"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            placeholder="Enter Topic Name"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required  
          />
         
          <Button
            label="Add Topic"
            onClick={handleAddTopic}
            className="p-button-success w-full"
          />
        </div>
      </Dialog>

      {/* Table Section */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3">Module PDFs</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Dropdown
            value={selectedClass}
            onChange={(e) => handleClassChange(e.value)}
            options={classes}
            optionLabel="className"
            placeholder="Filter by Class"
          />
          <Dropdown
            value={selectedCourse}
            onChange={(e) => handleCourseChange(e.value)}
            options={courses}
            optionLabel="courseName"
            placeholder="Filter by Course"
            disabled={!selectedClass}
          />
          <Dropdown
            value={selectedSubject}
            onChange={(e) => handleSubjectChange(e.value)}
            options={subjects}
            optionLabel="subjectName"
            placeholder="Filter by Subject"
            disabled={!selectedCourse}
          />
        </div>

        <DataTable
          value={getFlatData()}
          paginator
          rows={10}
          className="shadow rounded"
        >
          <Column field="className" header="Class" />
          <Column field="courseName" header="Course" />
          <Column field="subjectName" header="Subject" />
          <Column field="topicName" header="Topic" />
    
        </DataTable>
      </div>
    </div>
  );
};

export default ModuleTopic;
