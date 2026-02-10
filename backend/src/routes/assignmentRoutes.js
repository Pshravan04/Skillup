const express = require('express');
const router = express.Router();
const {
    createAssignment,
    getAssignments,
    submitAssignment,
    getSubmissions,
    gradeSubmission,
} = require('../controllers/assignmentController');
const { protect, instructor } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, instructor, createAssignment);

router.route('/course/:courseId')
    .get(protect, getAssignments);

router.route('/:id/submit')
    .post(protect, submitAssignment);

router.route('/:id/submissions')
    .get(protect, instructor, getSubmissions);

router.route('/submissions/:id/grade')
    .put(protect, instructor, gradeSubmission);

module.exports = router;
