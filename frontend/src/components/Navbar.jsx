import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-3">
        {user && (
          <button 
            onClick={onMenuToggle} 
            className="p-2 hover:bg-slate-800 rounded-lg md:hidden transition-colors"
            title="Toggle Menu"
          >
            <Menu size={24} />
          </button>
        )}
        <div className="text-xl font-bold text-emerald-400 tracking-wider">PROJECT PETRAY</div>
      </div>
      {user && (
        <div className="flex items-center gap-4">
          <button onClick={handleLogout} className="p-2 bg-red-600/80 hover:bg-red-600 rounded-lg flex items-center gap-2 transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
