import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Course from '../models/Course.js';
import ActivityLog from '../models/ActivityLog.js';

// Helper to generate Student ID
const generateStudentId = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) return 'MHHSGEN001';

  let prefix = 'MHHS';
  const title = course.title.toUpperCase();

  if (title.includes('BMCT') || title.includes('BASIC MEDICAL CODING')) {
    prefix += 'BMCT';
  } else if (title.includes('AMCT') || title.includes('ADVANCED MEDICAL CODING')) {
    prefix += 'AMCT';
  } else if (title.includes('CPC')) {
    prefix += 'CPC';
  } else if (title.includes('CCS')) {
    prefix += 'CCS';
  } else if (title.includes('CRC')) {
    prefix += 'CRC';
  } else if (title.includes('UAE') || title.includes('DUBAI')) {
    prefix += 'UAE';
  } else {
    prefix += 'GEN';
  }

  // Find count of students with this prefix to determine sequence
  const count = await User.countDocuments({ studentId: { $regex: new RegExp('^' + prefix) } });
  const sequence = (count + 1).toString().padStart(3, '0');

  return `${prefix}${sequence}`;
};

// @desc    Register a new user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, mobile, password, role, batchId, courseIds, personalEmail, feesStatus, specialty, salary } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const userRole = role ? role.toLowerCase() : 'student';
  let studentId = undefined;

  if (userRole === 'student') {
    // Generate ID based on the first selected course
    const primaryCourseId = courseIds && courseIds.length > 0 ? courseIds[0] : null;
    studentId = await generateStudentId(primaryCourseId);
  }

  const user = await User.create({
    name,
    studentId,
    email,
    personalEmail,
    feesStatus,
    mobile,
    password,
    role: userRole,
    status: req.body.status ? req.body.status.toLowerCase() : 'active',
    batchId,
    courseIds,
    specialty,
    salary
  });

  if (user) {
    const populatedUser = await User.findById(user._id).populate('batchId').populate('courseIds');

    // Log Activity
    await ActivityLog.create({
      userId: req.user._id,
      action: 'CREATE_USER',
      details: `Created user: ${user.email} (${user.role})${studentId ? ' with ID: ' + studentId : ''}`,
    });

    res.status(201).json(populatedUser);
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const filter = role ? { role: role.toLowerCase() } : {};
  const users = await User.find(filter).populate('batchId').populate('courseIds');
  res.json(users);
});

// @desc    Update user status
// @route   PATCH /api/users/:id/status
// @access  Private/Admin
const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.status = req.body.status || user.status;
    const updatedUser = await user.save();

    // Log Activity
    await ActivityLog.create({
      userId: req.user._id,
      action: 'UPDATE_USER_STATUS',
      details: `Updated user ${user.email} status to ${user.status}`,
    });

    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    
    // Log Activity
    await ActivityLog.create({
      userId: req.user._id,
      action: 'DELETE_USER',
      details: `Deleted user: ${user.email}`,
    });

    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.personalEmail = req.body.personalEmail || user.personalEmail;
    user.feesStatus = req.body.feesStatus || user.feesStatus;
    user.mobile = req.body.mobile || user.mobile;
    user.role = req.body.role ? req.body.role.toLowerCase() : user.role;
    user.status = req.body.status ? req.body.status.toLowerCase() : user.status;
    user.batchId = req.body.batchId || user.batchId;
    user.courseIds = req.body.courseIds || user.courseIds;
    user.specialty = req.body.specialty || user.specialty;
    user.salary = req.body.salary || user.salary;

    if (user.role === 'student') {
      user.studentId = req.body.email || user.studentId;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    const populatedUser = await User.findById(updatedUser._id).populate('batchId').populate('courseIds');

    // Log Activity
    await ActivityLog.create({
      userId: req.user._id,
      action: 'UPDATE_USER',
      details: `Updated user: ${user.email}`,
    });

    res.json(populatedUser);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { registerUser, getUsers, updateUserStatus, deleteUser, updateUser };
