import User from '../models/User.js';
import Course from '../models/Course.js';
import Payment from '../models/Payment.js';
import asyncHandler from 'express-async-handler';

// @desc    Get dashboard stats
// @route   GET /api/reports/stats
// @access  Private/Admin
export const getStats = asyncHandler(async (req, res) => {
  const studentCount = await User.countDocuments({ role: 'student' });
  const facultyCount = await User.countDocuments({ role: 'faculty' });
  const courseCount = await Course.countDocuments();
  
  const payments = await Payment.find({ status: 'Paid' });
  const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

  res.json({
    students: studentCount,
    faculty: facultyCount,
    courses: courseCount,
    revenue: totalRevenue
  });
});

// @desc    Get chart data (Revenue & Admissions)
// @route   GET /api/reports/charts
// @access  Private/Admin
export const getChartData = asyncHandler(async (req, res) => {
  // Simple mock implementation for now, can be expanded with real mongo aggregation
  const revenueData = [4000, 5000, 4500, 6000, 7500, 8000, 9500];
  const admissionData = [20, 25, 18, 30, 45, 40, 55];

  res.json({
    revenue: revenueData,
    admissions: admissionData
  });
});
