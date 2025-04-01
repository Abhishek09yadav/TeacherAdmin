// components/Sidebar.jsx
"use client"
import { useState } from 'react';
import { FiHome, FiUsers, FiSettings, FiMenu } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { FaUser } from "react-icons/fa";
import { MdGroups } from "react-icons/md";

const Sidebar = () => {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState('home');

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
      },
    {
      id: 'batches',
      label: 'Batches',
      route: '/batches',
      icon: <MdGroups />,
    },
    {
      id: 'settings',
      label: 'Settings',
      route: '/settings',
      icon: <FiSettings />,
    },
  ];

  return (
    <div className="fixed w-64 h-screen bg-gray-900 text-white">
      <div className="p-4">
        <h1 className="text-xl font-bold">Sidebar</h1>
      </div>
      <nav className="mt-4">
        <ul className="space-y-2">
          {menus.map((menu) => (
            <li key={menu.id}>
              <button
                onClick={() => {
                  router.push(menu.route);
                  setActiveMenu(menu.id);
                }}
                className={`w-full flex items-center space-x-2 p-2 rounded ${
                  router.pathname === menu.route || activeMenu === menu.id
                    ? 'bg-gray-700 text-white'
                    : 'hover:bg-gray-700'
                }`}
              >
                <span className="text-lg">{menu.icon}</span>
                <span>{menu.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;