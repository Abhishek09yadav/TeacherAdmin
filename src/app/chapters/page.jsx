"use client";
import React, { useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IoIosAddCircle, IoIosCloseCircle } from "react-icons/io";

export default function ChaptersPage() {
  const [addChapterButton, setAddChapterButton] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [chapterName, setChapterName] = useState("");
  const [subjects, setSubjects] = useState({
    Maths: [
      { chapter: "Algebra" },
      { chapter: "Geometry" },
      { chapter: "Calculus" },
    ],
    Physics: [
      { chapter: "Mechanics" },
      { chapter: "Thermodynamics" },
      { chapter: "Electromagnetism" },
    ],
    Chemistry: [
      { chapter: "Organic Chemistry" },
      { chapter: "Inorganic Chemistry" },
      { chapter: "Physical Chemistry" },
    ],
    Biology: [
      { chapter: "Cell Biology" },
      { chapter: "Genetics" },
      { chapter: "Ecology" },
    ],
    Science: [
      { chapter: "Cell Biology" },
      { chapter: "Genetics" },
      { chapter: "Ecology" },
    ],
  });

  const scrollableTabs = Object.keys(subjects).map((subject) => ({
    title: subject,
    content: subjects[subject],
  }));

  const handleAddChapter = () => {
    if (selectedSubject && chapterName) {
      setSubjects((prevSubjects) => {
        return {
          ...prevSubjects,
          [selectedSubject]: [
            ...prevSubjects[selectedSubject],
            { chapter: chapterName },
          ],
        };
      });
      setChapterName("");
      setSelectedSubject("");
      setAddChapterButton(false);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center relative top-15">
      <div className="card w-full md:w-2/3 lg:w-1/2 bg-white shadow-md relative">
        <TabView className="no-wrap" scrollable>
          {scrollableTabs.map((tab) => (
            <TabPanel
              className="p-tabview-nav"
              key={tab.title}
              header={tab.title}
            >
              <DataTable
                value={tab.content}
                paginator
                rows={5}
                responsiveLayout="scroll"
              >
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
            {" "}
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
            >
              Add
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
