// components/layouts/MainLayout.js
import React from 'react';
import Sidebar from '../Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-0">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
