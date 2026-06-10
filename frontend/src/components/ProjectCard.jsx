
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const statusColors = {
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
    completed: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    archived: 'bg-slate-500/20 text-slate-400 border-slate-500/50',
  };

  return (
    <Link to={`/projects/${project._id}`} className="block bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-emerald-500 transition-colors shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white">{project.title}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[project.status]}`}>
          {project.status}
        </span>
      </div>
      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
      <div className="text-xs text-slate-500">
        Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
      </div>
    </Link>
  );
};

export default ProjectCard;
