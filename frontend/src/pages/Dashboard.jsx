import { useEffect, useState } from 'react';
import { useGet } from '../hooks/useGet';
import StatCard from '../components/StatCard';
import { Layers, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const { get, loading, error } = useGet();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, chartsData] = await Promise.all([
          get('/dashboard/stats'),
          get('/dashboard/charts')
        ]);
        setStats(statsData);
        setCharts(chartsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    };
    fetchDashboardData();
  }, [get]);

  if (error) {
    return (
      <div className="p-8 text-center text-red-400 min-h-screen bg-slate-950 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-2">Error Loading Dashboard</h2>
        <p className="text-slate-400">{error}</p>
      </div>
    );
  }

  if (loading || !stats || !charts) {
    return (
      <div className="text-white p-8 min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const STATUS_COLORS = {
    'pending': '#f59e0b',     // Amber
    'in-progress': '#3b82f6', // Blue
    'completed': '#10b981',   // Emerald
  };

  const PRIORITY_COLORS = {
    'low': '#10b981',         // Emerald
    'medium': '#f59e0b',      // Amber
    'high': '#ef4444',        // Red
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Projects" value={stats.totalProjects} icon={Layers} color="bg-blue-600" />
        <StatCard title="Active Projects" value={stats.activeProjects} icon={CheckCircle} color="bg-emerald-600" />
        <StatCard title="Pending Tasks" value={stats.pendingTasks} icon={Clock} color="bg-amber-500" />
        <StatCard title="Overdue Tasks" value={stats.overdueTasks} icon={AlertTriangle} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 h-96 flex flex-col">
          <h2 className="text-xl font-semibold text-white mb-4">Tasks by Status</h2>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={charts.tasksByStatus} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={80} label>
                  {charts.tasksByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry._id.toLowerCase()] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 h-96 flex flex-col">
          <h2 className="text-xl font-semibold text-white mb-4">Tasks by Priority</h2>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.tasksByPriority} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="_id" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip cursor={{fill: '#334155'}} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {charts.tasksByPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry._id.toLowerCase()] || '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
