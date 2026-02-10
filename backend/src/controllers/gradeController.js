const asyncHandler = require('express-async-handler');
const Submission = require('../models/Submission');
const Course = require('../models/Course');

// @desc    Get student grades
// @route   GET /api/grades/student
// @access  Private/Student
const getStudentGrades = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({
    student: req.user._id,
    grade: { $exists: true }
  })
    .populate('assignment', 'title totalPoints')
    .populate('exam', 'title totalPoints');

  res.json(submissions);
});

// @desc    Get class grades for a course
// @route   GET /api/grades/course/:courseId
// @access  Private/Instructor
const getClassGrades = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized');
  }

  // Find all assignments and exams for this course
  // Then find all submissions for those assignments/exams
  // This is a bit complex query. 
  // Simplified approach: Find submissions where assignment.course == courseId OR exam.course == courseId
  // But Submission schema doesn't reference Course directly (only via assignment/exam).
  // So we fetch Assignments and Exams first.

  // Actually, let's keep it simple. Iterate assignments of the course.

  // Pending optimization: Add courseId to Submission model for easier querying.
  // For now, I will return all submissions for assignments belonging to this course.

  const assignments = await require('../models/Assignment').find({ course: req.params.courseId });
  const exams = await require('../models/Exam').find({ course: req.params.courseId });

  const assignmentIds = assignments.map(a => a._id);
  const examIds = exams.map(e => e._id);

  const submissions = await Submission.find({
    $or: [
      { assignment: { $in: assignmentIds } },
      { exam: { $in: examIds } }
    ]
  })
    .populate('student', 'name email')
    .populate('assignment', 'title totalPoints')
    .populate('exam', 'title totalPoints');

  res.json(submissions);
});

module.exports = {
  getStudentGrades,
  getClassGrades,
};
