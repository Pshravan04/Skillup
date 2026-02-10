const express = require('express');
const router = express.Router();
const {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    addLesson,
    getEnrolledCourses,
} = require('../controllers/courseController');
const { protect, instructor } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCourses)
    .post(protect, instructor, createCourse);

router.route('/enrolled')
    .get(protect, getEnrolledCourses);

router.route('/:id')
    .get(getCourseById)
    .put(protect, instructor, updateCourse)
    .delete(protect, instructor, deleteCourse);

router.route('/:id/lessons').post(protect, instructor, addLesson);

module.exports = router;
