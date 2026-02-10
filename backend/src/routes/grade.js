const router = require('express').Router();
const ctrl = require('../controllers/gradeController');

router.get('/course/:id', ctrl.courseGrades);

module.exports = router;
