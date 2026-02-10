const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
// const Payment = require('../models/Payment'); // Will use later for paid courses

// @desc    Enroll in a course
// @route   POST /api/student/enroll/:courseId
// @access  Private/Student
const enrollCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);

  if (course) {
    // Check if already enrolled
    if (course.enrolledStudents.includes(req.user._id)) {
      res.status(400);
      throw new Error('Already enrolled in this course');
    }

    course.enrolledStudents.push(req.user._id);
    await course.save();

    res.status(200).json({ message: 'Enrolled successfully' });
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Get enrolled courses
// @route   GET /api/student/courses
// @access  Private/Student
const getEnrolledCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ enrolledStudents: req.user._id }).populate('instructor', 'name email');
  res.json(courses);
});

module.exports = {
  enrollCourse,
  getEnrolledCourses,
};
