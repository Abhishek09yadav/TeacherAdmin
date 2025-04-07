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
    router.push("/login");
    setShowConfirmDialog(false);
    setIsLoggedIn(false);
    toast.success("Logged out successfully!");
  };

  const cancelLogout = () => {
    setShowConfirmDialog(false);
  };

  // Prevent rendering on server to avoid hydration mismatch
  if (!hasMounted) return null;

  return (
    <>
      <div className='bg-gray-900'>
        <div className='flex justify-between mx-auto items-center px-15 z-0'>
          <div className='w-[15rem]'>
            <img src="/logo.png" alt="logo" />
          </div>
          {isLoggedIn && (
            <div>
              <button
                onClick={handleLogout}
                className='text-white bg-red-500 w-30 h-10 flex justify-center items-center gap-4 rounded-lg'
              >
                <ImExit className='text-white' /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-8 rounded shadow-lg text-center">
            <h2 className="text-2xl mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-center space-x-4">
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
