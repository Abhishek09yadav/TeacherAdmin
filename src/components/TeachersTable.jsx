"use client";
import { useState } from "react";
import Pagination from "./Pagination"; // import the pagination component

export default function TeachersTable({ data, loading, message }) {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // or any number of rows per page

  // Pagination calculations
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = data.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-full max-w-7xl overflow-x-auto">
      <table className="min-w-[700px] sm:min-w-full table-fixed border border-gray-300 shadow-md rounded-lg text-sm text-center">
        <thead className="sticky top-0 bg-gray-200">
          <tr>
            <th className="border px-2 py-2">S.No.</th>
            <th className="border px-2 py-2">Date</th>
            <th className="border px-2 py-2">Teacher</th>
            <th className="border px-2 py-2">Center</th>
            <th className="border px-2 py-2">Batch</th>
            <th className="border px-2 py-2">Subject</th>
            <th className="border px-2 py-2">Chapter</th>
            <th className="border px-2 py-2">Topic</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={8} className="p-4">
                Loading...
              </td>
            </tr>
          ) : message ? (
            <tr>
              <td colSpan={8} className="p-4 text-gray-600 font-medium">
                {message}
              </td>
            </tr>
          ) : (
            currentUsers.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-100">
                <td className="border px-2 py-2 truncate">
                  {indexOfFirstUser + index + 1}
                </td>
                <td className="border px-2 py-2 truncate">{item.date}</td>
                <td className="border px-2 py-2 truncate">{item.name}</td>
                <td className="border px-2 py-2 truncate">{item.center}</td>
                <td className="border px-2 py-2 truncate">{item.batch}</td>
                <td className="border px-2 py-2 truncate">{item.subject}</td>
                <td className="border px-2 py-2 truncate">{item.chapter}</td>
                <td className="border px-2 py-2 truncate">{item.topic}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Show pagination only when there is data */}
      {data.length > usersPerPage && (
        <Pagination
          usersPerPage={usersPerPage}
          totalUsers={data.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      )}
    </div>
  );
}
