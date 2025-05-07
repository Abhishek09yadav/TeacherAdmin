"use client";
import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  addModuleSubject,
  getAllClasses,
  getModuleClassByName,
} from "../../../server/common";

const SubjectAdder = () => {
  const [showModal, setShowModal] = useState(false);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [moduleData, setModuleData] = useState([]);

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newSubject, setNewSubject] = useState("");

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
    setCourses([]);
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
  };

  const handleAddSubject = async () => {
    if (!selectedCourse || !newSubject.trim()) {
      toast.warn("Please select a course and enter a subject name.");
      return;
    }

    try {
      await addModuleSubject(newSubject.trim(), selectedCourse.courseName);
      toast.success("Subject added successfully.");
      setNewSubject("");
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to add subject.");
    }
  };

  const getFlatData = () => {
    const result = [];

    for (const course of moduleData) {
      if (selectedCourse && course.courseName !== selectedCourse.courseName)
        continue;

      for (const subject of course.subjects || []) {
        result.push({
          className: selectedClass?.className || "",
          courseName: course.courseName,
          subjectName: subject.subjectName,
        });
      }
    }

    return result;
  };

  return (
    <div className="relative">
      {/* Add Subject Button */}
      <div className="m-4 text-right">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setShowModal(true)}
          style={{
            boxShadow:
              "inset rgb(0 105 125) 2px 2px 5px, inset rgb(82 255 255) -1px -2px 3px",
          }}
        >
          Add Subject
        </button>
      </div>

      {/* Modal */}
      <Dialog
        header="Add Subject to Course"
        visible={showModal}
        onHide={() => setShowModal(false)}
        modal
        className="p-fluid w-full md:w-1/2"
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
          <input
            type="text"
            className="p-inputtext w-full"
            placeholder="Enter Subject Name"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
          />
          <Button
            label="Add Subject"
            className="p-button-success w-full"
            onClick={handleAddSubject}
          />
        </div>
      </Dialog>

      {/* Table */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3">Subjects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
        </div>

        <DataTable value={getFlatData()} paginator rows={10}>
          <Column field="className" header="Class" />
          <Column field="courseName" header="Course" />
          <Column field="subjectName" header="Subject" />
        </DataTable>
      </div>
    </div>
  );
};

export default SubjectAdder;
