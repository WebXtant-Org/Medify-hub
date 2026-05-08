import ActivityLog from '../models/ActivityLog.js';
import asyncHandler from 'express-async-handler';

// @desc    Get activity logs
// @route   GET /api/logs/activity
// @access  Private/Admin
export const getActivityLogs = asyncHandler(async (req, res) => {
  const logs = await ActivityLog.find()
    .populate('userId', 'name email role')
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(logs);
});

// @desc    Get audit logs (Administrative actions)
// @route   GET /api/logs/audit
// @access  Private/Admin
export const getAuditLogs = asyncHandler(async (req, res) => {
  // Currently we use ActivityLog for everything, but we can filter by admin role or specific actions
  const logs = await ActivityLog.find({ action: { $regex: /CREATE|UPDATE|DELETE|SETTINGS/ } })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(logs);
});
