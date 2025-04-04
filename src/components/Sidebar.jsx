"use client";
import { useEffect, useState } from "react";
import { FiHome } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import { FaBook } from "react-icons/fa";
import { GrNotes } from "react-icons/gr";
import { IoMenu } from "react-icons/io5";
import { FaFilePdf } from "react-icons/fa6";
import { ImExit } from "react-icons/im";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("home");
  const [showTeacherSubmenu, setShowTeacherSubmenu] = useState(false); // State for submenu visibility
  const [checkLogin, setCheckLogin] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // State for confirmation dialog

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("teacher-admin-username");
    if (!isLoggedIn) {
      router.push("/login");
      setCheckLogin(false);
      setIsOpen(false);
    } else if (isLoggedIn) {
      setCheckLogin(true);
    }
  }, [router]);

  const menus = [
    {
      id: "home",
      label: "Home",
      route: "/",
      icon: <FiHome />,
    },
    {
      id: "teachers",
      label: "Teachers",
      route: "/teachers",
      icon: <FaUser />,
      submenu: [
        {
          id: "add-teacher",
          label: "Add Teacher",
          route: "/teachers/add-teacher",
        },
        {
          id: "view-teachers",
          label: "View Teachers",
          route: "/teachers/view-teachers",
        },
        // You can add more submenu items here
      ],
    },
    {
      id: "batches",
      label: "Batches",
      route: "/batches",
      icon: <MdGroups />,
    },
    {
      id: "subjects",
      label: "Subjects",
      route: "/subjects",
      icon: <FaBook />,
    },
    {
      id: "chapters",
      label: "Chapters",
      route: "/chapters",
      icon: <GrNotes />,
    },
    {
      id: "pdf",
      label: "PDF",
      route: "/pdf",
      icon: <FaFilePdf />,
    },
  ];

  const handleLogout = () => {
    setShowConfirmDialog(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("teacher-admin-username");
    router.push("/login");
    setCheckLogin(false);
    setIsOpen(false);
    setShowConfirmDialog(false);
  };

  const cancelLogout = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      {isOpen && checkLogin ? (
        <div className="fixed w-64 h-screen bg-gray-900 text-white z-10">
          <div className="">
            <h2 className="text-2xl text-center">
              {" "}
              <IoMenu
                className="mt-4 ml-4"
                onClick={() => setIsOpen(!isOpen)}
              />{" "}
              Admin Panel
            </h2>
            <img className="w-50 mx-auto" src="/logo.png" alt="logo" />
          </div>
          <nav className="mt-4">
            <ul className="space-y-2">
              {menus.map((menu) => (
                <li key={menu.id}>
                  <button
                    onClick={() => {
                      if (menu.id === "teachers") {
                        setShowTeacherSubmenu(!showTeacherSubmenu); // Toggle submenu visibility
                      } else {
                        router.push(menu.route);
                        setActiveMenu(menu.id);
                      }
                    }}
                    className={`w-full flex items-center space-x-2 p-2 rounded ${
                      router.pathname === menu.route || activeMenu === menu.id
                        ? "bg-gray-700 text-white"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <span className="text-lg">{menu.icon}</span>
                    <span>{menu.label}</span>
                  </button>
                  {menu.submenu && showTeacherSubmenu && (
                    <ul className="ml-4 mt-2 space-y-1">
                      {menu.submenu.map((subMenu) => (
                        <li key={subMenu.id}>
                          <button
                            onClick={() => {
                              router.push(subMenu.route);
                              setActiveMenu(subMenu.id);
                            }}
                            className={`w-full flex items-center space-x-2 p-2 rounded ${
                              router.pathname === subMenu.route ||
                              activeMenu === subMenu.id
                                ? "bg-gray-600 text-white"
                                : "hover:bg-gray-600"
                            }`}
                          >
                            <span>{subMenu.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 p-2 rounded hover:bg-gray-700 mt-4"
            >
              <span>
                <ImExit />
              </span>
              <span>Logout</span>
            </button>
          </nav>
        </div>
      ) : (
        <div className="fixed text-2xl mt-4 ml-4">
          <IoMenu onClick={() => setIsOpen(!isOpen)} />
        </div>
      )}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
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

export default Sidebar;
