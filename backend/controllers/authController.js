import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import { sendEmailOTP } from '../utils/emailService.js';
import bcrypt from 'bcryptjs';

// @desc    Auth user & get token (Admin/Faculty)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password, deviceId } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Single Device Login Logic
    if (deviceId) {
      user.deviceId = deviceId;
    }
    
    user.lastLogin = Date.now();
    await user.save();

    // Log Activity
    await ActivityLog.create({
      userId: user._id,
      action: 'LOGIN',
      details: `Logged in from device: ${deviceId || 'Unknown'}`,
      userAgent: req.headers['user-agent']
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Send OTP to student (using studentId)
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = asyncHandler(async (req, res) => {
  const { studentId } = req.body;

  const user = await User.findOne({ studentId, role: 'student' });

  if (!user) {
    res.status(404);
    throw new Error('Student not found with this ID');
  }

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins

  // Hash OTP for security
  const salt = await bcrypt.genSalt(10);
  const hashedOtp = await bcrypt.hash(otp, salt);

  user.otp = hashedOtp;
  user.otpExpires = otpExpires;
  await user.save();

  try {
    // Await Email OTP to ensure it's sent
    const targetEmail = user.personalEmail || user.email;
    await sendEmailOTP(targetEmail, otp, user.name);
    
    res.json({ 
      message: 'OTP sent successfully', 
      email: targetEmail 
    });
  } catch (error) {
    console.error('[AUTH ERROR] OTP Send failed:', error.message);
    res.status(500);
    throw new Error(error.message || 'Could not send email. Please check your SMTP credentials in environment variables.');
  }
});

// @desc    Verify OTP and login (Student)
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = asyncHandler(async (req, res) => {
  const { studentId, otp, deviceId } = req.body;

  const user = await User.findOne({ studentId, role: 'student' });

  if (!user || !user.otp || user.otpExpires < Date.now()) {
    res.status(401);
    throw new Error('Invalid or expired OTP');
  }

  // Verify hashed OTP
  const isMatch = await bcrypt.compare(otp, user.otp);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid or expired OTP');
  }

  // Clear OTP to prevent reuse
  user.otp = undefined;
  user.otpExpires = undefined;
  
  if (deviceId) {
    user.deviceId = deviceId;
  }
  
  user.lastLogin = Date.now();
  await user.save();

  // Log Activity
  await ActivityLog.create({
    userId: user._id,
    action: 'LOGIN_EMAIL_OTP',
    details: `Logged in via Email OTP from device: ${deviceId || 'Unknown'}`,
    userAgent: req.headers['user-agent']
  });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    studentId: user.studentId,
    role: user.role,
    token: generateToken(user._id),
  });
});

// @desc    Verify student ID (Step 1 of 2) - Password removed as requested
// @route   POST /api/auth/verify-credentials
// @access  Public
const verifyCredentials = asyncHandler(async (req, res) => {
  const { studentId } = req.body;

  const user = await User.findOne({ studentId, role: 'student' });

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      studentId: user.studentId,
      email: user.email,
      personalEmail: user.personalEmail,
      mobile: user.mobile,
      message: 'ID verified.'
    });
  } else {
    res.status(404);
    throw new Error('Invalid Student ID');
  }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('batchId').populate('courseIds');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export { loginUser, sendOTP, verifyOTP, verifyCredentials, getMe };
