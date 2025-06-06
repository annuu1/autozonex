import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import { designTokens } from '../utils/designTokens';
import {
  Dashboard as LayoutDashboard,
  BarChart,
  PieChart,
  TrendingUp as LineChart,
  Settings,
  People as Users,
  Notifications as Bell,
  Logout as LogOut,
  Menu as MenuIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Phone,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const onToggle = () => setIsCollapsed(!isCollapsed);

  const navLinks = [
    { id: 'dashboard', to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'watchlist', to: '/watchlist', label: 'Watchlist', icon: BarChart },
    { id: 'notes', to: '/notes', label: 'Notes', icon: PieChart },
    { id: 'trade-journal', to: '/trade-journal', label: 'Trade Journal', icon: LineChart },
    { id: 'all-zones', to: '/all-zones', label: 'All Zones', icon: Users },
    { id: 'price-actions', to: '/price-actions', label: 'Price Actions', icon: Bell },
    { id: 'chart', to: '/chart', label: 'Stock Chart', icon: LineChart },
    { id: 'alerts', to: '/alerts', label: 'Alerts', icon: Bell },
    { id: 'tradeboard', to: '/tradeboard', label: 'TradeBoard', icon: PieChart },
  ];

  const bottomItems = [
    { id: 'profile', to: '/profile', label: 'Profile', icon: Users },
    { id: 'support', to: '/support', label: 'Support', icon: Phone },
    { id: 'settings', to: '/settings', label: 'Settings', icon: Settings },
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
        className={`bg-gray-900 text-white transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-16' : 'w-64'
        } min-h-screen flex flex-col relative`}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                  AutoZone
                </span>
              </div>
            )}
            {isCollapsed && (
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mx-auto">
                <PieChart className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-6 bg-gray-800 border border-gray-600 rounded-full p-1.5 hover:bg-gray-700 transition-colors duration-200 z-10"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-300" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-300" />
          )}
        </button>

        {/* Search Bar */}
        {!isCollapsed && (
          <div className="p-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search parts..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors duration-200"
              />
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navLinks.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              className={({ isActive }) =>
                `w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
              {isCollapsed && (
                <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto">
          {/* Bottom Navigation */}
          <div className="border-t border-gray-700 p-2 space-y-1">
            {bottomItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.to}
                className={({ isActive }) =>
                  `w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                {isCollapsed && (
                  <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </NavLink>
            ))}
          </div>

          {/* User Profile Section */}
          {!isCollapsed && (
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">John Smith</p>
                  <p className="text-xs text-gray-400 truncate">Store Manager</p>
                </div>
              </div>
            </div>
          )}
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