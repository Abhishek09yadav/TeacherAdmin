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
  addModulePdf,
  getAllClasses,
  getModuleClassByName,
} from "../../../server/common";

const PdfUploader = () => {
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
  formData.append("topicId", selectedTopic._id);
  formData.append("pdf", selectedFile);

  try {
    await addModulePdf(formData);
    toast.success("PDF uploaded successfully.");
    setSelectedFile(null);
    setShowModal(false);

    // Re-fetch module data to update table
    if (selectedClass?.className) {
      const updatedData = await getModuleClassByName(selectedClass.className);
      const courseList = updatedData[0]?.courses || [];
      setModuleData(courseList);
      setCourses(courseList);
    }
  } catch (err) {
    toast.error("Failed to upload PDF.");
    console.error(err);
  }
};


  const removeFile = () => setSelectedFile(null);

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
            pdfs: topic.pdfs,
          });
        }
      }
    }
    return result;
  };

  const pdfViewTemplate = (rowData) => {
    const pdfOptions =
      rowData.pdfs?.map((pdf, index) => ({
        label: `View PDF ${index + 1}`,
        value: `${process.env.NEXT_PUBLIC_PDF_URL}/${pdf.pdf}`,
      })) || [];

    return (
      <div className="space-x-2">
        {rowData.pdfs?.length > 0 ? (
          <Dropdown
            options={pdfOptions}
            onChange={(e) => window.open(e.value, "_blank")}
            placeholder="Select a PDF"
            className="w-full"
          />
        ) : (
          <span className="text-gray-400">No PDFs</span>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Add PDF Button */}
      {/* <div className="m-4 text-right">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setShowModal(true)}
          style={{
            boxShadow:
              "inset rgb(0 105 125) 2px 2px 5px, inset rgb(82 255 255) -1px -2px 3px",
          }}
        >
          Add PDF
        </button>
      </div> */}

      {/* Modal */}
      <Dialog
        header="Upload Module PDF"
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
          <Dropdown
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.value)}
            options={topics}
            optionLabel="subjectTopic"
            placeholder="Select Topic"
            disabled={!selectedSubject}
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
                onClick={handleUpload}
              />
            </div>
          )}
        </div>
      </Dialog>

      {/* Table Section */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3">Module PDFs</h2>

        <div className="flex flex-row flex-wrap gap-4 mb-3">
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
          <Button
            label="Upload PDF"
            icon="pi pi-file-arrow-up"
            className="p-button-primary"
            onClick={() => setShowModal(true)}
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
          <Column body={pdfViewTemplate} header="PDFs" />
        </DataTable>
      </div>
    </div>
  );
};

export default PdfUploader;
