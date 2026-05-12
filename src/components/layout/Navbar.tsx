import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, CheckSquare, Menu } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/tasks':
        return 'Task Menu';
      default:
        return 'Productivity Dashboard';
    }
  };

  if (!user) return null;

  return (
    <nav className="bg-white border-b h-20 flex items-center px-4 md:px-8 justify-between z-30 shrink-0">
      
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu size={24} />
        </button>

        <div className="flex items-center gap-2 md:hidden">
          <Link to="/" className="flex items-center gap-2 text-blue-600">
            <CheckSquare size={24} />
            <span className="font-bold text-lg">TaskTraker</span>
          </Link>
        </div>

        <div className="hidden md:block">
          <h2 className="text-lg font-bold text-gray-800">{getPageTitle()}</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold text-gray-800">{user.name}</span>
          <span className="text-xs text-gray-500">Active Session</span>
        </div>

        <button
          onClick={handleLogout}
          className="md:hidden text-gray-500 hover:text-red-600 p-2"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};
