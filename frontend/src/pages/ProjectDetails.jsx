import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useGet } from '../hooks/useGet';
import { usePost } from '../hooks/usePost';
import { usePut } from '../hooks/usePut';
import { usePatch } from '../hooks/usePatch';
import { useDelete } from '../hooks/useDelete';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { get, loading, error } = useGet();
  const { post, error: createError } = usePost();
  const { put, error: updateError } = usePut();
  const { patch, error: patchError } = usePatch();
  const { del, error: deleteError } = useDelete();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', dueDate: '', assignedTo: '' });

  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      try {
        const [projectData, tasksData, usersData] = await Promise.all([
          get(`/projects/${id}`),
          get(`/projects/${id}/tasks`),
          get('/auth/users')
        ]);
        setProject(projectData);
        setTasks(tasksData);
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch details', error);
      }
    };
    fetchProjectAndTasks();
  }, [id, get]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await patch(`/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const data = await post(`/projects/${id}/tasks`, newTask);
      // Data might not have populated assignedTo, so refetch tasks just in case, or manually populate
      setTasks([data, ...tasks]);
      setIsModalOpen(false);
      setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', assignedTo: '' });
      // Fetch fresh tasks to ensure populated fields are loaded
      const tasksData = await get(`/projects/${id}/tasks`);
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await del(`/tasks/${taskId}`);
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  const handleAssignChange = async (taskId, newAssignee) => {
    try {
      await put(`/tasks/${taskId}`, { assignedTo: newAssignee });
      const tasksData = await get(`/projects/${id}/tasks`);
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to reassign task', error);
    }
  };

  const memberUsers = users.filter(u => u.role === 'member');

  if (error) {
    return (
      <div className="p-8 text-center text-red-400 min-h-screen bg-slate-950 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-2">Error Loading Project Details</h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <button 
          onClick={() => navigate('/projects')}
          className="bg-slate-850 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-semibold transition-colors border border-slate-700"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  if (loading || !project) {
    return (
      <div className="text-white p-8 min-h-screen bg-slate-950 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <button 
        onClick={() => navigate('/projects')} 
        className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-6 font-semibold"
      >
        <ArrowLeft size={20} /> Back to Projects
      </button>
      
      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 mb-8 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">{project.title}</h1>
        <p className="text-slate-400 mb-4">{project.description}</p>
        <div className="flex gap-4 text-sm font-semibold">
          <span className="text-emerald-400">Status: {project.status}</span>
          <span className="text-blue-400">Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}</span>
        </div>
      </div>

      {(patchError || updateError || deleteError) && (
        <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6 border border-red-500/30">
          {patchError || updateError || deleteError}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Tasks</h2>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            + Add Task
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => (
          <TaskCard 
            key={task._id} 
            task={task} 
            users={memberUsers}
            onStatusChange={handleStatusChange} 
            onDelete={user?.role === 'admin' ? handleDeleteTask : null} 
            onAssignChange={handleAssignChange}
          />
        ))}
        {tasks.length === 0 && <div className="text-slate-400">No tasks for this project yet.</div>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-slate-900 p-8 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Add New Task</h2>
            {createError && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm border border-red-500/30">{createError}</div>}
            <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
              <input 
                type="text" placeholder="Task Title" required
                value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                className="p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
              <textarea 
                placeholder="Description" rows="3"
                value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}
                className="p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-emerald-500"
              ></textarea>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-400 ml-1">Priority</label>
                <div className="relative">
                  <select 
                    value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full p-3 pr-10 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-400 ml-1">Assign To</label>
                <div className="relative">
                  <select 
                    required
                    value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                    className="w-full p-3 pr-10 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none"
                  >
                    <option value="" disabled>Select a Member</option>
                    {memberUsers.map(user => (
                      <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-400 ml-1">Due Date</label>
                <input 
                  type="date" 
                  value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                  className="p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-emerald-500 scheme-dark"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
