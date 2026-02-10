const asyncHandler = require('express-async-handler');
const Submission = require('../models/Submission');

// @desc    Grade a submission
// @route   PUT /api/submissions/:id/grade
// @access  Private/Instructor
const gradeSubmission = asyncHandler(async (req, res) => {
    const { grade, feedback } = req.body;

    const submission = await Submission.findById(req.params.id)
        .populate('assignment')
        .populate('exam');

    if (!submission) {
        res.status(404);
        throw new Error('Submission not found');
    }

    // Verify instructor owns the course
    const Course = require('../models/Course');
    let courseId;

    if (submission.assignment) {
        const Assignment = require('../models/Assignment');
        const assignment = await Assignment.findById(submission.assignment);
        courseId = assignment.course;
    } else if (submission.exam) {
        const Exam = require('../models/Exam');
        const exam = await Exam.findById(submission.exam);
        courseId = exam.course;
    }

    const course = await Course.findById(courseId);

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to grade this submission');
    }

    submission.grade = grade;
    submission.feedback = feedback;
    submission.gradedAt = Date.now();

    const updatedSubmission = await submission.save();

    res.json(updatedSubmission);
});

// @desc    Create a submission for assignment
// @route   POST /api/assignments/:id/submit
// @access  Private/Student
const createSubmission = asyncHandler(async (req, res) => {
    const { fileUrl } = req.body;
    const assignmentId = req.params.id;

    const Assignment = require('../models/Assignment');
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
        res.status(404);
        throw new Error('Assignment not found');
    }

    // Check if student already submitted
    const existingSubmission = await Submission.findOne({
        student: req.user._id,
        assignment: assignmentId
    });

    if (existingSubmission) {
        res.status(400);
        throw new Error('You have already submitted this assignment');
    }

    const submission = await Submission.create({
        student: req.user._id,
        assignment: assignmentId,
        fileUrl,
        submittedAt: Date.now()
    });

    res.status(201).json(submission);
});

module.exports = {
    gradeSubmission,
    createSubmission,
};
