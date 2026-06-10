const Project = require('../models/Project');
const Task = require('../models/Task');

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      const memberTasks = await Task.find({ assignedTo: req.user._id }).select('projectId');
      const projectIds = memberTasks.map(t => t.projectId);
      query = { $or: [{ _id: { $in: projectIds } }, { createdBy: req.user._id }] };
    }
    const keyword = req.query.keyword ? { title: { $regex: req.query.keyword, $options: 'i' } } : {};
    const projects = await Project.find({ ...query, ...keyword }).populate('createdBy', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('createdBy', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
