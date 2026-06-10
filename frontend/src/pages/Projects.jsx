import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useGet } from '../hooks/useGet';
import { usePost } from '../hooks/usePost';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  const { user } = useAuth();
  const { get, loading, error } = useGet();
  const { post, error: createError } = usePost();
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', deadline: '' });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await get(`/projects${search ? `?keyword=${search}` : ''}`);
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      }
    };
    fetchProjects();
  }, [search, get]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const data = await post('/projects', newProject);
      setProjects([data, ...projects]);
      setIsModalOpen(false);
      setNewProject({ title: '', description: '', deadline: '' });
    } catch (error) {
      console.error('Failed to create project', error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Projects</h1>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            + New Project
          </button>
        )}
      </div>

      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search projects by title..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {error && <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6 border border-red-500/30">{error}</div>}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard key={project._id} project={project} />
          ))}
          {projects.length === 0 && !error && <div className="text-slate-400">No projects found.</div>}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-slate-900 p-8 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Project</h2>
            {createError && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm border border-red-500/30">{createError}</div>}
            <form onSubmit={handleCreateProject} className="flex flex-col gap-4">
              <input 
                type="text" placeholder="Project Title" required
                value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})}
                className="p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
              <textarea 
                placeholder="Description" rows="3"
                value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})}
                className="p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-emerald-500"
              ></textarea>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-400 ml-1">Deadline Date</label>
                <input 
                  type="date" 
                  value={newProject.deadline} onChange={e => setNewProject({...newProject, deadline: e.target.value})}
                  className="p-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-emerald-500 scheme-dark"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
