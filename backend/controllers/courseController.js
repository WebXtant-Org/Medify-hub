import asyncHandler from 'express-async-handler';
import Course from '../models/Course.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = asyncHandler(async (req, res) => {
  const { 
    title, description, duration, price, status,
    fullDescription, highlights, focusAreas, details, examOverview 
  } = req.body;

  const course = await Course.create({
    title,
    description,
    duration,
    price,
    status: status || 'active',
    fullDescription,
    highlights,
    focusAreas,
    details,
    examOverview
  });

  if (course) {
    await ActivityLog.create({
      userId: req.user._id,
      action: 'CREATE_COURSE',
      details: `Created course: ${course.title}`,
    });
    res.status(201).json(course);
  } else {
    res.status(400);
    throw new Error('Invalid course data');
  }
});

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({});
  res.json(courses);
});

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    res.json(course);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = asyncHandler(async (req, res) => {
  const { 
    title, description, duration, price, status,
    fullDescription, highlights, focusAreas, details, examOverview 
  } = req.body;

  const course = await Course.findById(req.params.id);

  if (course) {
    course.title = title || course.title;
    course.description = description || course.description;
    course.duration = duration || course.duration;
    course.price = price || course.price;
    course.status = status || course.status;
    course.fullDescription = fullDescription || course.fullDescription;
    course.highlights = highlights || course.highlights;
    course.focusAreas = focusAreas || course.focusAreas;
    course.details = details || course.details;
    course.examOverview = examOverview || course.examOverview;

    const updatedCourse = await course.save();

    await ActivityLog.create({
      userId: req.user._id,
      action: 'UPDATE_COURSE',
      details: `Updated course: ${course.title}`,
    });

    res.json(updatedCourse);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    await course.deleteOne();
    await ActivityLog.create({
      userId: req.user._id,
      action: 'DELETE_COURSE',
      details: `Deleted course: ${course.title}`,
    });
    res.json({ message: 'Course removed' });
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

const assignUsersToCourse = asyncHandler(async (req, res) => {
  const { userIds } = req.body;
  const course = await Course.findById(req.params.id);

  if (course) {
    course.assignedUserIds = userIds;
    await course.save();

    await ActivityLog.create({
      userId: req.user._id,
      action: 'ASSIGN_USERS_TO_COURSE',
      details: `Assigned ${userIds.length} users to course: ${course.title}`,
    });

    res.json(course);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

export { createCourse, getCourses, getCourseById, updateCourse, deleteCourse, assignUsersToCourse };
