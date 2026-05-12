import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

export const PageLayout: React.FC<{ children: React.ReactNode, requireAuth?: boolean }> = ({ children, requireAuth = true }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {user && (
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
        />
      )}
      <div className="flex-grow flex flex-col min-w-0 h-full">
        {user && <Navbar onToggleSidebar={toggleSidebar} />}
        <main className="flex-grow p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
