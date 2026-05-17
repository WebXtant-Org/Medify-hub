import express from 'express';
import { 
  createTest, submitTest, getTests, updateTest, deleteTest, getTestById, getTestQuestions,
  markAttendance, getAttendance, 
  sendNotification, getNotifications,
  getGalleryItems, createGalleryItem, deleteGalleryItem,
  getAchievers, createAchiever, deleteAchiever, updateAchiever,
  getPublicStats
} from '../controllers/otherController.js';
import { protect, admin } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

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

// Gallery
router.get('/gallery', getGalleryItems);
router.post('/gallery', protect, admin, upload.single('image'), createGalleryItem);
router.delete('/gallery/:id', protect, admin, deleteGalleryItem);

// Achievers
router.get('/achievers', getAchievers);
router.post('/achievers', protect, admin, upload.single('image'), createAchiever);
router.put('/achievers/:id', protect, admin, upload.single('image'), updateAchiever);
router.delete('/achievers/:id', protect, admin, deleteAchiever);

// Public Stats
router.get('/public-stats', getPublicStats);

export default router;
