'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImExit } from 'react-icons/im';
import { toast } from 'react-toastify';

const Navbar = () => {
  const router = useRouter();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const user = localStorage.getItem("teacher-admin-username");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
    setShowConfirmDialog(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("teacher-admin-username");
    setIsLoggedIn(false);
    setShowConfirmDialog(false);
    router.push("/login");
    toast.success("Logged out successfully!");
  };

  const cancelLogout = () => {
    setShowConfirmDialog(false);
  };

  if (!hasMounted) return null;

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-gray-900 h-[70px] w-full flex items-center px-4">

        {/* Spacer to push logout to right */}
        <div className="flex justify-end w-full">
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm sm:text-base hover:bg-red-600 transition-all"
            >
              <ImExit className="text-white text-[16px]" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </nav>

      {/* Confirmation Modal */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold mb-3">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
              <button
                onClick={cancelLogout}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
