const express = require('express');
const router = express.Router();
const {
    enrollCourse,
    getEnrolledCourses,
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/enroll/:courseId', protect, enrollCourse);
router.get('/courses', protect, getEnrolledCourses);

module.exports = router;
