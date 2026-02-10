const express = require('express');
const router = express.Router();
const {
    getStudentGrades,
    getClassGrades,
} = require('../controllers/gradeController');
const { protect, instructor } = require('../middleware/authMiddleware');

router.get('/student', protect, getStudentGrades);
router.get('/course/:courseId', protect, instructor, getClassGrades);

module.exports = router;
