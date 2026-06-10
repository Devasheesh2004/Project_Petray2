const Project = require('../models/Project');
const Task = require('../models/Task');

exports.getStats = async (req, res) => {
  try {
    let projectQuery = {};
    let taskQuery = {};

    if (req.user.role !== 'admin') {
      taskQuery = { assignedTo: req.user._id };
      const memberTasks = await Task.find(taskQuery).select('projectId');
      const projectIds = memberTasks.map(t => t.projectId);
      projectQuery = { $or: [{ _id: { $in: projectIds } }, { createdBy: req.user._id }] };
    }

    const totalProjects = await Project.countDocuments(projectQuery);
    const activeProjects = await Project.countDocuments({ ...projectQuery, status: 'active' });
    const completedProjects = await Project.countDocuments({ ...projectQuery, status: 'completed' });
    
    const totalTasks = await Task.countDocuments(taskQuery);
    const pendingTasks = await Task.countDocuments({ ...taskQuery, status: 'pending' });
    const completedTasks = await Task.countDocuments({ ...taskQuery, status: 'completed' });
    const overdueTasks = await Task.countDocuments({ ...taskQuery, dueDate: { $lt: new Date() }, status: { $ne: 'completed' } });

    res.json({ totalProjects, activeProjects, completedProjects, totalTasks, pendingTasks, completedTasks, overdueTasks });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getCharts = async (req, res) => {
  try {
    let projectMatch = {};
    let taskMatch = {};

    if (req.user.role !== 'admin') {
      taskMatch = { assignedTo: req.user._id };
      const memberTasks = await Task.find(taskMatch).select('projectId');
      const projectIds = memberTasks.map(t => t.projectId);
      projectMatch = { $or: [{ _id: { $in: projectIds } }, { createdBy: req.user._id }] };
    }

    const tasksByStatus = await Task.aggregate([{ $match: taskMatch }, { $group: { _id: "$status", count: { $sum: 1 } } }]);
    const projectsByStatus = await Project.aggregate([{ $match: projectMatch }, { $group: { _id: "$status", count: { $sum: 1 } } }]);
    const tasksByPriority = await Task.aggregate([{ $match: taskMatch }, { $group: { _id: "$priority", count: { $sum: 1 } } }]);

    res.json({ tasksByStatus, projectsByStatus, tasksByPriority });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
