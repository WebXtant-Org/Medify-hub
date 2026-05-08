import Test from '../models/Test.js';
import Result from '../models/Result.js';
import Attendance from '../models/Attendance.js';
import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';

// --- TEST CONTROLLERS ---
export const createTest = async (req, res) => {
  const { title, courseId, questions, duration, totalMarks } = req.body;
  const test = await Test.create({ title, courseId, questions, duration, totalMarks });
  res.status(201).json(test);
};

export const submitTest = async (req, res) => {
  const { testId, answers, score, totalMarks } = req.body;
  const result = await Result.create({ testId, userId: req.user._id, score, totalMarks, answers });
  
  await ActivityLog.create({
    userId: req.user._id,
    action: 'SUBMIT_TEST',
    details: `Submitted test ID: ${testId}, Score: ${score}/${totalMarks}`,
  });

  res.status(201).json(result);
};

export const getTests = async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { status: 'published' };
  const tests = await Test.find(filter).populate('courseId');
  res.json(tests);
};

export const updateTest = async (req, res) => {
  const test = await Test.findById(req.params.id);

  if (test) {
    test.title = req.body.title || test.title;
    test.courseId = req.body.courseId || test.courseId;
    test.questions = req.body.questions || test.questions;
    test.duration = req.body.duration || test.duration;
    test.totalMarks = req.body.totalMarks || test.totalMarks;
    test.status = req.body.status || test.status;

    const updatedTest = await test.save();
    res.json(updatedTest);
  } else {
    res.status(404);
    throw new Error('Test not found');
  }
};

export const deleteTest = async (req, res) => {
  const test = await Test.findById(req.params.id);

  if (test) {
    await test.deleteOne();
    res.json({ message: 'Test removed' });
  } else {
    res.status(404);
    throw new Error('Test not found');
  }
};

export const getTestById = async (req, res) => {
  const test = await Test.findById(req.params.id).populate('courseId');
  if (test) {
    res.json(test);
  } else {
    res.status(404);
    throw new Error('Test not found');
  }
};

export const getTestQuestions = async (req, res) => {
  const test = await Test.findById(req.params.id);
  if (test) {
    // Hide correct answers for students
    const questions = test.questions.map(q => {
      const { correctAnswer, ...rest } = q.toObject ? q.toObject() : q;
      return rest;
    });
    res.json(questions);
  } else {
    res.status(404);
    throw new Error('Test not found');
  }
};

// --- ATTENDANCE CONTROLLERS ---
export const markAttendance = async (req, res) => {
  const { userId, batchId, date, status } = req.body;
  const attendance = await Attendance.create({ userId, batchId, date, status });
  res.status(201).json(attendance);
};

export const getAttendance = async (req, res) => {
  const attendance = await Attendance.find({ batchId: req.params.batchId }).populate('userId', 'name');
  res.json(attendance);
};

// --- NOTIFICATION CONTROLLERS ---
export const sendNotification = async (req, res) => {
  const { title, message, type, targetUsers, isGlobal } = req.body;
  const notification = await Notification.create({ title, message, type, targetUsers, isGlobal });
  res.status(201).json(notification);
};

export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({
    $or: [{ isGlobal: true }, { targetUsers: req.user._id }]
  });
  res.json(notifications);
};
