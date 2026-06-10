
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-800 text-white h-[calc(100vh-72px)] p-4 flex flex-col gap-2">
      <NavLink to="/" className={({ isActive }) => `p-3 rounded-lg flex items-center gap-3 transition-colors ${isActive ? 'bg-emerald-600' : 'hover:bg-slate-700'}`}>
        <LayoutDashboard size={20} /> Dashboard
      </NavLink>
      <NavLink to="/projects" className={({ isActive }) => `p-3 rounded-lg flex items-center gap-3 transition-colors ${isActive ? 'bg-emerald-600' : 'hover:bg-slate-700'}`}>
        <FolderKanban size={20} /> Projects
      </NavLink>
    </aside>
  );
};

export default Sidebar;
