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
import { FaLink } from "react-icons/fa6";
import { IoMdPhotos } from "react-icons/io";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("home");
  const [showTeacherSubmenu, setShowTeacherSubmenu] = useState(false);
  const [checkLogin, setCheckLogin] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);

    const isLoggedIn = localStorage.getItem("teacher-admin-username");
    if (!isLoggedIn) {
      router.push("/login");
      setCheckLogin(false);
      setIsOpen(false);
    } else {
      setCheckLogin(true);
    }
  }, [router]);

  if (!hasMounted) return null;

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
        {
          id: "reset-password",
          label: "Reset Password",
          route: "/teachers/reset-password",
        },
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
    {
      id: "link",
      label: "Link",
      route: "/link",
      icon: <FaLink />,
    },
    {
      id: "banner",
      label: "Banner",
      route: "/banner",
      icon: <IoMdPhotos />,
    },
  ];

  return (
    <>
      {isOpen && checkLogin ? (
        <div className="fixed w-64 h-screen bg-gray-900 text-white z-10 overflow-auto">
          <div className="">
            <h2 className="text-2xl text-center">
              <IoMenu
                className="mt-4 ml-4 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              />
              Admin Panel
            </h2>
            <img className="w-50 mx-auto cursor-pointer" onClick={() => router.push("/")} src="/logo.png" alt="logo" />
          </div>
          <nav className="mt-4">
            <ul className="space-y-2">
              {menus.map((menu) => (
                <li key={menu.id}>
                  <button
                    onClick={() => {
                      if (menu.id === "teachers") {
                        setShowTeacherSubmenu(!showTeacherSubmenu);
                      } else {
                        router.push(menu.route);
                        setActiveMenu(menu.id);
                      }
                    }}
                    className={`w-full flex items-center space-x-2 p-2 rounded ${
                      activeMenu === menu.id
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
          </nav>
        </div>
      ) : (
        <div className="fixed text-2xl mt-1 ml-1 text-white p-3 bg-gray-900 rounded-full">
          <IoMenu className="cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
        </div>
      )}
    </>
  );
};

export default Sidebar;
