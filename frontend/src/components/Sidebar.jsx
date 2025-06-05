import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Typography, IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { GlassCard } from '../components/StyledComponents';
import { designTokens } from '../utils/designTokens';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const handleDoubleClick = () => setIsHidden(true);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/watchlist', label: 'Watchlist' },
    { to: '/notes', label: 'Notes' },
    { to: '/trade-journal', label: 'Trade Journal' },
    { to: '/all-zones', label: 'All Zones' },
    { to: '/price-actions', label: 'Price Actions' },
    { to: '/chart', label: 'Stock Chart' },
    { to: '/alerts', label: 'Alerts' },
    { to: '/tradeboard', label: 'TradeBoard' },
    { to: '/settings', label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Toggle Button (Hamburger Icon) */}
      <IconButton
        onClick={toggleSidebar}
        sx={{
          display: { xs: 'block', sm: 'none' },
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1300,
          color: designTokens.colors.white,
          '&:hover': {
            color: designTokens.colors.teal,
            transform: 'scale(1.1)',
          },
          transition: 'transform 0.2s ease, color 0.2s ease',
        }}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </IconButton>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0 sm:w-64 w-3/4 z-1200`}
        onDoubleClick={handleDoubleClick}
        style={{ display: isHidden ? 'none' : 'block' }}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-6">AutozoneX</h2>
          <nav>
            <ul className="space-y-2">
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
                  to="/notes"
                  className={({ isActive }) =>
                    `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  Notes
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
                  to="/price-actions"
                  className={({ isActive }) =>
                    `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  Price Actions
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
                  to="/alerts"
                  className={({ isActive }) =>
                    `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  Alerts
                </NavLink>
              </li>
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
        <Box
          onClick={toggleSidebar}
          sx={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(30, 58, 138, 0.8)', // navyBlue with opacity
            display: { xs: 'block', sm: 'none' },
            zIndex: 1100,
          }}
        />
      )}
    </>
  );
};

export default Sidebar;