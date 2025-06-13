"use client";
import React, { useState, useEffect } from "react";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IoIosAddCircle, IoIosCloseCircle } from "react-icons/io";
import { axiosInstance } from "../../../lib/axios";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { Dialog } from "primereact/dialog";
import './chapter.css';
import Loader from "@/components/Loader";

export default function ChaptersPage() {
  const [subjects, setSubjects] = useState({});
  const [addChapterButton, setAddChapterButton] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [chapterName, setChapterName] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch subjects and chapters
  const fetchSubjects = () => {
    setLoading(true);
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
      .catch((error) => console.error("Error fetching subjects:", error))
      .finally(() => {
        setLoading(false);
      })
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

      if (response.data.message === "Chapter added successfully to the subject") {
        fetchSubjects();
        setChapterName("");
        setSelectedSubject("");
        setAddChapterButton(false);
      }
      toast.success("Chapter added successfully!");
    } catch (error) {
      console.error("Error adding chapter:", error);
    }
    setLoading(false);
  };

  // Delete chapter
  const handleDeleteChapter = async (subjectId, chapterId) => {
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure to do this.',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            setLoading(true);
            try {
              await axiosInstance.delete(
                `/subject/delete-chapter?subjectId=${subjectId}&chapterId=${chapterId}`,
                { headers: { "Content-Type": "application/json" } }
              );
              fetchSubjects();
              toast.success("Chapter deleted successfully!");
            } catch (error) {
              console.error("Error deleting chapter:", error);
            }
            setLoading(false);
          }
        },
        {
          label: 'No',
          onClick: () => toast.info("Deletion Cancelled !")
        }
      ]
    });
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

  return (
    <div className="p-2 sm:p-4 flex flex-col items-center w-full min-h-[90vhs] bg-transparent">
      <div
        className="w-full max-w-full md:max-w-2xl lg:max-w-3xl bg-white shadow-md rounded-md relative p-4"
        style={{ marginTop: "1rem" }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
          <Loader size="40px" color="#3B82F6" />
        </div>
        ) : (
          <>
          {/* Search Input */}
          <div className="w-full mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </div>

          {/* TabView Component */}
          <TabView className="no-wrap" scrollable>
            {Object.keys(subjects)
              .sort((a, b) => {
                // First sort by search match
                const aIncludes = a.toLowerCase().includes(searchTerm);
                const bIncludes = b.toLowerCase().includes(searchTerm);
                if (aIncludes && !bIncludes) return -1;
                if (!aIncludes && bIncludes) return 1;
                // Then alphabetically
                return a.localeCompare(b);
              })
              .filter(subjectName => 
                searchTerm ? subjectName.toLowerCase().includes(searchTerm) : true
              )
              .map((subjectName) => {
                const { subjectId, chapters } = subjects[subjectName];
                return (
                  <TabPanel key={subjectId} header={subjectName}>
                    <div className="overflow-x-auto">
                      <DataTable
                        value={chapters}
                        paginator
                        rows={5}
                        className="min-w-[300px] sm:min-w-[400px]"
                        responsiveLayout="scroll"
                      >
                        <Column field="chapter" header="Chapter" />
                        <Column
                          body={(rowData) =>
                            deleteChapterButton(rowData, { rowData: { subjectName } })
                          }
                          header="Actions"
                          headerClassName="text-center"
                          bodyClassName="text-center"
                        />
                      </DataTable>
                    </div>
                  </TabPanel>
                );
              })}
          </TabView>
          </>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-4 sm:right-8 z-50">
        {addChapterButton ? (
          <IoIosCloseCircle
            onClick={() => setAddChapterButton(false)}
            className="text-5xl bg-white rounded-full shadow-lg cursor-pointer hover:scale-110 transition-all duration-300"
          />
        ) : (
          <div className="flex text-lg sm:text-2xl font-bold items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline">Add Chapter</span>
            <IoIosAddCircle
              onClick={() => setAddChapterButton(true)}
              className="text-5xl bg-white rounded-full shadow-lg cursor-pointer hover:scale-110 transition-all duration-300"
            />
          </div>
        )}
      </div>

      {/* Chapter Input Form */}
      <Dialog
        header="Add Chapter"
        visible={addChapterButton}
        style={{ width: '90vw', maxWidth: '400px' }}
        onHide={() => setAddChapterButton(false)}
        draggable={false}
        resizable={false}
        className="p-fluid"
      >
        <div className="flex flex-col gap-3">
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

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleAddChapter}
              className="bg-blue-500 text-white rounded p-2 flex-1"
              disabled={loading}
              style={{ boxShadow: 'inset rgb(0 105 125) 2px 2px 5px, inset rgb(82 255 255) -1px -2px 3px' }}
            >
              {loading ? "Adding..." : "Add"}
            </button>
            <button
              onClick={() => setAddChapterButton(false)}
              className="bg-red-500 text-white rounded p-2 flex-1"
              style={{
                boxShadow: "inset 2px 2px 2px #ad2929, inset -2px -2px 3px #ff8e8e"
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
