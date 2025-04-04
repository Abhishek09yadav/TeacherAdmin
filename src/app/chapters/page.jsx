"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IoIosAddCircle, IoIosCloseCircle } from "react-icons/io";
import { axiosInstance } from "../../../lib/axios";

export default function ChaptersPage() {
  const [subjects, setSubjects] = useState({});
  const [addChapterButton, setAddChapterButton] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [chapterName, setChapterName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch subjects and chapters
  const fetchSubjects = () => {
    axiosInstance
      .get("/subject/get-subjects")
      .then((response) => {
        const data = response.data;
        const formattedSubjects = {};

        data.forEach((subject) => {
          formattedSubjects[subject.subjectName] = subject.chapters.map(
            (chapter) => ({
              id: chapter._id,
              chapter: chapter.chapterName,
            })
          );
        });

        setSubjects(formattedSubjects);
      })
      .catch((error) => console.error("Error fetching subjects:", error));
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Add new chapter
  const handleAddChapter = async () => {
    if (!selectedSubject || !chapterName) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "/subject/update-chapter",
        {
          subjectName: selectedSubject,
          chapterName: chapterName,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (
        response.data.message === "Chapter added successfully to the subject"
      ) {
        fetchSubjects(); // Refresh subjects after adding a chapter
        setChapterName("");
        setSelectedSubject("");
        setAddChapterButton(false);
      }
    } catch (error) {
      console.error("Error adding chapter:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 flex flex-col items-center relative top-15">
      <div className="card w-full md:w-2/3 lg:w-1/2 bg-white shadow-md relative">
        <TabView className="no-wrap" scrollable>
          {Object.keys(subjects).map((subject) => (
            <TabPanel key={subject} header={subject}>
              <DataTable value={subjects[subject]} paginator rows={5}>
                <Column field="chapter" header="Chapter" />
              </DataTable>
            </TabPanel>
          ))}
        </TabView>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 md:right-10">
        {addChapterButton ? (
          <IoIosCloseCircle
            onClick={() => setAddChapterButton(false)}
            className="text-5xl bg-white rounded-full shadow-lg cursor-pointer hover:scale-110 transition-all duration-300"
          />
        ) : (
          <div className="flex text-2xl font-bold items-center gap-3">
            Add Chapter
            <IoIosAddCircle
              onClick={() => setAddChapterButton(true)}
              className="text-5xl bg-white rounded-full shadow-lg cursor-pointer hover:scale-110 transition-all duration-300"
            />
          </div>
        )}
      </div>

      {/* Chapter Input Form */}
      {addChapterButton && (
        <div className="w-2/3 lg:w-full max-w-md bg-white p-4 rounded shadow-lg mt-8 flex flex-col gap-3 relative">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="">Select Subject</option>
            {Object.keys(subjects).map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
            placeholder="Enter Chapter Name"
            className="border rounded p-2 w-full"
          />
          <div className="flex justify-between">
            <button
              onClick={handleAddChapter}
              className="bg-blue-500 text-white rounded p-2 flex-1 mr-2"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add"}
            </button>
            <button
              onClick={() => setAddChapterButton(false)}
              className="bg-red-500 text-white rounded p-2 flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
