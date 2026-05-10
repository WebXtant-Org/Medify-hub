import express from 'express';
import { createCourse, getCourses, getCourseById, updateCourse, deleteCourse, assignUsersToCourse } from '../controllers/courseController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCourses);
router.post('/', protect, admin, createCourse);

router.get('/:id', getCourseById);
router.put('/:id', protect, admin, updateCourse);
router.delete('/:id', protect, admin, deleteCourse);

router.post('/:id/assign-users', protect, admin, assignUsersToCourse);

export default router;
