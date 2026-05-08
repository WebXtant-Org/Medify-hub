import express from 'express';
import { createCourse, getCourses, updateCourse, deleteCourse } from '../controllers/courseController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, admin, createCourse)
  .get(getCourses);

router.route('/:id')
  .put(protect, admin, updateCourse)
  .delete(protect, admin, deleteCourse);

export default router;
