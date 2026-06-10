import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold text-emerald-400 tracking-wider">PROJECT PETRAY</div>
      {user && (
        <div className="flex items-center gap-4">
          <span className="font-medium">{user.name} ({user.role})</span>
          <button onClick={handleLogout} className="p-2 bg-red-600/80 hover:bg-red-600 rounded-lg flex items-center gap-2 transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
