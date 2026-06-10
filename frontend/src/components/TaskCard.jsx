import { ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const TaskCard = ({ task, users = [], onStatusChange, onDelete, onAssignChange }) => {
  const { user } = useAuth();
  const priorityColors = {
    high: 'text-red-400',
    medium: 'text-amber-400',
    low: 'text-emerald-400'
  };

  return (
    <div className="bg-slate-800 p-5 rounded-xl shadow border border-slate-700 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-lg font-bold text-white">{task.title}</h4>
          <span className={`text-xs font-bold uppercase ${priorityColors[task.priority]}`}>{task.priority}</span>
        </div>
        <p className="text-sm text-slate-400 mb-4">{task.description}</p>
        {task.dueDate && (
          <p className="text-xs text-slate-500 mb-2">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </p>
        )}
        {user?.role === 'admin' && (
          <div className="flex items-center mt-2">
            <span className="text-xs font-semibold text-blue-400 mr-2">Assignee:</span>
            <div className="relative">
              <select 
                value={task.assignedTo?._id || task.assignedTo || ''} 
                onChange={(e) => onAssignChange(task._id, e.target.value)}
                disabled={task.status === 'completed'}
                className="bg-slate-900 text-blue-400 text-xs p-1 pr-6 rounded border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" disabled>Select User</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" size={12} />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <div className="relative">
          <select 
            value={task.status} 
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            disabled={task.status === 'completed'}
            className="bg-slate-900 text-slate-300 text-sm p-2 pr-8 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>
        {onDelete && task.status !== 'completed' && (
          <button 
            onClick={() => onDelete(task._id)}
            className="text-red-400 hover:text-red-300 transition-colors p-2"
            title="Delete Task"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
