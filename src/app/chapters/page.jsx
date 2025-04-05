"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IoIosAddCircle, IoIosCloseCircle } from "react-icons/io";
import { axiosInstance } from "../../../lib/axios";
import { FaRegTrashAlt } from "react-icons/fa";

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
          formattedSubjects[subject.subjectName] = {
            subjectId: subject._id,
            chapters: subject.chapters.map((chapter) => ({
              id: chapter._id,
              chapter: chapter.chapterName,
            })),
          };
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
          subjectId: selectedSubject,
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

  // Delete chapter
  const handleDeleteChapter = async (subjectId, chapterId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(
        `/subject/delete-chapter?subjectId=${subjectId}&chapterId=${chapterId}`,
        {
          headers: { "Content-Type": "application/json" },
      
        }
      );

      if (response.data.message === "Chapter deleted successfully") {
        fetchSubjects(); // Refresh subjects after deleting a chapter
      }
    } catch (error) {
      console.error("Error deleting chapter:", error);
    }
    setLoading(false);
  };

  // Render delete button
  const deleteChapterButton = (rowData, { rowData: subjectData }) => {
    const subjectId = subjects[subjectData.subjectName].subjectId;
    return (
      <FaRegTrashAlt
        onClick={() => handleDeleteChapter(subjectId, rowData.id)}
        className="text-red-500 cursor-pointer hover:text-red-700 transition-colors duration-300"
      />
    );
  };

  // Render subject options
  const renderSubjectOptions = () => {
    return Object.keys(subjects).map((subjectName) => (
      <option
        key={subjects[subjectName].subjectId}
        value={subjects[subjectName].subjectId}
      >
        {subjectName}
      </option>
    ));
  };

  return (
    <div className="p-4 flex flex-col items-center relative top-15">
      <div className="card w-full md:w-2/3 lg:w-1/2 bg-white shadow-md relative">
        <TabView className="no-wrap" scrollable>
          {Object.keys(subjects).map((subjectName) => {
            const { subjectId, chapters } = subjects[subjectName];
            return (
              <TabPanel key={subjectId} header={subjectName}>
                <DataTable value={chapters} paginator rows={5}>
                  <Column field="chapter" header="Chapter" />
                  <Column
                    body={(rowData) =>
                      deleteChapterButton(rowData, { rowData: { subjectName } })
                    }
                    header="Actions"
                  />
                </DataTable>
              </TabPanel>
            );
          })}
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
            {renderSubjectOptions()}
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
