// components/Sidebar.jsx
"use client"
import { useState } from 'react';
import { FiHome } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { FaUser } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import { FaBook } from "react-icons/fa";
import { GrNotes } from "react-icons/gr";
import { IoMenu } from "react-icons/io5";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState('home');
  const [showTeacherSubmenu, setShowTeacherSubmenu] = useState(false); // State for submenu visibility

  const menus = [
    {
      id: 'home',
      label: 'Home',
      route: '/',
      icon: <FiHome />,
    },
    {
      id: 'teachers',
      label: 'Teachers',
      route: '/teachers',
      icon: <FaUser />,
      submenu: [
        {
          id: 'add-teacher',
          label: 'Add Teacher',
          route: '/teachers/add-teacher',
        },
        {
          id: 'view-teacher',
          label: 'View Teacher',
          route: '/teachers/view-teacher',
        },
        // You can add more submenu items here
      ],
    },
    {
      id: 'batches',
      label: 'Batches',
      route: '/batches',
      icon: <MdGroups />,
    },
    {
      id: 'subjects',
      label: 'Subjects',
      route: '/subjects',
      icon: <FaBook />,
    },
    {
      id: 'chapters',
      label: 'Chapters',
      route: '/chapters',
      icon: <GrNotes />,
    },
  ];


  return (
    <>
      {isOpen ? (
        <div className="fixed w-64 h-screen bg-gray-900 text-white">
          <div className="">
            <h2 className='text-2xl text-center'>  <IoMenu className='mt-4 ml-4' onClick={() => setIsOpen(!isOpen)} /> Admin Panel</h2>
            <img className='w-50 mx-auto' src="/logo.png" alt="logo" />

          </div>
          <nav className="mt-4">
            <ul className="space-y-2">
              {menus.map((menu) => (
                <li key={menu.id}>
                  <button
                    onClick={() => {
                      if (menu.id === 'teachers') {
                        setShowTeacherSubmenu(!showTeacherSubmenu); // Toggle submenu visibility
                      } else {
                        router.push(menu.route);
                        setActiveMenu(menu.id);
                      }
                    }}
                    className={`w-full flex items-center space-x-2 p-2 rounded ${router.pathname === menu.route || activeMenu === menu.id
                      ? 'bg-gray-700 text-white'
                      : 'hover:bg-gray-700'
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
                            className={`w-full flex items-center space-x-2 p-2 rounded ${router.pathname === subMenu.route || activeMenu === subMenu.id
                              ? 'bg-gray-600 text-white'
                              : 'hover:bg-gray-600'
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
        <div className="fixed text-2xl mt-4 ml-4">
          <IoMenu onClick={() => setIsOpen(!isOpen)} />
        </div>
      )}

    </>
  );
};

export default Sidebar;