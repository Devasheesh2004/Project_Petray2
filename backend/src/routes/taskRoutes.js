const express = require('express');
const router = express.Router();
const { updateTask, deleteTask, updateTaskStatus } = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/:id').put(protect, admin, updateTask).delete(protect, admin, deleteTask);
router.route('/:id/status').patch(protect, updateTaskStatus);

module.exports = router;
