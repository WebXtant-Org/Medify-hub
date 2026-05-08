import Course from '../models/Course.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
  const { title, description, duration, price } = req.body;

  const course = await Course.create({
    title,
    description,
    duration,
    price
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
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  const courses = await Course.find({});
  res.json(courses);
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    course.title = req.body.title || course.title;
    course.description = req.body.description || course.description;
    course.duration = req.body.duration || course.duration;
    course.price = req.body.price || course.price;
    course.status = req.body.status || course.status;

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
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
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
};

export { createCourse, getCourses, updateCourse, deleteCourse };
