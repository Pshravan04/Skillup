const express = require('express');
const router = express.Router();
const {
    createExam,
    getExams,
    getExamById,
    submitExam,
} = require('../controllers/examController');
const { protect, instructor } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, instructor, createExam);

router.route('/course/:courseId')
    .get(protect, getExams);

router.route('/:id')
    .get(protect, getExamById);

router.route('/:id/submit')
    .post(protect, submitExam);

module.exports = router;
