import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      
      {/* Sidebar Aside */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-800 text-white p-4 flex flex-col gap-2 transition-transform duration-300 transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:h-[calc(100vh-72px)]
      `}>
        {/* Mobile Header / Close Button */}
        <div className="flex justify-between items-center mb-4 md:hidden border-b border-slate-700 pb-3">
          <span className="font-bold text-emerald-400">Navigation</span>
          <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Close Menu">
            <X size={20} />
          </button>
        </div>

        <NavLink 
          to="/" 
          onClick={onClose}
          className={({ isActive }) => `p-3 rounded-lg flex items-center gap-3 transition-colors ${isActive ? 'bg-emerald-600' : 'hover:bg-slate-700'}`}
        >
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        
        <NavLink 
          to="/projects" 
          onClick={onClose}
          className={({ isActive }) => `p-3 rounded-lg flex items-center gap-3 transition-colors ${isActive ? 'bg-emerald-600' : 'hover:bg-slate-700'}`}
        >
          <FolderKanban size={20} /> Projects
        </NavLink>

        {user && (
          <div className="mt-auto flex flex-col items-center gap-1 border-t border-slate-700 pt-4 text-center">
            <div className="font-semibold text-white text-sm">{user.name}</div>
            <div className="text-xs text-slate-400 capitalize bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
              {user.role}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
