const express = require('express');
const router = express.Router();
const { gradeSubmission } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

router.put('/:id/grade', protect, gradeSubmission);

module.exports = router;
