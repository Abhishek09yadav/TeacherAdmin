"use client";
import React, { useState, useEffect } from "react";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IoIosAddCircle, IoIosCloseCircle } from "react-icons/io";
import { axiosInstance } from "../../../lib/axios";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { Dialog } from "primereact/dialog";

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
        subjectName: selectedSubject,
        chapterName: chapterName,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data.message === "Chapter added successfully to the subject") {
      fetchSubjects(); // Refresh subjects after adding a chapter
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
              const response = await axiosInstance.delete(
                `/subject/delete-chapter?subjectId=${subjectId}&chapterId=${chapterId}`,
                {
                  headers: { "Content-Type": "application/json" },
              
                }
              );
        
              if (response.status === 200) {
                fetchSubjects(); 
                toast.success("Chapter deleted successfully!");
            //  setSubjects((prevSubjects) => {
            //    const updatedSubjects = { ...prevSubjects };
            //    const subject =
            //      updatedSubjects[
            //        Object.keys(updatedSubjects).find(
            //          (key) => updatedSubjects[key].subjectId === subjectId
            //        )
            //      ];
            //    if (subject) {
            //      subject.chapters = subject.chapters.filter(
            //        (chapter) => chapter.id !== chapterId
            //      );
            //    }
            //    return updatedSubjects;
               
            //  });
              }
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
          <div className="flex text-2xl font-bold items-center gap-3" >
            Add Chapter
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
  style={{ width: '30vw', maxWidth: '90vw' }}
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

    <div className="flex justify-between">
      <button
        onClick={handleAddChapter}
        className="bg-blue-500 text-white rounded p-2 flex-1 mr-2"
        disabled={loading}
        style={{boxShadow:'inset rgb(0 105 125) 2px 2px 5px, inset rgb(82 255 255) -1px -2px 3px'}}
      >
        {loading ? "Adding..." : "Add"}
      </button>
      <button
        onClick={() => setAddChapterButton(false)}
        className="bg-red-500 text-white rounded p-2 flex-1"
        style={{
          boxShadow:"inset 2px 2px 2px #ad2929, inset -2px -2px 3px #ff8e8e"
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
