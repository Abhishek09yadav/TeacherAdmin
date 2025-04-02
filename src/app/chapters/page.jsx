'use client';
import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { IoIosAddCircle, IoIosCloseCircle } from "react-icons/io";

export default function ChaptersPage() {
    const [addChapterButton, setAddChapterButton] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [chapterName, setChapterName] = useState('');
    const [subjects, setSubjects] = useState({
        Maths: [
            { chapter: 'Algebra', topics: 'Linear Equations, Quadratic Equations' },
            { chapter: 'Geometry', topics: 'Triangles, Circles' },
            { chapter: 'Calculus', topics: 'Limits, Derivatives' },
        ],
        Physics: [
            { chapter: 'Mechanics', topics: 'Newton’s Laws, Work and Energy' },
            { chapter: 'Thermodynamics', topics: 'Laws of Thermodynamics' },
            { chapter: 'Electromagnetism', topics: 'Electric Fields, Magnetic Fields' },
        ],
        Chemistry: [
            { chapter: 'Organic Chemistry', topics: 'Hydrocarbons, Functional Groups' },
            { chapter: 'Inorganic Chemistry', topics: 'Periodic Table, Chemical Bonds' },
            { chapter: 'Physical Chemistry', topics: 'Thermodynamics, Kinetics' },
        ],
        Biology: [
            { chapter: 'Cell Biology', topics: 'Cell Structure, Cell Division' },
            { chapter: 'Genetics', topics: 'Mendelian Genetics, DNA Structure' },
            { chapter: 'Ecology', topics: 'Ecosystems, Biodiversity' },
        ],
        Science: [
            { chapter: 'Cell Biology', topics: 'Cell Structure, Cell Division' },
            { chapter: 'Genetics', topics: 'Mendelian Genetics, DNA Structure' },
            { chapter: 'Ecology', topics: 'Ecosystems, Biodiversity' },
        ],
        Sports: [
            { chapter: 'Cell Biology', topics: 'Cell Structure, Cell Division' },
            { chapter: 'Genetics', topics: 'Mendelian Genetics, DNA Structure' },
            { chapter: 'Ecology', topics: 'Ecosystems, Biodiversity' },
        ],
        Enviornment: [
            { chapter: 'Cell Biology', topics: 'Cell Structure, Cell Division' },
            { chapter: 'Genetics', topics: 'Mendelian Genetics, DNA Structure' },
            { chapter: 'Ecology', topics: 'Ecosystems, Biodiversity' },
        ],
        Geograpghy: [
            { chapter: 'Cell Biology', topics: 'Cell Structure, Cell Division' },
            { chapter: 'Genetics', topics: 'Mendelian Genetics, DNA Structure' },
            { chapter: 'Ecology', topics: 'Ecosystems, Biodiversity' },
        ],
    });

    const scrollableTabs = Object.keys(subjects).map((subject) => ({
        title: subject,
        content: subjects[subject],
    }));

    const handleAddChapter = () => {
        if (selectedSubject && chapterName) {
            const updatedSubjects = { ...subjects };
            updatedSubjects[selectedSubject].push({ chapter: chapterName, topics: '' });
            setSubjects(updatedSubjects);
            setChapterName('');
            setSelectedSubject('');
            setAddChapterButton(false);
        }
    };

    return (
        <div>
            <div className="card w-1/3 mx-auto">
                <TabView className='no-wrap' scrollable>
                    {scrollableTabs.map((tab) => {
                        return (
                            <TabPanel className='p-tabview-nav flex flex-col gap-3' key={tab.title} header={tab.title}>
                                <DataTable  value={tab.content} paginator rows={5}>
                                    <Column className='p-tabview-title' field="chapter" header="Chapter" />
                                </DataTable>
                            </TabPanel>
                        );
                    })}
                </TabView>
            </div>

            <div className='relative'>
                <div className="absolute left-70 top-2 transition-transform duration-300 ease-in-out">
                    {addChapterButton ? (
                        <IoIosCloseCircle
                            onClick={() => setAddChapterButton(false)}
                            className='text-4xl bg-white rounded-full cursor-pointer transform scale-110'
                        />
                    ) : (
                        <IoIosAddCircle
                            onClick={() => setAddChapterButton(true)}
                            className='text-4xl bg-white rounded-full cursor-pointer transform scale-110'
                        />
                    )}
                </div>
            </div>

            {addChapterButton && (
                <div className="flex justify-center mx-auto transition-opacity duration-300 ease-in-out opacity-100">
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="border rounded p-2 mr-2 transition-all duration-300 ease-in-out"
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
                        className="border rounded p-2 mr-2 transition-all duration-300 ease-in-out"
                    />
                    <button onClick={handleAddChapter} className="w-[5rem] bg-blue-500 text-white rounded p-2 mr-2 transition-transform duration-1000 ease-in-out transform hover:scale-105">Add</button>
                    <button onClick={() => setAddChapterButton(false)} className="w-[5rem] bg-red-500 text-white rounded p-2 transition-transform duration-1000 ease-in-out transform hover:scale-105">Cancel</button>
                </div>
            )}
        </div>
    );
}