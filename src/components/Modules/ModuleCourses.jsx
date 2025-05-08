"use client";
import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { toast } from "react-toastify";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  addModulePdfCourse,
  getAllClasses,
  getModuleClassByName,
} from "../../../server/common";

const ModuleCourses = () => {
  const [showModal, setShowModal] = useState(false);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [moduleData, setModuleData] = useState([]);
  const [modalSelectedClass, setFilterSelectedClass] = useState(null);
  // const [modalSelectedClass, setFilterSelectedClass] = useState(null);

  const [courseName, setCourseName] = useState("");

  useEffect(() => {
    getAllClasses()
      .then((data) => setClasses(data))
      .catch((err) => {
        toast.error("Failed to fetch classes.");
        console.error(err);
      });
  }, []);

  const handleClassChange = async (selectedClass, target = "filter") => {
    if (target === "modal") {
      setFilterSelectedClass(selectedClass);
    } else {
      setFilterSelectedClass(selectedClass);
    }

    setCourses([]);
    setModuleData([]);

    if (selectedClass) {
      try {
        const data = await getModuleClassByName(selectedClass.className);
        const courseList = data[0]?.courses || [];
        setModuleData(courseList);
        setCourses(courseList);
      } catch (err) {
        toast.error("Failed to fetch module data.");
        console.error(err);
      }
    }
  };

  const handleAddCourse = async () => {
    if (!modalSelectedClass || !courseName.trim()) {
      toast.warn("Please select a class and enter a course name.");
      return;
    }

    const formData = new FormData();
    // formData.append("classId", modalSelectedClass._id);
    formData.append("courseName", courseName.trim());

    try {
      await addModulePdfCourse(courseName, modalSelectedClass.className);
      toast.success("Course added successfully.");
      setCourseName("");
      setShowModal(false);
      await handleClassChange(modalSelectedClass, "modal");

      if (modalSelectedClass && modalSelectedClass?.className) {
        const updatedData = await getModuleClassByName(
          modalSelectedClass?.className
        );
        const courseList = updatedData[0]?.courses || [];
        setModuleData(courseList);
        setCourses(courseList);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.error || err?.message || "Failed to add course"
      );
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Module Courses</h1>
        {/* <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-shadow shadow-md"
          onClick={() => setShowModal(true)}
        >
          Add Course
        </button> */}
      </div>

      {/* Filter */}
      <div className="mb-6 flex flex-wrap flex-row gap-3 ">
        <Dropdown
          value={modalSelectedClass}
          onChange={(e) => handleClassChange(e.value, "filter")}
          options={classes}
          optionLabel="className"
          placeholder="Filter by Class"
          className="w-full md:w-64"
        />{" "}
        <Button
          label="Add Course"
          icon="pi pi-plus"
          className="p-button-primary"
          onClick={() => setShowModal(true)}
        />
      </div>
      {/* Table */}
      <div className="bg-white rounded-lg shadow p-4 max-w-3xl mx-auto">
        <DataTable value={courses} paginator rows={10} className="w-full">
          <Column field="courseName" header="Course Name" />
        </DataTable>
      </div>

      {/* Modal */}
      <Dialog
        header="Add New Course"
        visible={showModal}
        onHide={() => setShowModal(false)}
        modal
        className="p-fluid w-full md:w-1/2 p-4 md:p-0"
      >
        <div className="space-y-4">
          <Dropdown
            value={modalSelectedClass}
            onChange={(e) => handleClassChange(e.value, "modal")}
            options={classes}
            optionLabel="className"
            placeholder="Select Class"
            className="w-full"
          />
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Enter Course Name"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Button
            label="Add Course"
            onClick={handleAddCourse}
            className="p-button-success w-full"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default ModuleCourses;
