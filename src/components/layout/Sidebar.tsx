import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, LogOut, CheckSquare, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  if (!user) return null;

  return (
    <>

      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      <aside className={`
        fixed md:static inset-y-0 left-0 w-64 bg-white border-r h-full flex flex-col z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-20 px-6 border-b flex items-center justify-between text-blue-600">
          <div className="flex items-center gap-2">
            <CheckSquare size={28} />
            <span className="font-bold text-xl text-gray-900">TaskTraker</span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-gray-500 hover:bg-gray-100 p-1 rounded"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          <NavLink
            to="/"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/tasks"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <ListTodo size={20} />
            <span>Tasks</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t space-y-4">
          <div className="px-4 py-2">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">User</p>
            <p className="text-sm font-medium text-gray-700 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
