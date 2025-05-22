import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="sm:hidden fixed top-4 left-4 z-20 p-2 bg-blue-500 text-white rounded-md"
      >
        {isOpen ? 'Close' : 'Menu'}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0 sm:w-64 w-3/4 z-10`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-6">AutozoneX</h2>
          <nav>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/tradeboard"
                  className={({ isActive }) =>
                    `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  TradeBoard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/watchlist"
                  className={({ isActive }) =>
                    `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  Watchlist
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/trade-journal"
                  className={({ isActive }) =>
                    `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  Trade Journal
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/all-zones"
                  className={({ isActive }) =>
                    `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  All Zones
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/chart"
                  className={({ isActive }) =>
                    `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  Stock Chart
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  Settings
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 sm:hidden z-0"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;