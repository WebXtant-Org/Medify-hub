import express from 'express';
import { 
  createTest, submitTest, getTests, updateTest, deleteTest, getTestById, getTestQuestions,
  markAttendance, getAttendance, 
  sendNotification, getNotifications 
} from '../controllers/otherController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Tests
router.post('/tests', protect, admin, createTest);
router.get('/tests', protect, getTests);
router.get('/tests/:id', protect, getTestById);
router.get('/tests/:id/questions', protect, getTestQuestions);
router.put('/tests/:id', protect, admin, updateTest);
router.delete('/tests/:id', protect, admin, deleteTest);
router.post('/tests/submit', protect, submitTest);

// Attendance
router.post('/attendance', protect, admin, markAttendance);
router.get('/attendance/:batchId', protect, getAttendance);

// Notifications
router.post('/notifications', protect, admin, sendNotification);
router.get('/notifications', protect, getNotifications);

export default router;
