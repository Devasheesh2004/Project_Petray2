import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, 'member'); // Defaulting to member
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="p-8 bg-slate-900 rounded-2xl shadow-xl w-96 border border-slate-800">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Create Account</h2>
        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required className="p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-emerald-500" />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-emerald-500" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-emerald-500" />
          <button type="submit" className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors mt-2">Register</button>
        </form>
        <p className="mt-4 text-center text-slate-400 text-sm">
          Already have an account? <Link to="/login" className="text-emerald-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
