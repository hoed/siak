import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, List, LogOut } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold">My App</div>
      <nav className="flex-1">
        <ul className="space-y-2 p-4">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? 'flex items-center p-2 bg-gray-700 rounded' : 'flex items-center p-2 hover:bg-gray-700 rounded'
              }
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/chart-of-accounts"
              className={({ isActive }) =>
                isActive ? 'flex items-center p-2 bg-gray-700 rounded' : 'flex items-center p-2 hover:bg-gray-700 rounded'
              }
            >
              <List className="mr-2 h-5 w-5" />
              Chart of Accounts
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="p-4">
        <button className="flex items-center p-2 hover:bg-gray-700 rounded w-full">
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;